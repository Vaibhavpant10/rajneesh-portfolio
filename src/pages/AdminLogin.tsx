import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error("Invalid credentials");
      setLoading(false);
      return;
    }
    // Check admin role before redirecting
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin" as const,
      });
      if (isAdmin) {
        toast.success("Welcome back!");
        navigate("/admin");
      } else {
        toast.error("You do not have admin access");
        await supabase.auth.signOut();
      }
    }
    setLoading(false);
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
          <p className="text-muted-foreground text-sm">Sign in to manage your portfolio</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/30 border-border/50 focus:border-accent"
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
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary">
              <LogIn size={16} />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
