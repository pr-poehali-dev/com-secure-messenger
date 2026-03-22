import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthProps {
  onLogin: (user: { id: string; username: string; displayName: string; token: string }) => void;
}

const BACKEND_URL = "https://functions.poehali.dev/24fd2f85-1337-49a3-b1fb-b88509375bfc";

const Auth = ({ onLogin }: AuthProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, username: username.trim().toLowerCase(), password, display_name: displayName }),
      });
      const raw = await res.json();
      const data = typeof raw?.body === "object" ? raw.body : (typeof raw?.body === "string" ? JSON.parse(raw.body) : raw);
      if (!res.ok) { setError(data.error || "Ошибка"); setLoading(false); return; }
      onLogin({ id: data.user_id, username: data.username, displayName: data.display_name, token: data.token });
    } catch {
      setError("Сервер недоступен");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-elevated border border-normal mb-5 glow-cyan">
            <Icon name="MessageCircle" size={36} className="accent-cyan" />
          </div>
          <h1 className="text-3xl font-bold text-primary-cipher tracking-tight">CipherChat</h1>
          <p className="text-secondary-cipher mt-1 text-sm">Зашифрованный мессенджер</p>
        </div>

        <div className="bg-panel rounded-2xl border border-subtle p-6">
          <div className="flex rounded-xl bg-deep p-1 mb-6">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${mode === m ? "bg-elevated text-primary-cipher" : "text-secondary-cipher hover:text-primary-cipher"}`}
              >
                {m === "login" ? "Войти" : "Регистрация"}
              </button>
            ))}
          </div>

          <form onSubmit={handle} className="space-y-3">
            {mode === "register" && (
              <div>
                <label className="text-xs text-secondary-cipher mb-1 block">Имя</label>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Ваше имя"
                  required
                  className="w-full bg-deep border border-normal rounded-xl px-4 py-3 text-sm text-primary-cipher placeholder:text-muted-cipher focus:outline-none focus:border-[hsl(var(--accent-cyan))] transition"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-secondary-cipher mb-1 block">Юзернейм</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-cipher text-sm">@</span>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value.replace(/[^a-z0-9_]/gi, ""))}
                  placeholder="username"
                  required
                  maxLength={32}
                  className="w-full bg-deep border border-normal rounded-xl pl-8 pr-4 py-3 text-sm text-primary-cipher placeholder:text-muted-cipher focus:outline-none focus:border-[hsl(var(--accent-cyan))] transition"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-secondary-cipher mb-1 block">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-deep border border-normal rounded-xl px-4 py-3 text-sm text-primary-cipher placeholder:text-muted-cipher focus:outline-none focus:border-[hsl(var(--accent-cyan))] transition"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold mt-2 transition-all duration-200"
              style={{ background: "hsl(var(--accent-cyan))", color: "hsl(var(--bg-deep))" }}
            >
              {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Создать аккаунт"}
            </button>
          </form>

          <div className="mt-4 flex items-center gap-2 justify-center encrypt-badge rounded-xl px-3 py-2">
            <Icon name="Lock" size={12} className="accent-emerald" />
            <span className="text-xs text-secondary-cipher">End-to-End шифрование</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;