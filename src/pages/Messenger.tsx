import { useState, useCallback } from "react";
import { User, Chat, Message } from "@/types/messenger";
import Sidebar from "@/components/messenger/Sidebar";
import ChatList from "@/components/messenger/ChatList";
import ChatWindow from "@/components/messenger/ChatWindow";
import BotChatWindow from "@/components/messenger/BotChatWindow";
import Settings from "@/components/messenger/Settings";
import Icon from "@/components/ui/icon";

type Tab = "chats" | "contacts" | "search" | "profile" | "settings";

interface MessengerProps {
  user: User;
  onLogout: () => void;
}

const BOT_CHAT: Chat = {
  id: "bot-sticker",
  partnerId: "bot",
  partnerName: "СтикерБот",
  partnerUsername: "stickerbot",
  partnerOnline: true,
  lastMessage: "Создай свой первый стикерпак!",
  lastMessageTime: new Date(Date.now() - 60000).toISOString(),
  unreadCount: 1,
};

const DEMO_CHATS: Chat[] = [
  BOT_CHAT,
  {
    id: "demo-1",
    partnerId: "u2",
    partnerName: "Алексей Смирнов",
    partnerUsername: "alex_s",
    partnerOnline: true,
    lastMessage: "Привет! Как дела?",
    lastMessageTime: new Date(Date.now() - 300000).toISOString(),
    unreadCount: 2,
  },
  {
    id: "demo-2",
    partnerId: "u3",
    partnerName: "Мария Козлова",
    partnerUsername: "masha_k",
    partnerOnline: false,
    lastMessage: "Окей, договорились 👍",
    lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0,
  },
  {
    id: "demo-3",
    partnerId: "u4",
    partnerName: "Дмитрий Петров",
    partnerUsername: "dima_p",
    partnerOnline: true,
    lastMessage: "Видел новости?",
    lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 5,
  },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  "demo-1": [
    {
      id: "m1", chatId: "demo-1", senderId: "u2", senderName: "Алексей Смирнов",
      content: "Привет! Как дела?", isEncrypted: true,
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: "m2", chatId: "demo-1", senderId: "me", senderName: "Я",
      content: "Всё отлично, спасибо! А у тебя?", isEncrypted: true,
      createdAt: new Date(Date.now() - 500000).toISOString(),
      reactions: [{ emoji: "👍", count: 1, mine: false }],
    },
    {
      id: "m3", chatId: "demo-1", senderId: "u2", senderName: "Алексей Смирнов",
      content: "Тоже хорошо. Встретимся сегодня?", isEncrypted: true,
      createdAt: new Date(Date.now() - 300000).toISOString(),
    },
  ],
  "demo-2": [
    {
      id: "m4", chatId: "demo-2", senderId: "me", senderName: "Я",
      content: "Мы встречаемся в 18:00?", isEncrypted: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "m5", chatId: "demo-2", senderId: "u3", senderName: "Мария Козлова",
      content: "Окей, договорились 👍", isEncrypted: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

const Messenger = ({ user, onLogout }: MessengerProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chats] = useState<Chat[]>(DEMO_CHATS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(DEMO_MESSAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(user);

  const currentMessages = activeChat ? (messages[activeChat.id] || []) : [];

  const handleSend = useCallback((content: string) => {
    if (!activeChat) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChat.id,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      content,
      isEncrypted: true,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), msg],
    }));
  }, [activeChat, currentUser]);

  const handleReact = useCallback((msgId: string) => {
    if (!activeChat) return;
    const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];
    const emoji = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: (prev[activeChat.id] || []).map(m =>
        m.id === msgId
          ? { ...m, reactions: [...(m.reactions || []), { emoji, count: 1, mine: true }] }
          : m
      ),
    }));
  }, [activeChat]);

  const handleUpdateUser = (upd: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...upd }));
  };

  const isBot = activeChat?.id === "bot-sticker";

  const filteredChats = chats.filter(c => {
    if (!searchQuery) return true;
    return c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.partnerUsername.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderLeftPanel = () => {
    switch (activeTab) {
      case "chats":
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b border-subtle flex-shrink-0 flex items-center gap-2">
              <span className="text-base font-bold text-primary-cipher flex-1">Тут и Там</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-elevated transition text-muted-cipher hover:text-primary-cipher">
                <Icon name="PenSquare" size={17} />
              </button>
            </div>
            <div className="px-3 py-2 flex-shrink-0">
              <div className="relative">
                <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-cipher" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full bg-deep border border-normal rounded-xl pl-8 pr-4 py-2 text-sm text-primary-cipher placeholder:text-muted-cipher focus:outline-none focus:border-[hsl(var(--tit-blue))] transition"
                />
              </div>
            </div>
            <div className="flex-1 min-h-0 py-1">
              <ChatListWithBot
                chats={filteredChats}
                activeChatId={activeChat?.id}
                onSelect={(c) => { setActiveChat(c); }}
              />
            </div>
          </div>
        );

      case "contacts":
        return (
          <div className="flex flex-col h-full">
            <div className="px-4 py-3.5 border-b border-subtle flex items-center gap-3 flex-shrink-0">
              <span className="text-base font-bold text-primary-cipher">Контакты</span>
              <button className="ml-auto w-8 h-8 flex items-center justify-center rounded-xl hover:bg-elevated transition text-muted-cipher">
                <Icon name="UserPlus" size={17} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-16 h-16 rounded-full bg-elevated flex items-center justify-center mx-auto mb-3">
                  <Icon name="Users" size={28} className="text-muted-cipher" />
                </div>
                <p className="text-sm text-secondary-cipher">Контакты появятся здесь</p>
                <p className="text-xs text-muted-cipher mt-1">Найди людей через поиск по @юзернейму</p>
              </div>
            </div>
          </div>
        );

      case "search":
        return (
          <div className="flex flex-col h-full">
            <div className="px-4 py-3.5 border-b border-subtle flex-shrink-0">
              <span className="text-base font-bold text-primary-cipher">Поиск</span>
            </div>
            <div className="px-3 py-3">
              <div className="relative">
                <Icon name="Search" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-cipher" />
                <input
                  autoFocus
                  placeholder="@юзернейм или имя..."
                  className="w-full bg-deep border border-normal rounded-xl pl-8 pr-4 py-2 text-sm text-primary-cipher placeholder:text-muted-cipher focus:outline-none focus:border-[hsl(var(--tit-blue))] transition"
                />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <Icon name="Search" size={32} className="text-muted-cipher mx-auto mb-2" />
                <p className="text-sm text-secondary-cipher">Введи имя или @username</p>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="flex flex-col h-full overflow-y-auto scrollbar-cipher">
            <div className="px-4 py-3.5 border-b border-subtle flex-shrink-0">
              <span className="text-base font-bold text-primary-cipher">Мой профиль</span>
            </div>
            <div className="px-4 py-6 flex flex-col items-center gap-3 border-b border-subtle">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-elevated flex items-center justify-center text-3xl font-bold text-primary-cipher overflow-hidden"
                  style={{ boxShadow: "0 0 0 3px hsl(var(--bg-deep)), 0 0 0 5px hsl(var(--tit-blue)/0.5)" }}>
                  {currentUser.avatarUrl
                    ? <img src={currentUser.avatarUrl} className="w-20 h-20 object-cover" />
                    : <span>{currentUser.displayName[0].toUpperCase()}</span>}
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[hsl(var(--tit-blue))] flex items-center justify-center">
                  <Icon name="Camera" size={12} className="text-white" />
                </button>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-primary-cipher">{currentUser.displayName}</h2>
                <p className="text-secondary-cipher text-sm">@{currentUser.username}</p>
              </div>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div className="bg-elevated rounded-xl p-3 border border-subtle">
                <p className="text-xs text-muted-cipher mb-1">О себе</p>
                <p className="text-sm text-secondary-cipher">{currentUser.bio || "Описание не добавлено"}</p>
              </div>
              <div className="bg-elevated rounded-xl p-3 border border-subtle flex items-center gap-2">
                <Icon name="ShieldCheck" size={14} className="accent-emerald" />
                <div>
                  <p className="text-xs font-medium text-primary-cipher">E2EE активно</p>
                  <p className="text-xs text-muted-cipher">Все сообщения зашифрованы</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("settings")}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-normal hover:border-[hsl(var(--tit-blue))] text-secondary-cipher hover:text-primary-cipher transition text-sm"
              >
                <Icon name="Settings" size={15} />
                Настройки
                <Icon name="ChevronRight" size={14} className="ml-auto" />
              </button>
            </div>
          </div>
        );

      case "settings":
        return (
          <Settings
            user={currentUser}
            onUpdate={handleUpdateUser}
            onLogout={onLogout}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-deep">
      <Sidebar user={currentUser} activeTab={activeTab} onTab={setActiveTab} onLogout={onLogout} />

      {/* Left panel */}
      <div className="w-72 flex-shrink-0 border-r border-subtle flex flex-col h-full bg-panel">
        {renderLeftPanel()}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col h-full bg-deep">
        {activeChat ? (
          isBot ? (
            <BotChatWindow />
          ) : (
            <ChatWindow
              chat={activeChat}
              currentUser={currentUser}
              messages={currentMessages}
              onSend={handleSend}
              onReact={handleReact}
            />
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-8">
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-6xl"
              style={{ background: "linear-gradient(135deg, hsl(var(--tit-blue)/0.15), hsl(var(--tit-blue-light)/0.08))" }}>
              💬
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-cipher mb-1">Тут и Там</h2>
              <p className="text-secondary-cipher text-sm">Выбери чат, чтобы начать общение</p>
            </div>
            <div className="flex items-center gap-2 encrypt-badge rounded-xl px-4 py-2">
              <Icon name="Lock" size={13} className="accent-emerald" />
              <span className="text-xs text-secondary-cipher">Все сообщения защищены E2EE шифрованием</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Кастомный рендер списка чатов с отличием бота
interface ChatListWithBotProps {
  chats: Chat[];
  activeChatId?: string;
  onSelect: (c: Chat) => void;
}

const timeLabel = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return d.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
  if (diff < 604800000) return d.toLocaleDateString("ru", { weekday: "short" });
  return d.toLocaleDateString("ru", { day: "numeric", month: "short" });
};

const ChatListWithBot = ({ chats, activeChatId, onSelect }: ChatListWithBotProps) => (
  <div className="flex flex-col overflow-y-auto scrollbar-cipher h-full">
    {chats.map((chat, i) => {
      const isBot = chat.id === "bot-sticker";
      return (
        <button
          key={chat.id}
          onClick={() => onSelect(chat)}
          className={`flex items-center gap-3 px-3 py-2.5 mx-1.5 rounded-xl transition-all duration-150 text-left animate-fade-in stagger-${Math.min(i + 1, 5)} ${activeChatId === chat.id ? "bg-[hsl(var(--tit-blue)/0.15)] border border-[hsl(var(--tit-blue)/0.2)]" : "hover:bg-elevated/60"}`}
        >
          <div className="relative flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold overflow-hidden ${isBot ? "" : "bg-surface text-primary-cipher"}`}
              style={isBot ? { background: "linear-gradient(135deg, hsl(var(--tit-blue)), hsl(var(--tit-blue-light)))" } : {}}>
              {isBot ? (
                <span className="text-xl">🤖</span>
              ) : chat.partnerAvatar ? (
                <img src={chat.partnerAvatar} className="w-12 h-12 object-cover" />
              ) : (
                <span>{chat.partnerName[0].toUpperCase()}</span>
              )}
            </div>
            {chat.partnerOnline && (
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-panel" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm font-semibold text-primary-cipher truncate">{chat.partnerName}</span>
                {isBot && (
                  <span className="text-[9px] px-1 py-0.5 rounded font-bold text-white flex-shrink-0"
                    style={{ background: "hsl(var(--tit-blue))" }}>ОФ</span>
                )}
              </div>
              <span className="text-xs text-muted-cipher flex-shrink-0 ml-1">{timeLabel(chat.lastMessageTime)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary-cipher truncate">{chat.lastMessage || "Нет сообщений"}</span>
              {(chat.unreadCount ?? 0) > 0 && (
                <span className="ml-1 flex-shrink-0 min-w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold px-1.5 text-white"
                  style={{ background: "hsl(var(--tit-blue))" }}>
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      );
    })}
  </div>
);

export default Messenger;
