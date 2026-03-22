import { Chat } from "@/types/messenger";
import Icon from "@/components/ui/icon";

interface ChatListProps {
  chats: Chat[];
  activeChatId?: string;
  onSelect: (chat: Chat) => void;
  loading?: boolean;
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

const ChatList = ({ chats, activeChatId, onSelect, loading }: ChatListProps) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-1 p-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
            <div className="w-12 h-12 rounded-full bg-elevated flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-elevated rounded w-2/3" />
              <div className="h-3 bg-elevated rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-elevated flex items-center justify-center">
          <Icon name="MessageCirclePlus" size={28} className="text-muted-cipher" />
        </div>
        <p className="text-secondary-cipher text-sm">Чатов пока нет</p>
        <p className="text-muted-cipher text-xs">Найди друга через поиск и начни общение</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto scrollbar-cipher h-full">
      {chats.map((chat, i) => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat)}
          className={`flex items-center gap-3 px-3 py-3 mx-2 rounded-xl transition-all duration-150 text-left animate-fade-in stagger-${Math.min(i + 1, 5)} ${activeChatId === chat.id ? "bg-elevated border border-subtle" : "hover:bg-elevated/50"}`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-lg font-semibold text-primary-cipher overflow-hidden">
              {chat.partnerAvatar
                ? <img src={chat.partnerAvatar} className="w-12 h-12 object-cover" />
                : <span style={{ fontSize: 18 }}>{chat.partnerName[0].toUpperCase()}</span>}
            </div>
            {chat.partnerOnline && (
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-panel" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-sm font-semibold text-primary-cipher truncate">{chat.partnerName}</span>
              <span className="text-xs text-muted-cipher flex-shrink-0 ml-1">{timeLabel(chat.lastMessageTime)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-secondary-cipher truncate">{chat.lastMessage || "Нет сообщений"}</span>
              {(chat.unreadCount ?? 0) > 0 && (
                <span className="ml-1 flex-shrink-0 min-w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold px-1.5"
                  style={{ background: "hsl(var(--accent-cyan))", color: "hsl(var(--bg-deep))" }}>
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChatList;
