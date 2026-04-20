import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, withTimeout } from "@/lib/request";

type Skill = { id: string; name: string; category: string; sort_order: number };

export default function SkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("teaching");
  const [saving, setSaving] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data, error } = await withTimeout(
        supabase.from("skills").select("*").order("category").order("sort_order"),
        { ms: 10000, message: "Loading skills timed out." },
      );
      if (error) { toast.error(error.message); return; }
      setSkills(data ?? []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load skills"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleAdd = async () => {
    if (saving) return;
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const { error } = await withTimeout(
        supabase.from("skills").insert({ name: name.trim(), category, sort_order: skills.filter(s => s.category === category).length }),
        { ms: 15000, message: "Adding skill timed out." },
      );
      if (error) { toast.error(error.message); return; }
      toast.success("Skill added!");
      setDialogOpen(false);
      setName("");
      setCategory("teaching");
      await fetchSkills();
    } catch (error) {
      toast.error(getErrorMessage(error, "Add failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await withTimeout(
        supabase.from("skills").delete().eq("id", id),
        { ms: 15000, message: "Deleting skill timed out." },
      );
      if (error) { toast.error(error.message); return; }
      toast.success("Deleted!");
      setSkills((prev) => prev.filter((s) => s.id !== id));
      await fetchSkills();
    } catch (error) {
      toast.error(getErrorMessage(error, "Delete failed"));
    }
  };

  const teaching = skills.filter(s => s.category === "teaching");
  const technical = skills.filter(s => s.category === "technical");

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Skills</h1>
          <p className="text-muted-foreground text-sm">Manage your skill tags</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary gap-2">
          <Plus size={16} /> Add Skill
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[{ title: "Teaching Skills", items: teaching, color: "primary" }, { title: "Technical Skills", items: technical, color: "secondary" }].map(({ title, items, color }) => (
          <Card key={title} className="glass-card">
            <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <span key={s.id} className={category === "technical" ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm border border-secondary/20" : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"}>
                    {s.name}
                    <button onClick={() => handleDelete(s.id)} className="hover:text-destructive transition-colors"><Trash2 size={12} /></button>
                  </span>
                ))}
                {items.length === 0 && <p className="text-muted-foreground text-sm">No skills yet</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-border">
          <DialogHeader><DialogTitle>Add Skill</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Skill name" value={name} onChange={(e) => setName(e.target.value)} className="bg-muted/30 border-border/50" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-muted/30 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="teaching">Teaching</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} disabled={saving} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Add Skill
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
