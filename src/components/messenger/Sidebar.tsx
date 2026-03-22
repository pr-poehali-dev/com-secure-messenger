import Icon from "@/components/ui/icon";
import { User } from "@/types/messenger";

type Tab = "chats" | "contacts" | "search" | "profile" | "settings";

interface SidebarProps {
  user: User;
  activeTab: Tab;
  onTab: (t: Tab) => void;
  onLogout: () => void;
}

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "chats", icon: "MessageCircle", label: "Чаты" },
  { id: "contacts", icon: "Users", label: "Контакты" },
  { id: "search", icon: "Search", label: "Поиск" },
  { id: "settings", icon: "Settings", label: "Настройки" },
];

const Sidebar = ({ user, activeTab, onTab }: SidebarProps) => {
  return (
    <div className="flex flex-col items-center w-[60px] h-full bg-panel border-r border-subtle py-3 gap-1 flex-shrink-0">
      {/* Avatar */}
      <button
        className="mb-3 relative"
        onClick={() => onTab("profile")}
        title={user.displayName}
      >
        <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center text-sm font-bold text-primary-cipher overflow-hidden"
          style={{
            boxShadow: activeTab === "profile"
              ? "0 0 0 2px hsl(var(--bg-deep)), 0 0 0 4px hsl(var(--tit-blue))"
              : "0 0 0 2px hsl(var(--bg-panel))"
          }}>
          {user.avatarUrl
            ? <img src={user.avatarUrl} className="w-10 h-10 rounded-full object-cover" />
            : <span>{user.displayName[0].toUpperCase()}</span>}
        </div>
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-panel" />
      </button>

      {/* Nav items */}
      <div className="flex-1 flex flex-col items-center gap-0.5 w-full px-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            title={t.label}
            className={`w-full flex items-center justify-center py-2.5 rounded-xl transition-all duration-150 group ${activeTab === t.id ? "nav-item-active" : "hover:bg-elevated"}`}
          >
            <Icon
              name={t.icon}
              size={21}
              className={activeTab === t.id ? "text-[hsl(var(--tit-blue))]" : "text-secondary-cipher group-hover:text-primary-cipher transition-colors"}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
