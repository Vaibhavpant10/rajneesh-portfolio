import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { withTimeout } from "@/lib/request";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (userId: string) => {
    try {
      const { data, error } = await withTimeout(
        supabase.rpc("has_role", {
          _user_id: userId,
          _role: "admin",
        }),
        { ms: 10000, message: "Admin verification timed out." },
      );

      if (error) {
        setIsAdmin(false);
        return false;
      }

      const nextIsAdmin = !!data;
      setIsAdmin(nextIsAdmin);
      return nextIsAdmin;
    } catch {
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    let active = true;

    const applySession = async (nextSession: Session | null) => {
      if (!active) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        void checkAdmin(nextSession.user.id);
      } else {
        setIsAdmin(false);
      }

      if (active) setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        void applySession(nextSession);
      }
    );

    void withTimeout(supabase.auth.getSession(), {
      ms: 10000,
      message: "Session restore timed out.",
    })
      .then(({ data: { session: restoredSession } }) => applySession(restoredSession))
      .catch(() => {
        if (!active) return;
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await withTimeout(supabase.auth.signInWithPassword({ email, password }), {
      ms: 15000,
      message: "Login timed out. Please try again.",
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await withTimeout(supabase.auth.signOut(), { ms: 5000, message: "Logout timed out." }).catch(() => {});
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
