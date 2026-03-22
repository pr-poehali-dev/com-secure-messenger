import { useState } from "react";
import { User } from "@/types/messenger";
import Icon from "@/components/ui/icon";

interface SettingsProps {
  user: User;
  onUpdate: (u: Partial<User>) => void;
  onLogout: () => void;
}

type Section = "main" | "notifications" | "privacy" | "appearance" | "reactions" | "stickers" | "language" | "storage";

const DEFAULT_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];
const ALL_EMOJIS = ["👍","❤️","😂","😮","😢","🔥","✨","🎉","💯","🙏","😍","🤩","😭","😡","👏","🤝","💪","🥳","🤔","😴","🥰","😎","😤","🌟","💫","🎯","🏆","👑","💎","🚀"];

const THEMES = [
  { id: "dark", label: "Тёмная", colors: ["#0d1117", "#161b22"] },
  { id: "midnight", label: "Полночь", colors: ["#050510", "#0a0a1a"] },
  { id: "forest", label: "Лес", colors: ["#0a130a", "#0f1c0f"] },
  { id: "ocean", label: "Океан", colors: ["#050e1a", "#091526"] },
];

const Settings = ({ user, onUpdate, onLogout }: SettingsProps) => {
  const [section, setSection] = useState<Section>("main");
  const [editBio, setEditBio] = useState(false);
  const [bio, setBio] = useState(user.bio || "");
  const [editName, setEditName] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [reactions, setReactions] = useState<string[]>(DEFAULT_REACTIONS);
  const [notifSound, setNotifSound] = useState(true);
  const [notifPreview, setNotifPreview] = useState(true);
  const [notifVibro, setNotifVibro] = useState(true);
  const [lastSeenVisible, setLastSeenVisible] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [theme, setTheme] = useState("dark");
  const [bubbleStyle, setBubbleStyle] = useState<"rounded" | "sharp">("rounded");

  const toggle = (emoji: string) => {
    if (reactions.includes(emoji)) {
      if (reactions.length > 1) setReactions(prev => prev.filter(r => r !== emoji));
    } else {
      if (reactions.length < 6) setReactions(prev => [...prev, emoji]);
    }
  };

  const saveBio = () => {
    onUpdate({ bio: bio.slice(0, 200) });
    setEditBio(false);
  };
  const saveName = () => {
    onUpdate({ displayName });
    setEditName(false);
  };

  const Row = ({ icon, label, value, onClick, toggle: tog, togVal }: {
    icon: string; label: string; value?: string;
    onClick?: () => void;
    toggle?: boolean; togVal?: boolean;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-elevated/50 transition text-left group"
    >
      <Icon name={icon} size={20} className="text-secondary-cipher flex-shrink-0" />
      <span className="flex-1 text-sm text-primary-cipher">{label}</span>
      {tog !== undefined ? (
        <div
          className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${togVal ? "" : "bg-elevated border border-normal"}`}
          style={togVal ? { background: "hsl(var(--tit-blue))" } : {}}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${togVal ? "left-5" : "left-0.5"}`} />
        </div>
      ) : value ? (
        <span className="text-xs text-muted-cipher">{value}</span>
      ) : (
        <Icon name="ChevronRight" size={16} className="text-muted-cipher" />
      )}
    </button>
  );

  const SectionHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-subtle flex-shrink-0">
      <button onClick={onBack} className="hover:text-primary-cipher text-secondary-cipher transition">
        <Icon name="ArrowLeft" size={20} />
      </button>
      <span className="text-base font-semibold text-primary-cipher">{title}</span>
    </div>
  );

  if (section === "notifications") return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-cipher">
      <SectionHeader title="Уведомления" onBack={() => setSection("main")} />
      <div className="divide-y divide-subtle">
        <Row icon="Volume2" label="Звук уведомлений" toggle togVal={notifSound} onClick={() => setNotifSound(v => !v)} />
        <Row icon="Eye" label="Предпросмотр сообщений" toggle togVal={notifPreview} onClick={() => setNotifPreview(v => !v)} />
        <Row icon="Smartphone" label="Вибрация" toggle togVal={notifVibro} onClick={() => setNotifVibro(v => !v)} />
      </div>
      <div className="px-4 pt-4">
        <p className="text-xs text-muted-cipher">Настройки уведомлений применяются ко всем чатам</p>
      </div>
    </div>
  );

  if (section === "privacy") return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-cipher">
      <SectionHeader title="Конфиденциальность" onBack={() => setSection("main")} />
      <div className="divide-y divide-subtle">
        <Row icon="Clock" label="Последняя активность" toggle togVal={lastSeenVisible} onClick={() => setLastSeenVisible(v => !v)} />
        <Row icon="CheckCheck" label="Подтверждение прочтения" toggle togVal={readReceipts} onClick={() => setReadReceipts(v => !v)} />
      </div>
      <div className="px-4 pt-4 space-y-2">
        <div className="bg-elevated rounded-xl p-3 border border-subtle flex gap-2">
          <Icon name="ShieldCheck" size={16} className="accent-emerald mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-primary-cipher">E2EE активно</p>
            <p className="text-xs text-muted-cipher mt-0.5">Все сообщения шифруются по алгоритму Signal Protocol. Никто кроме собеседника не может их прочитать.</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (section === "appearance") return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-cipher">
      <SectionHeader title="Оформление" onBack={() => setSection("main")} />
      <div className="px-4 py-4 space-y-5">
        <div>
          <p className="text-xs text-muted-cipher mb-3 uppercase tracking-wide">Тема</p>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`rounded-xl p-3 border transition-all flex items-center gap-2 ${theme === t.id ? "border-[hsl(var(--tit-blue))]" : "border-subtle hover:border-normal"}`}
              >
                <div className="flex gap-0.5">
                  {t.colors.map((c, i) => <span key={i} className="w-5 h-5 rounded-sm" style={{ background: c }} />)}
                </div>
                <span className="text-sm text-primary-cipher">{t.label}</span>
                {theme === t.id && <Icon name="Check" size={14} className="ml-auto" style={{ color: "hsl(var(--tit-blue))" }} />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-cipher mb-3 uppercase tracking-wide">Размер текста</p>
          <div className="flex gap-2">
            {([["sm", "Маленький"], ["md", "Средний"], ["lg", "Большой"]] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFontSize(v)}
                className={`flex-1 py-2 rounded-xl text-sm border transition-all ${fontSize === v ? "text-white border-transparent" : "text-secondary-cipher border-subtle hover:border-normal"}`}
                style={fontSize === v ? { background: "hsl(var(--tit-blue))" } : {}}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-cipher mb-3 uppercase tracking-wide">Стиль пузырьков</p>
          <div className="flex gap-2">
            {([["rounded", "Скруглённые"], ["sharp", "Острые"]] as const).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setBubbleStyle(v)}
                className={`flex-1 py-2 rounded-xl text-sm border transition-all ${bubbleStyle === v ? "text-white border-transparent" : "text-secondary-cipher border-subtle hover:border-normal"}`}
                style={bubbleStyle === v ? { background: "hsl(var(--tit-blue))" } : {}}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (section === "reactions") return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-cipher">
      <SectionHeader title="Быстрые реакции" onBack={() => setSection("main")} />
      <div className="px-4 py-4">
        <p className="text-sm text-secondary-cipher mb-4">Выбери до 6 реакций для быстрого доступа</p>
        <div className="bg-elevated rounded-xl p-4 border border-subtle mb-4">
          <p className="text-xs text-muted-cipher mb-2">Твои быстрые реакции:</p>
          <div className="flex gap-2 flex-wrap">
            {reactions.map(r => (
              <button key={r} onClick={() => toggle(r)} className="text-2xl hover:scale-110 transition-transform">
                {r}
              </button>
            ))}
            {reactions.length < 6 && (
              <div className="w-9 h-9 rounded-full border-2 border-dashed border-normal flex items-center justify-center text-muted-cipher">
                <Icon name="Plus" size={14} />
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-cipher mb-3">Все эмодзи:</p>
        <div className="grid grid-cols-7 gap-1">
          {ALL_EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => toggle(emoji)}
              className={`text-2xl h-10 rounded-xl transition-all hover:scale-110 ${reactions.includes(emoji) ? "bg-[hsl(var(--tit-blue)/0.2)] border border-[hsl(var(--tit-blue)/0.5)]" : "hover:bg-elevated"}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (section === "storage") return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-cipher">
      <SectionHeader title="Хранилище и данные" onBack={() => setSection("main")} />
      <div className="px-4 py-4 space-y-3">
        {[
          { label: "Кэш", value: "2.4 МБ", icon: "Database" },
          { label: "Медиафайлы", value: "14.8 МБ", icon: "Image" },
          { label: "Стикеры", value: "0.8 МБ", icon: "Smile" },
        ].map(item => (
          <div key={item.label} className="bg-elevated rounded-xl px-4 py-3 border border-subtle flex items-center gap-3">
            <Icon name={item.icon} size={18} className="text-secondary-cipher" />
            <span className="flex-1 text-sm text-primary-cipher">{item.label}</span>
            <span className="text-sm text-muted-cipher">{item.value}</span>
          </div>
        ))}
        <button className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition mt-2">
          Очистить кэш
        </button>
      </div>
    </div>
  );

  if (section === "language") return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-cipher">
      <SectionHeader title="Язык" onBack={() => setSection("main")} />
      <div className="divide-y divide-subtle">
        {[
          { code: "ru", label: "Русский", native: "Русский" },
          { code: "en", label: "Английский", native: "English" },
          { code: "uk", label: "Украинский", native: "Українська" },
          { code: "de", label: "Немецкий", native: "Deutsch" },
        ].map(lang => (
          <button key={lang.code} className="w-full flex items-center px-4 py-3.5 hover:bg-elevated/50 transition">
            <div className="flex-1 text-left">
              <p className="text-sm text-primary-cipher">{lang.native}</p>
              <p className="text-xs text-muted-cipher">{lang.label}</p>
            </div>
            {lang.code === "ru" && <Icon name="Check" size={16} style={{ color: "hsl(var(--tit-blue))" }} />}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-cipher">
      {/* Profile block */}
      <div className="flex items-center gap-4 px-4 py-5 border-b border-subtle">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-elevated flex items-center justify-center text-2xl font-bold text-primary-cipher overflow-hidden flex-shrink-0"
            style={{ boxShadow: "0 0 0 3px hsl(var(--tit-blue)/0.4)" }}>
            {user.avatarUrl
              ? <img src={user.avatarUrl} className="w-16 h-16 object-cover" />
              : <span>{user.displayName[0].toUpperCase()}</span>}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {editName ? (
            <div className="flex gap-2 items-center">
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="flex-1 bg-deep border border-normal rounded-lg px-2 py-1 text-sm text-primary-cipher focus:outline-none focus:border-[hsl(var(--tit-blue))]"
                maxLength={64}
                autoFocus
              />
              <button onClick={saveName} className="text-xs px-2 py-1 rounded text-white" style={{ background: "hsl(var(--tit-blue))" }}>OK</button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold text-primary-cipher truncate">{user.displayName}</span>
              <button onClick={() => setEditName(true)} className="text-muted-cipher hover:text-secondary-cipher"><Icon name="Pencil" size={13} /></button>
            </div>
          )}
          <p className="text-sm text-secondary-cipher">@{user.username}</p>
          {editBio ? (
            <div className="mt-1 flex gap-1">
              <input
                value={bio}
                onChange={e => setBio(e.target.value)}
                maxLength={200}
                placeholder="О себе..."
                className="flex-1 bg-deep border border-normal rounded-lg px-2 py-0.5 text-xs text-primary-cipher focus:outline-none focus:border-[hsl(var(--tit-blue))]"
                autoFocus
              />
              <button onClick={saveBio} className="text-xs px-2 py-0.5 rounded text-white" style={{ background: "hsl(var(--tit-blue))" }}>OK</button>
            </div>
          ) : (
            <button onClick={() => setEditBio(true)} className="text-xs text-muted-cipher hover:text-secondary-cipher mt-0.5 text-left truncate w-full">
              {user.bio || "+ добавить описание"}
            </button>
          )}
        </div>
      </div>

      {/* Settings sections */}
      <div className="flex-1">
        <div className="py-1.5">
          <div className="px-4 py-1.5">
            <p className="text-xs text-muted-cipher uppercase tracking-wider">Основные</p>
          </div>
          <div className="divide-y divide-subtle">
            <Row icon="Bell" label="Уведомления" onClick={() => setSection("notifications")} />
            <Row icon="Shield" label="Конфиденциальность" onClick={() => setSection("privacy")} />
            <Row icon="Palette" label="Оформление" onClick={() => setSection("appearance")} />
          </div>
        </div>

        <div className="py-1.5">
          <div className="px-4 py-1.5">
            <p className="text-xs text-muted-cipher uppercase tracking-wider">Чаты</p>
          </div>
          <div className="divide-y divide-subtle">
            <Row icon="Smile" label="Быстрые реакции" value={reactions.slice(0, 3).join(" ")} onClick={() => setSection("reactions")} />
            <Row icon="Sticker" label="Стикеры" onClick={() => setSection("stickers")} />
          </div>
        </div>

        <div className="py-1.5">
          <div className="px-4 py-1.5">
            <p className="text-xs text-muted-cipher uppercase tracking-wider">Устройство</p>
          </div>
          <div className="divide-y divide-subtle">
            <Row icon="HardDrive" label="Хранилище и данные" onClick={() => setSection("storage")} />
            <Row icon="Globe" label="Язык" value="Русский" onClick={() => setSection("language")} />
          </div>
        </div>

        <div className="py-1.5">
          <div className="px-4 py-1.5">
            <p className="text-xs text-muted-cipher uppercase tracking-wider">Аккаунт</p>
          </div>
          <div className="divide-y divide-subtle">
            <Row icon="HelpCircle" label="Помощь и поддержка" onClick={() => window.open("https://poehali.dev/help", "_blank")} />
          </div>
        </div>

        <div className="px-4 py-4">
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition flex items-center justify-center gap-2"
          >
            <Icon name="LogOut" size={16} />
            Выйти из аккаунта
          </button>
        </div>

        <div className="px-4 pb-6 text-center">
          <p className="text-xs text-muted-cipher">Тут и Там v1.0.0</p>
          <p className="text-xs text-muted-cipher">Шифрование: E2EE Signal Protocol</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
