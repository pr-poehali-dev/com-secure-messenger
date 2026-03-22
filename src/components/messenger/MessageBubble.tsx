import { Message } from "@/types/messenger";
import Icon from "@/components/ui/icon";

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  onReact?: (msgId: string) => void;
}

const MessageBubble = ({ message, isMine, onReact }: MessageBubbleProps) => {
  const time = new Date(message.createdAt).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex items-end gap-2 mb-1 group ${isMine ? "flex-row-reverse" : "flex-row"}`}>
      {!isMine && (
        <div className="w-7 h-7 rounded-full bg-elevated flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary-cipher mb-1 overflow-hidden">
          {message.senderAvatar
            ? <img src={message.senderAvatar} className="w-7 h-7 object-cover" />
            : <span>{(message.senderName || "?")[0].toUpperCase()}</span>}
        </div>
      )}

      <div className={`max-w-[70%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
        <div
          className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed animate-scale-in ${isMine
            ? "message-bubble-out text-primary-cipher rounded-br-sm"
            : "message-bubble-in text-primary-cipher rounded-bl-sm"
          }`}
        >
          {message.mediaType === "image" && message.mediaUrl && (
            <img src={message.mediaUrl} className="max-w-xs rounded-xl mb-2 cursor-pointer" />
          )}
          {message.mediaType === "audio" && message.mediaUrl && (
            <audio controls className="mb-2 max-w-xs" style={{ filter: "invert(0.8)" }}>
              <source src={message.mediaUrl} />
            </audio>
          )}
          {message.content && <span>{message.content}</span>}

          <button
            onClick={() => onReact?.(message.id)}
            className={`absolute -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity bg-elevated border border-subtle rounded-full p-1 ${isMine ? "-left-3" : "-right-3"}`}
          >
            <Icon name="SmilePlus" size={12} className="text-muted-cipher" />
          </button>
        </div>

        {(message.reactions?.length ?? 0) > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {message.reactions!.map((r, i) => (
              <span key={i} className={`text-xs px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${r.mine ? "bg-cyan-500/10 border-cyan-500/30" : "bg-elevated border-subtle"}`}>
                {r.emoji} {r.count > 1 && <span className="text-muted-cipher">{r.count}</span>}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 mt-1 px-1">
          <Icon name="Lock" size={9} className="accent-emerald opacity-60" />
          <span className="text-xs text-muted-cipher">{time}</span>
          {isMine && <Icon name="CheckCheck" size={11} className="text-muted-cipher" />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
