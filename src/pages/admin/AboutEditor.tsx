import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AboutEditor() {
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("about_content").select("*").limit(1).single().then(({ data }) => {
      if (data) { setId(data.id); setDescription(data.description); }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("about_content").update({ description }).eq("id", id);
    if (error) toast.error("Failed to save");
    else toast.success("About section updated!");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">About Section</h1>
        <p className="text-muted-foreground text-sm">Edit your about me description</p>
      </div>
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-lg">Description</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={8} className="bg-muted/30 border-border/50" />
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
