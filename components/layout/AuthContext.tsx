import { createContext, useContext, useEffect, useState } from "react";
import type { User, NewUser } from "../../src/types";
import { logoutRoute, fetchMe } from "../../Routes/Api";

const AuthCtx = createContext<{
  user: NewUser;
  loading: boolean;
  setUser: (u: NewUser) => void;
  logout: () => Promise<void>;
}>({} as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NewUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        setUser(me.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLogout() {
    await logoutRoute();
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, loading, setUser, logout: handleLogout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
