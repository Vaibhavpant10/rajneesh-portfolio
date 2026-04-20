import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { withTimeout } from "@/lib/request";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "ok" | "deny">("loading");

  useEffect(() => {
    let active = true;

    const resetInvalidSession = async () => {
      await withTimeout(supabase.auth.signOut(), { ms: 5000, message: "Authentication reset timed out." }).catch(() => {});
    };

    const setSafeStatus = (next: "loading" | "ok" | "deny") => {
      if (active) setStatus(next);
    };

    const check = async (nextSession?: Session | null) => {
      setSafeStatus("loading");

      try {
        const session = nextSession ?? (await withTimeout(supabase.auth.getSession(), { ms: 10000, message: "Authentication timed out." })).data.session;

        if (!session?.user || !session.access_token) {
          await resetInvalidSession();
          setSafeStatus("deny");
          return;
        }

        const { data: isAdmin, error } = await withTimeout(
          supabase.rpc("has_role", {
            _user_id: session.user.id,
            _role: "admin",
          }),
          { ms: 10000, message: "Admin verification timed out." }
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
      queueMicrotask(() => {
        void check(session);
      });
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
