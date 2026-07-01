"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, X, Plus, CreditCard, User, Bell, Shield } from "lucide-react";

type Props = { user: any };

export function SettingsClient({ user }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [headline, setHeadline] = useState(user.profile?.headline || "");
  const [bio, setBio] = useState(user.profile?.bio || "");
  const [location, setLocation] = useState(user.profile?.location || "");
  const [githubUrl, setGithubUrl] = useState(user.profile?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user.profile?.linkedinUrl || "");
  const [twitterUrl, setTwitterUrl] = useState(user.profile?.twitterUrl || "");
  const [websiteUrl, setWebsiteUrl] = useState(user.profile?.websiteUrl || "");
  const [skills, setSkills] = useState<string[]>(user.profile?.skills?.map((s: any) => s.name) || []);
  const [newSkill, setNewSkill] = useState("");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, headline, bio, location, githubUrl, linkedinUrl, twitterUrl, websiteUrl, skills }),
      });
      if (res.ok) {
        toast({ title: "Profile updated! ✓" });
        router.refresh();
      } else {
        toast({ title: "Failed to save", variant: "destructive" });
      }
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-1.5"><User className="w-3.5 h-3.5" /> Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="w-3.5 h-3.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Billing</TabsTrigger>
          <TabsTrigger value="account" className="gap-1.5"><Shield className="w-3.5 h-3.5" /> Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="bg-white/3 border border-white/10 rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="border-white/20 text-gray-400">Change Avatar</Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-400 text-xs">Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">Username</Label>
                <Input value={user.username} disabled className="mt-1 bg-white/5 border-white/10 text-gray-600" />
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs">Headline</Label>
              <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g., Freelance Developer"
                className="mt-1 bg-white/5 border-white/10 text-white" />
            </div>

            <div>
              <Label className="text-gray-400 text-xs">Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500}
                className="mt-1 bg-white/5 border-white/10 text-white min-h-[100px]" />
              <p className="text-xs text-gray-700 mt-1">{bio.length}/500</p>
            </div>

            <div>
              <Label className="text-gray-400 text-xs">Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country"
                className="mt-1 bg-white/5 border-white/10 text-white" />
            </div>

            <div>
              <Label className="text-gray-400 text-xs mb-2 block">Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((s) => (
                  <Badge key={s} variant="outline" className="border-white/20 text-gray-300 gap-1.5 pr-1">
                    {s}
                    <button onClick={() => setSkills(skills.filter((sk) => sk !== s))} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill..." className="bg-white/5 border-white/10 text-white text-sm" />
                <Button type="button" size="sm" onClick={addSkill} variant="outline" className="border-white/20 shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div>
                <Label className="text-gray-400 text-xs">GitHub</Label>
                <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..."
                  className="mt-1 bg-white/5 border-white/10 text-white text-sm" />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">LinkedIn</Label>
                <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..."
                  className="mt-1 bg-white/5 border-white/10 text-white text-sm" />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">Twitter / X</Label>
                <Input value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://x.com/..."
                  className="mt-1 bg-white/5 border-white/10 text-white text-sm" />
              </div>
              <div>
                <Label className="text-gray-400 text-xs">Website</Label>
                <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..."
                  className="mt-1 bg-white/5 border-white/10 text-white text-sm" />
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white border-0 w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-white/3 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Email Notifications</p>
                <p className="text-xs text-gray-600">Daily digest, streak reminders, new messages</p>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <p className="text-sm font-medium text-white">Push Notifications</p>
                <p className="text-xs text-gray-600">Real-time alerts for activity and replies</p>
              </div>
              <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="bg-white/3 border border-white/10 rounded-xl p-5 text-center">
            <p className="text-gray-400 mb-4">Manage your subscription and payment methods</p>
            <Link href="/settings/billing">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0">Go to Billing</Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="bg-white/3 border border-white/10 rounded-xl p-5 space-y-4">
            <div>
              <Label className="text-gray-400 text-xs">Email</Label>
              <Input value={user.email} disabled className="mt-1 bg-white/5 border-white/10 text-gray-600" />
            </div>
            <Button variant="outline" className="border-white/20 text-gray-400 w-full">Change Password</Button>
            <div className="pt-4 border-t border-white/5">
              <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 w-full">Delete Account</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
