import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "ok" | "deny">("loading");

  useEffect(() => {
    let active = true;

    const withTimeout = async <T,>(promise: PromiseLike<T>, ms = 10000): Promise<T> => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Authentication timed out.")), ms);
      });

      try {
        return (await Promise.race([Promise.resolve(promise), timeout])) as T;
      } finally {
        if (timer) clearTimeout(timer);
      }
    };

    const resetInvalidSession = async () => {
      await withTimeout(supabase.auth.signOut(), 5000).catch(() => {});
    };

    const setSafeStatus = (next: "loading" | "ok" | "deny") => {
      if (active) setStatus(next);
    };

    const check = async (nextSession?: Session | null) => {
      setSafeStatus("loading");

      try {
        const session = nextSession ?? (await withTimeout(supabase.auth.getSession())).data.session;

        if (!session?.user || !session.access_token) {
          await resetInvalidSession();
          setSafeStatus("deny");
          return;
        }

        const { data: isAdmin, error } = await withTimeout(
          supabase.rpc("has_role", {
            _user_id: session.user.id,
            _role: "admin",
          })
        );

        if (error || !isAdmin) {
          await resetInvalidSession();
          setSafeStatus("deny");
          return;
        }

        setSafeStatus("ok");
      } catch {
        await resetInvalidSession();
        setSafeStatus("deny");
      }
    };

    void check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void check(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }
  if (status === "deny") return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
