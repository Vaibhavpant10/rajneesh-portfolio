import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage, withTimeout } from "@/lib/request";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetAuthState = async () => {
    await withTimeout(supabase.auth.signOut(), { ms: 5000, message: "Could not reset auth state." }).catch(() => {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await resetAuthState();

      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email: email.trim(), password }),
        { ms: 15000, message: "Login timed out. Please check your connection and try again." }
      );
      if (error || !data?.user || !data.session?.access_token) {
        await resetAuthState();
        toast.error(error?.message || "Invalid credentials");
        return;
      }

      const { data: isAdmin, error: roleError } = await withTimeout(
        supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" }),
        { ms: 10000, message: "Admin verification timed out. Please try again." }
      );
      if (roleError || !isAdmin) {
        await resetAuthState();
        toast.error(roleError?.message || "Access denied. Admin role required.");
        return;
      }

      toast.success("Welcome back!");
      navigate("/admin", { replace: true });
    } catch (err) {
      await resetAuthState();
      toast.error(getErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 30%, hsl(221 83% 53% / 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, hsl(270 60% 55% / 0.1) 0%, transparent 50%)" }} />

      <Card className="w-full max-w-md glass-card relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary">
            <GraduationCap size={32} className="text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            <span className="text-foreground">Admin </span>
            <span className="text-accent text-glow">Login</span>
          </CardTitle>
          <p className="text-muted-foreground text-sm">Sign in with your admin account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/30 border-border/50 focus:border-accent"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/30 border-border/50 focus:border-accent pr-10"
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
