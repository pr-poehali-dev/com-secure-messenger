import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface BotMessage {
  id: string;
  from: "bot" | "user";
  text?: string;
  buttons?: { label: string; action: string }[];
  sticker?: string;
  createdAt: string;
}

interface StickerPack {
  name: string;
  stickers: string[];
}

type BotStep =
  | "welcome"
  | "menu"
  | "create_pack_name"
  | "create_pack_adding"
  | "manage_packs"
  | "view_pack";

const BOT_AVATAR = "🤖";
const MAX_STICKERS = 120;

const EMOJI_SETS = [
  "😀","😂","🥰","😎","🤔","😴","🥳","😤","👍","❤️","🔥","⭐",
  "🎉","🚀","💎","🌙","🌈","☀️","🍕","🎵","💪","🙌","👀","✨",
  "🦁","🐱","🐶","🦊","🐼","🐨","🦋","🌸","🍀","🎭","🎨","🎯",
];

const time = () => new Date().toISOString();
const uid = () => `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const BotChatWindow = () => {
  const [step, setStep] = useState<BotStep>("welcome");
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [packs, setPacks] = useState<StickerPack[]>([]);
  const [currentPack, setCurrentPack] = useState<StickerPack | null>(null);
  const [packNameInput, setPackNameInput] = useState("");
  const [viewPackIndex, setViewPackIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const addBot = (text: string, buttons?: { label: string; action: string }[]) => {
    setMessages(prev => [...prev, { id: uid(), from: "bot", text, buttons, createdAt: time() }]);
  };
  const addUser = (text: string) => {
    setMessages(prev => [...prev, { id: uid(), from: "user", text, createdAt: time() }]);
  };

  useEffect(() => {
    setTimeout(() => {
      addBot(
        "Привет! Я **СтикерБот** — твой официальный помощник 🤖\n\nЯ помогу тебе создать собственные стикерпаки (до 120 стикеров в каждом) и управлять ими прямо здесь!",
        [
          { label: "✏️ Создать стикерпак", action: "create" },
          { label: "📦 Мои стикерпаки", action: "my_packs" },
        ]
      );
    }, 500);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAction = (action: string) => {
    if (action === "create") {
      addUser("✏️ Создать стикерпак");
      setStep("create_pack_name");
      setTimeout(() => addBot("Отлично! Придумай название для своего стикерпака:"), 300);
    } else if (action === "my_packs") {
      addUser("📦 Мои стикерпаки");
      setStep("manage_packs");
      if (packs.length === 0) {
        setTimeout(() => addBot(
          "У тебя пока нет стикерпаков. Создай первый!",
          [{ label: "✏️ Создать стикерпак", action: "create" }]
        ), 300);
      } else {
        setTimeout(() => addBot(
          `У тебя ${packs.length} стикерпак(ов):\n\n${packs.map((p, i) => `${i + 1}. **${p.name}** — ${p.stickers.length} стикеров`).join("\n")}`,
          packs.map((p, i) => ({ label: `📦 ${p.name}`, action: `view_${i}` })).concat([{ label: "✏️ Создать новый", action: "create" }])
        ), 300);
      }
    } else if (action.startsWith("view_")) {
      const idx = parseInt(action.replace("view_", ""));
      setViewPackIndex(idx);
      const pack = packs[idx];
      addUser(`📦 ${pack.name}`);
      setStep("view_pack");
      setTimeout(() => addBot(
        `Стикерпак **${pack.name}** (${pack.stickers.length}/${MAX_STICKERS} стикеров)`,
        [
          { label: "➕ Добавить стикеры", action: `add_to_${idx}` },
          { label: "🗑 Удалить пак", action: `delete_${idx}` },
          { label: "← Назад", action: "my_packs" },
        ]
      ), 300);
    } else if (action.startsWith("add_to_")) {
      const idx = parseInt(action.replace("add_to_", ""));
      setViewPackIndex(idx);
      setCurrentPack({ ...packs[idx] });
      setStep("create_pack_adding");
      setTimeout(() => addBot(
        `Добавляем стикеры в **${packs[idx].name}**.\n\nВыбери эмодзи как стикер (${packs[idx].stickers.length}/${MAX_STICKERS}):`,
      ), 300);
    } else if (action.startsWith("sticker_")) {
      const emoji = action.replace("sticker_", "");
      if (!currentPack) return;
      if (currentPack.stickers.length >= MAX_STICKERS) {
        addBot(`Стикерпак заполнен! Максимум ${MAX_STICKERS} стикеров.`);
        return;
      }
      const updated = { ...currentPack, stickers: [...currentPack.stickers, emoji] };
      setCurrentPack(updated);
      setPacks(prev => {
        const copy = [...prev];
        if (viewPackIndex !== null) copy[viewPackIndex] = updated;
        return copy;
      });
      addUser(emoji);
      const left = MAX_STICKERS - updated.stickers.length;
      setTimeout(() => addBot(
        `Стикер ${emoji} добавлен! (${updated.stickers.length}/${MAX_STICKERS})\n\nОсталось мест: ${left}`,
        updated.stickers.length < MAX_STICKERS
          ? [{ label: "✅ Готово", action: "my_packs" }]
          : [{ label: "📦 Мои стикерпаки", action: "my_packs" }]
      ), 200);
    } else if (action.startsWith("delete_")) {
      const idx = parseInt(action.replace("delete_", ""));
      const name = packs[idx].name;
      addUser(`🗑 Удалить «${name}»`);
      setPacks(prev => prev.filter((_, i) => i !== idx));
      setTimeout(() => addBot(
        `Стикерпак **${name}** удалён.`,
        [
          { label: "✏️ Создать новый", action: "create" },
          { label: "📦 Мои пакеты", action: "my_packs" },
        ]
      ), 300);
    } else if (action === "menu") {
      addUser("← Главное меню");
      setStep("menu");
      setTimeout(() => addBot(
        "Главное меню СтикерБота:",
        [
          { label: "✏️ Создать стикерпак", action: "create" },
          { label: "📦 Мои стикерпаки", action: "my_packs" },
        ]
      ), 300);
    }
  };

  const handlePackNameSubmit = () => {
    const name = packNameInput.trim();
    if (!name) return;
    addUser(name);
    setPackNameInput("");
    const newPack: StickerPack = { name, stickers: [] };
    setCurrentPack(newPack);
    setPacks(prev => {
      const updated = [...prev, newPack];
      setViewPackIndex(updated.length - 1);
      return updated;
    });
    setStep("create_pack_adding");
    setTimeout(() => addBot(
      `Стикерпак **${name}** создан! 🎉\n\nТеперь выбери эмодзи для добавления в пак (0/${MAX_STICKERS}):`,
    ), 300);
  };

  const lastMsg = messages[messages.length - 1];
  const showEmojiPicker = step === "create_pack_adding";

  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-subtle bg-panel flex-shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(var(--tit-blue)), hsl(var(--tit-blue-light)))" }}>
          {BOT_AVATAR}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-primary-cipher">СтикерБот</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-medium text-white"
              style={{ background: "hsl(var(--tit-blue))", fontSize: 10 }}>
              Официальный
            </span>
          </div>
          <div className="text-xs text-secondary-cipher">бот • всегда онлайн</div>
        </div>
        <Icon name="Bot" size={18} className="text-muted-cipher" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-cipher px-4 py-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
            {msg.from === "bot" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 mb-1"
                style={{ background: "linear-gradient(135deg, hsl(var(--tit-blue)), hsl(var(--tit-blue-light)))" }}>
                🤖
              </div>
            )}
            <div className={`max-w-[78%] flex flex-col gap-2 ${msg.from === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed animate-scale-in ${
                msg.from === "user"
                  ? "message-bubble-out text-primary-cipher rounded-br-sm"
                  : "bg-elevated border border-subtle text-primary-cipher rounded-bl-sm"
              }`}>
                {msg.text && renderText(msg.text)}
              </div>
              {msg.buttons && msg.id === lastMsg?.id && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.buttons.map(btn => (
                    <button
                      key={btn.action}
                      onClick={() => handleAction(btn.action)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all hover:opacity-90 text-white"
                      style={{ background: "hsl(var(--tit-blue))", borderColor: "hsl(var(--tit-blue))" }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Emoji picker for sticker adding */}
      {showEmojiPicker && (
        <div className="border-t border-subtle bg-panel px-3 py-2 flex-shrink-0">
          <p className="text-xs text-muted-cipher mb-2">Выбери эмодзи как стикер:</p>
          <div className="grid grid-cols-9 gap-1 max-h-28 overflow-y-auto scrollbar-cipher">
            {EMOJI_SETS.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleAction(`sticker_${emoji}`)}
                className="text-xl hover:scale-125 transition-transform h-9 flex items-center justify-center rounded-lg hover:bg-elevated"
                disabled={!currentPack || currentPack.stickers.length >= MAX_STICKERS}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pack name input */}
      {step === "create_pack_name" && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-subtle bg-panel">
          <div className="flex items-center gap-2">
            <input
              value={packNameInput}
              onChange={e => setPackNameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handlePackNameSubmit()}
              placeholder="Название стикерпака..."
              maxLength={32}
              className="flex-1 bg-deep border border-normal rounded-xl px-4 py-2.5 text-sm text-primary-cipher placeholder:text-muted-cipher focus:outline-none focus:border-[hsl(var(--tit-blue))] transition"
            />
            <button
              onClick={handlePackNameSubmit}
              disabled={!packNameInput.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all"
              style={{ background: "hsl(var(--tit-blue))" }}
            >
              <Icon name="Send" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Default bar when not inputting */}
      {step !== "create_pack_name" && !showEmojiPicker && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-subtle bg-panel">
          <button
            onClick={() => handleAction("menu")}
            className="w-full py-2 rounded-xl text-xs text-secondary-cipher border border-subtle hover:border-[hsl(var(--tit-blue))] hover:text-primary-cipher transition text-center"
          >
            ← Главное меню бота
          </button>
        </div>
      )}
    </div>
  );
};

export default BotChatWindow;
