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
  { id: "profile", icon: "User", label: "Профиль" },
  { id: "settings", icon: "Settings", label: "Настройки" },
];

const Sidebar = ({ user, activeTab, onTab, onLogout }: SidebarProps) => {
  return (
    <div className="flex flex-col items-center w-16 h-full bg-panel border-r border-subtle py-4 gap-1">
      <div className="mb-4 relative cursor-pointer" onClick={() => onTab("profile")}>
        <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center avatar-ring text-sm font-bold text-primary-cipher">
          {user.avatarUrl
            ? <img src={user.avatarUrl} className="w-10 h-10 rounded-full object-cover" />
            : user.displayName[0].toUpperCase()}
        </div>
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-panel"></span>
      </div>

      <div className="flex-1 flex flex-col items-center gap-1 w-full px-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            title={t.label}
            className={`w-full flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-150 group relative ${activeTab === t.id ? "nav-item-active" : "hover:bg-elevated"}`}
          >
            <Icon
              name={t.icon}
              size={20}
              className={activeTab === t.id ? "accent-cyan" : "text-secondary-cipher group-hover:text-primary-cipher transition-colors"}
            />
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        title="Выйти"
        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-muted-cipher hover:text-red-400 transition-all"
      >
        <Icon name="LogOut" size={18} />
      </button>
    </div>
  );
};

export default Sidebar;