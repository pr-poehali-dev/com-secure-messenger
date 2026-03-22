import { useState, useRef, useEffect } from "react";
import { Chat, Message, User } from "@/types/messenger";
import MessageBubble from "./MessageBubble";
import Icon from "@/components/ui/icon";

interface ChatWindowProps {
  chat: Chat;
  currentUser: User;
  messages: Message[];
  loading?: boolean;
  onSend: (content: string, mediaUrl?: string, mediaType?: string) => void;
  onReact: (msgId: string) => void;
}

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

const ChatWindow = ({ chat, currentUser, messages, loading, onSend, onReact }: ChatWindowProps) => {
  const [text, setText] = useState("");
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-subtle bg-panel flex-shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center text-sm font-bold text-primary-cipher overflow-hidden">
            {chat.partnerAvatar
              ? <img src={chat.partnerAvatar} className="w-10 h-10 object-cover" />
              : <span>{chat.partnerName[0].toUpperCase()}</span>}
          </div>
          {chat.partnerOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-panel" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-primary-cipher">{chat.partnerName}</div>
          <div className="text-xs text-secondary-cipher flex items-center gap-1">
            {chat.partnerOnline
              ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot inline-block" />в сети</>
              : "@" + chat.partnerUsername}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 encrypt-badge rounded-full px-2 py-1">
            <Icon name="ShieldCheck" size={11} className="accent-emerald" />
            <span className="text-xs text-secondary-cipher">E2EE</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-cipher px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-muted-cipher animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <div className="w-14 h-14 rounded-full bg-elevated flex items-center justify-center">
              <Icon name="Lock" size={24} className="accent-emerald" />
            </div>
            <p className="text-secondary-cipher text-sm">Сообщения зашифрованы</p>
            <p className="text-muted-cipher text-xs">Напиши первое сообщение</p>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div key={msg.id} className="relative">
                {showReactions === msg.id && (
                  <div className={`absolute z-10 flex gap-1 bg-elevated border border-subtle rounded-2xl px-2 py-1.5 shadow-xl animate-scale-in ${msg.senderId === currentUser.id ? "right-0" : "left-8"} bottom-full mb-1`}>
                    {QUICK_REACTIONS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => { onReact(msg.id); setShowReactions(null); }}
                        className="text-xl hover:scale-125 transition-transform"
                      >{emoji}</button>
                    ))}
                  </div>
                )}
                <MessageBubble
                  message={msg}
                  isMine={msg.senderId === currentUser.id}
                  onReact={(id) => setShowReactions(showReactions === id ? null : id)}
                />
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-subtle bg-panel">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-deep border border-normal rounded-2xl flex items-end px-4 py-2.5 gap-2">
            <textarea
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Сообщение..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-primary-cipher placeholder:text-muted-cipher resize-none focus:outline-none max-h-32 scrollbar-cipher"
              style={{ lineHeight: "1.5" }}
            />
            <button className="text-muted-cipher hover:text-secondary-cipher transition-colors mb-0.5">
              <Icon name="Paperclip" size={18} />
            </button>
            <button className="text-muted-cipher hover:text-secondary-cipher transition-colors mb-0.5">
              <Icon name="Smile" size={18} />
            </button>
          </div>
          <button
            onClick={send}
            disabled={!text.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-40"
            style={{ background: "hsl(var(--tit-blue))", color: "#fff" }}
          >
            <Icon name="Send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;