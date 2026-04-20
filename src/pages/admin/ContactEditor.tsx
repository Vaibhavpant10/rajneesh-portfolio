import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2, Mail, Phone, Linkedin, Github, Twitter } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, withTimeout } from "@/lib/request";

export default function ContactEditor() {
  const [data, setData] = useState({ id: "", email: "", phone: "", linkedin: "", github: "", twitter: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadContact = async () => {
    setLoading(true);
    try {
      const { data: record, error } = await withTimeout(
        supabase.from("contact_info").select("*").limit(1).maybeSingle(),
        { ms: 10000, message: "Loading contact info timed out." },
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (record) {
        setData({ id: record.id, email: record.email ?? "", phone: record.phone ?? "", linkedin: record.linkedin ?? "", github: record.github ?? "", twitter: record.twitter ?? "" });
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load contact info"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContact();
  }, []);

  const handleSave = async () => {
    if (saving || !data.id) return;
    setSaving(true);
    try {
      const { error } = await withTimeout(supabase.from("contact_info").update({
        email: data.email || null, phone: data.phone || null,
        linkedin: data.linkedin || null, github: data.github || null, twitter: data.twitter || null,
      }).eq("id", data.id), { ms: 15000, message: "Saving contact info timed out." });
      if (error) { toast.error(error.message); return; }
      toast.success("Contact info updated!");
      await loadContact();
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
        <h1 className="text-2xl font-bold text-foreground">Contact Info</h1>
        <p className="text-muted-foreground text-sm">Update your contact details and social links</p>
      </div>
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-lg">Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { icon: Mail, label: "Email", key: "email" as const, placeholder: "your@email.com" },
            { icon: Phone, label: "Phone", key: "phone" as const, placeholder: "+91 98765 43210" },
            { icon: Linkedin, label: "LinkedIn URL", key: "linkedin" as const, placeholder: "https://linkedin.com/in/..." },
            { icon: Github, label: "GitHub URL", key: "github" as const, placeholder: "https://github.com/..." },
            { icon: Twitter, label: "Twitter URL", key: "twitter" as const, placeholder: "https://twitter.com/..." },
          ].map(({ icon: Icon, label, key, placeholder }) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2"><Icon size={14} /> {label}</label>
              <Input value={data[key]} onChange={(e) => setData({ ...data, [key]: e.target.value })} placeholder={placeholder} className="bg-muted/30 border-border/50" />
            </div>
          ))}
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
