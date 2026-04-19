import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

type Project = { id: string; title: string; organization: string | null; date_range: string | null; description: string | null; image_url: string | null; link: string | null; sort_order: number };
const empty = { title: "", organization: "", date_range: "", description: "", image_url: "", link: "", sort_order: 0 };

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order");
      if (error) { toast.error(error.message); return; }
      setProjects(data ?? []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, organization: p.organization ?? "", date_range: p.date_range ?? "", description: p.description ?? "", image_url: p.image_url ?? "", link: p.link ?? "", sort_order: p.sort_order });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (saving) return;
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, organization: form.organization || null, date_range: form.date_range || null, description: form.description || null, image_url: form.image_url || null, link: form.link || null };
      if (editing) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
        if (error) { toast.error(error.message); return; }
        toast.success("Updated!");
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) { toast.error(error.message); return; }
        toast.success("Added!");
      }
      setDialogOpen(false);
      await fetchProjects();
    } catch (err: any) {
      toast.error(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) { toast.error(error.message); return; }
      toast.success("Deleted!");
      setProjects((prev) => prev.filter((x) => x.id !== id));
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground text-sm">Manage your projects and experience</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary gap-2">
          <Plus size={16} /> Add Project
        </Button>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <Card key={p.id} className="glass-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{p.title}</p>
                <p className="text-sm text-accent">{p.organization}</p>
                <p className="text-xs text-muted-foreground">{p.date_range}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil size={16} /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive"><Trash2 size={16} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && <p className="text-muted-foreground text-center py-8">No projects yet</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-border">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Project</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-muted/30 border-border/50" />
            <Input placeholder="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="bg-muted/30 border-border/50" />
            <Input placeholder="Date Range" value={form.date_range} onChange={(e) => setForm({ ...form, date_range: e.target.value })} className="bg-muted/30 border-border/50" />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted/30 border-border/50" />
            <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="bg-muted/30 border-border/50" />
            <Input placeholder="Project Link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="bg-muted/30 border-border/50" />
            <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editing ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
