"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@/components/ui/icons";
import type { Profile } from "@/lib/types";
import { toast } from "sonner";

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data);
        setName(data.full_name || "");
        setPhone(data.phone || "");
      }
    }
    load();
  }, []);

  async function handleSave() {
    if (!profile) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name, phone: phone || null })
      .eq("id", profile.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated!");
      setProfile({ ...profile, full_name: name, phone });
    }
    setLoading(false);
  }

  if (!profile) return <div className="text-center py-12 text-charcoal-muted">Loading...</div>;

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-8">Settings</h1>

      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Avatar name={name || profile.email} src={profile.avatar_url} size="lg" />
          <div>
            <p className="font-semibold text-charcoal">{name || "User"}</p>
            <p className="text-sm text-charcoal-muted">{profile.email}</p>
            <Badge className="mt-1">{profile.plan} plan</Badge>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gold/10">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
          <Input label="Email" value={profile.email} disabled hint="Email cannot be changed" />
        </div>

        <Button onClick={handleSave} loading={loading} icon={<CheckIcon size={18} />}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
