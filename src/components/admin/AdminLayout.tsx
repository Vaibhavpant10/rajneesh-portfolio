import { ReactNode, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, LayoutDashboard, User, BookOpen, Award,
  FolderOpen, Mail, LogOut, Menu, X, ChevronRight, Home
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Hero Section", path: "/admin/hero", icon: Home },
  { label: "About", path: "/admin/about", icon: User },
  { label: "Education", path: "/admin/education", icon: BookOpen },
  { label: "Skills", path: "/admin/skills", icon: Award },
  { label: "Projects", path: "/admin/projects", icon: FolderOpen },
  { label: "Contact", path: "/admin/contact", icon: Mail },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem("demo_admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <GraduationCap size={18} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Admin Panel</span>
          </div>
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/15 text-primary glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <Home size={16} /> View Site
          </Link>
          <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 gap-4 sticky top-0 z-30">
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <span className="text-sm text-muted-foreground">admin@demo.com</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
