import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, withTimeout } from "@/lib/request";

export default function AboutEditor() {
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAbout = async () => {
    setLoading(true);
    try {
      const { data, error } = await withTimeout(
        supabase.from("about_content").select("*").limit(1).maybeSingle(),
        { ms: 10000, message: "Loading about content timed out." },
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        setId(data.id);
        setDescription(data.description);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load about content"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAbout();
  }, []);

  const handleSave = async () => {
    if (saving || !id) return;
    setSaving(true);
    try {
      const { error } = await withTimeout(
        supabase.from("about_content").update({ description }).eq("id", id),
        { ms: 15000, message: "Saving about content timed out." },
      );
      if (error) { toast.error(error.message); return; }
      toast.success("About section updated!");
      await loadAbout();
    } catch (error) {
      toast.error(getErrorMessage(error, "Save failed"));
    } finally {
      setSaving(false);
    }
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
