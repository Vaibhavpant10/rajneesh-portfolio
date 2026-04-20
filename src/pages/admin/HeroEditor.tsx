import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, withTimeout } from "@/lib/request";

export default function HeroEditor() {
  const [data, setData] = useState({ id: "", name: "", tagline: "", intro: "", button1_text: "", button2_text: "", image_url: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadHero = async () => {
    setLoading(true);
    try {
      const { data: record, error } = await withTimeout(
        supabase.from("hero_content").select("*").limit(1).maybeSingle(),
        { ms: 10000, message: "Loading hero content timed out." },
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (record) {
        setData({ id: record.id, name: record.name, tagline: record.tagline, intro: record.intro, button1_text: record.button1_text, button2_text: record.button2_text, image_url: record.image_url ?? "" });
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load hero content"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHero();
  }, []);

  const handleSave = async () => {
    if (saving || !data.id) return;
    setSaving(true);
    try {
      const { error } = await withTimeout(supabase.from("hero_content").update({
        name: data.name, tagline: data.tagline, intro: data.intro,
        button1_text: data.button1_text, button2_text: data.button2_text,
        image_url: data.image_url || null,
      }).eq("id", data.id), { ms: 15000, message: "Saving hero content timed out." });
      if (error) { toast.error(error.message); return; }
      toast.success("Hero section updated!");
      await loadHero();
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
        <h1 className="text-2xl font-bold text-foreground">Hero Section</h1>
        <p className="text-muted-foreground text-sm">Edit your hero banner content</p>
      </div>
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-lg">Content</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="bg-muted/30 border-border/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tagline</label>
            <Input value={data.tagline} onChange={(e) => setData({ ...data, tagline: e.target.value })} className="bg-muted/30 border-border/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Introduction</label>
            <Textarea value={data.intro} onChange={(e) => setData({ ...data, intro: e.target.value })} rows={4} className="bg-muted/30 border-border/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Button 1 Text</label>
              <Input value={data.button1_text} onChange={(e) => setData({ ...data, button1_text: e.target.value })} className="bg-muted/30 border-border/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Button 2 Text</label>
              <Input value={data.button2_text} onChange={(e) => setData({ ...data, button2_text: e.target.value })} className="bg-muted/30 border-border/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Image URL</label>
            <Input value={data.image_url} onChange={(e) => setData({ ...data, image_url: e.target.value })} placeholder="https://..." className="bg-muted/30 border-border/50" />
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
