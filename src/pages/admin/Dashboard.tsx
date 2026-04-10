import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Home, User, BookOpen, Award, FolderOpen, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  { label: "Hero Section", icon: Home, path: "/admin/hero", color: "from-primary to-secondary" },
  { label: "About", icon: User, path: "/admin/about", color: "from-secondary to-accent" },
  { label: "Education", icon: BookOpen, path: "/admin/education", color: "from-accent to-primary" },
  { label: "Skills", icon: Award, path: "/admin/skills", color: "from-primary to-accent" },
  { label: "Projects", icon: FolderOpen, path: "/admin/projects", color: "from-secondary to-primary" },
  { label: "Contact", icon: Mail, path: "/admin/contact", color: "from-accent to-secondary" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({ education: 0, skills: 0, projects: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [edu, sk, pr] = await Promise.all([
        supabase.from("education_entries").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
      ]);
      setCounts({ education: edu.count ?? 0, skills: sk.count ?? 0, projects: pr.count ?? 0 });
    };
    fetchCounts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Manage your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link key={s.path} to={s.path}>
            <Card className="glass-card hover-lift cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <s.icon size={22} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.label === "Education" && `${counts.education} entries`}
                    {s.label === "Skills" && `${counts.skills} skills`}
                    {s.label === "Projects" && `${counts.projects} projects`}
                    {!["Education", "Skills", "Projects"].includes(s.label) && "Edit content"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
