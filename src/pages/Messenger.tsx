import { useState, useEffect, useCallback } from "react";
import { User, Chat, Message } from "@/types/messenger";
import Sidebar from "@/components/messenger/Sidebar";
import ChatList from "@/components/messenger/ChatList";
import ChatWindow from "@/components/messenger/ChatWindow";
import Icon from "@/components/ui/icon";

type Tab = "chats" | "contacts" | "search" | "profile" | "settings";

interface MessengerProps {
  user: User;
  onLogout: () => void;
}

const DEMO_CHATS: Chat[] = [
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

  const currentMessages = activeChat ? (messages[activeChat.id] || []) : [];

  const handleSend = useCallback((content: string) => {
    if (!activeChat) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChat.id,
      senderId: user.id,
      senderName: user.displayName,
      content,
      isEncrypted: true,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), msg],
    }));
  }, [activeChat, user]);

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

  const renderPanel = () => {
    switch (activeTab) {
      case "chats":
        return (
          <div className="flex flex-col h-full">
            <div className="px-3 py-3 border-b border-subtle flex-shrink-0">
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-cipher" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск чатов..."
                  className="w-full bg-deep border border-normal rounded-xl pl-8 pr-4 py-2 text-sm text-primary-cipher placeholder:text-muted-cipher focus:outline-none focus:border-[hsl(var(--accent-cyan))] transition"
                />
              </div>
            </div>
            <div className="flex-1 min-h-0 py-1">
              <ChatList
                chats={chats.filter(c =>
                  !searchQuery || c.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                activeChatId={activeChat?.id}
                onSelect={setActiveChat}
              />
            </div>
          </div>
        );
      case "contacts":
        return (
          <div className="flex flex-col h-full">
            <div className="px-4 py-4 border-b border-subtle">
              <h2 className="text-base font-semibold text-primary-cipher">Контакты</h2>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Users" size={32} className="text-muted-cipher mx-auto mb-2" />
                <p className="text-secondary-cipher text-sm">Контакты появятся здесь</p>
              </div>
            </div>
          </div>
        );
      case "search":
        return (
          <div className="flex flex-col h-full">
            <div className="px-3 py-3 border-b border-subtle">
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-cipher" />
                <input
                  placeholder="Поиск по юзернейму..."
                  className="w-full bg-deep border border-normal rounded-xl pl-8 pr-4 py-2 text-sm text-primary-cipher placeholder:text-muted-cipher focus:outline-none focus:border-[hsl(var(--accent-cyan))] transition"
                />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Search" size={32} className="text-muted-cipher mx-auto mb-2" />
                <p className="text-secondary-cipher text-sm">Введи @username для поиска</p>
              </div>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="flex flex-col h-full overflow-y-auto scrollbar-cipher">
            <div className="px-4 py-6 flex flex-col items-center gap-3 border-b border-subtle">
              <div className="w-20 h-20 rounded-full bg-elevated flex items-center justify-center avatar-ring text-3xl font-bold text-primary-cipher overflow-hidden">
                {user.avatarUrl
                  ? <img src={user.avatarUrl} className="w-20 h-20 object-cover" />
                  : <span>{user.displayName[0].toUpperCase()}</span>}
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-primary-cipher">{user.displayName}</h2>
                <p className="text-secondary-cipher text-sm">@{user.username}</p>
              </div>
              <button className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl border border-normal hover:border-[hsl(var(--accent-cyan))] text-secondary-cipher transition">
                <Icon name="Edit2" size={12} />
                Редактировать профиль
              </button>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div className="bg-elevated rounded-xl p-3 border border-subtle">
                <p className="text-xs text-muted-cipher mb-1">О себе</p>
                <p className="text-sm text-secondary-cipher">{user.bio || "Описание не добавлено"}</p>
              </div>
              <div className="bg-elevated rounded-xl p-3 border border-subtle flex items-center gap-2">
                <Icon name="ShieldCheck" size={14} className="accent-emerald" />
                <div>
                  <p className="text-xs font-medium text-primary-cipher">E2EE активно</p>
                  <p className="text-xs text-muted-cipher">Все сообщения зашифрованы</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="flex flex-col h-full">
            <div className="px-4 py-4 border-b border-subtle">
              <h2 className="text-base font-semibold text-primary-cipher">Настройки</h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-cipher px-2 py-2 space-y-1">
              {[
                { icon: "Bell", label: "Уведомления" },
                { icon: "Palette", label: "Оформление" },
                { icon: "Shield", label: "Конфиденциальность" },
                { icon: "Sticker", label: "Стикеры" },
                { icon: "Smile", label: "Быстрые реакции" },
              ].map(item => (
                <button key={item.label} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-elevated transition text-left">
                  <Icon name={item.icon} size={18} className="text-secondary-cipher" />
                  <span className="text-sm text-primary-cipher">{item.label}</span>
                  <Icon name="ChevronRight" size={14} className="text-muted-cipher ml-auto" />
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-deep">
      <Sidebar user={user} activeTab={activeTab} onTab={setActiveTab} onLogout={onLogout} />

      {/* Left panel */}
      <div className="w-72 flex-shrink-0 border-r border-subtle flex flex-col h-full bg-panel">
        {renderPanel()}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col h-full">
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            currentUser={user}
            messages={currentMessages}
            onSend={handleSend}
            onReact={handleReact}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-24 h-24 rounded-full bg-elevated flex items-center justify-center glow-cyan">
              <Icon name="MessageCircle" size={40} className="accent-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary-cipher mb-1">CipherChat</h2>
              <p className="text-secondary-cipher text-sm">Выбери чат для начала общения</p>
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

export default Messenger;
