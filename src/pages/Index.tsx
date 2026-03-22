import { useAuth } from "@/hooks/useAuth";
import Auth from "./Auth";
import Messenger from "./Messenger";

const Index = () => {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--accent-cyan))] animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={login} />;
  }

  return <Messenger user={user} onLogout={logout} />;
};

export default Index;
