import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

type Entry = { id: string; degree: string; institution: string; location: string | null; start_year: string | null; end_year: string | null; description: string | null; sort_order: number };
const empty: Omit<Entry, "id"> = { degree: "", institution: "", location: "", start_year: "", end_year: "", description: "", sort_order: 0 };

export default function EducationEditor() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("education_entries").select("*").order("sort_order");
    if (data) setEntries(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (e: Entry) => { setEditing(e); setForm({ degree: e.degree, institution: e.institution, location: e.location ?? "", start_year: e.start_year ?? "", end_year: e.end_year ?? "", description: e.description ?? "", sort_order: e.sort_order }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.degree.trim() || !form.institution.trim()) { toast.error("Degree and institution are required"); return; }
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("education_entries").update(form).eq("id", editing.id);
      if (error) toast.error("Failed to update"); else toast.success("Updated!");
    } else {
      const { error } = await supabase.from("education_entries").insert(form);
      if (error) toast.error("Failed to add"); else toast.success("Added!");
    }
    setSaving(false);
    setDialogOpen(false);
    fetch();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("education_entries").delete().eq("id", id);
    if (error) toast.error("Failed to delete"); else { toast.success("Deleted!"); fetch(); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Education</h1>
          <p className="text-muted-foreground text-sm">Manage your education entries</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary gap-2">
          <Plus size={16} /> Add Entry
        </Button>
      </div>

      <div className="space-y-3">
        {entries.map((e) => (
          <Card key={e.id} className="glass-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{e.degree}</p>
                <p className="text-sm text-accent">{e.institution}</p>
                <p className="text-xs text-muted-foreground">{e.start_year} – {e.end_year} · {e.location}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => openEdit(e)}><Pencil size={16} /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(e.id)} className="text-destructive hover:text-destructive"><Trash2 size={16} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {entries.length === 0 && <p className="text-muted-foreground text-center py-8">No entries yet</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-border">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Education</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="bg-muted/30 border-border/50" />
            <Input placeholder="Institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="bg-muted/30 border-border/50" />
            <Input placeholder="Location" value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-muted/30 border-border/50" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Start Year" value={form.start_year ?? ""} onChange={(e) => setForm({ ...form, start_year: e.target.value })} className="bg-muted/30 border-border/50" />
              <Input placeholder="End Year" value={form.end_year ?? ""} onChange={(e) => setForm({ ...form, end_year: e.target.value })} className="bg-muted/30 border-border/50" />
            </div>
            <Textarea placeholder="Description" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted/30 border-border/50" />
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
