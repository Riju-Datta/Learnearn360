"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Image, Link, BarChart2, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type PostType = "TEXT" | "IMAGE" | "LINK" | "POLL";
type Props = { rooms: any[]; onClose: () => void };

export function CreatePostModal({ rooms, onClose }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [type, setType] = useState<PostType>("TEXT");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [roomId, setRoomId] = useState(rooms[0]?.id || "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!body.trim() && !imageUrl && !linkUrl) return;
    if (!roomId) { toast({ title: "Select a room", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const room = rooms.find((r) => r.id === roomId);
      const res = await fetch(`/api/rooms/${room?.slug}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, body, imageUrl, linkUrl }),
      });
      if (res.ok) {
        toast({ title: "Posted! +20 XP 🎉" });
        router.refresh();
        onClose();
      } else {
        const d = await res.json();
        toast({ title: "Error", description: d.error, variant: "destructive" });
      }
    } finally { setLoading(false); }
  };

  const typeButtons = [
    { t: "TEXT" as PostType, icon: null, label: "Text" },
    { t: "IMAGE" as PostType, icon: Image, label: "Image" },
    { t: "LINK" as PostType, icon: Link, label: "Link" },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Room selector */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Post to</label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger className="bg-white/5 border-white/10 text-gray-300 text-sm">
                <SelectValue placeholder="Choose a room..." />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.icon || "🏠"} {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type selector */}
          <div className="flex gap-2">
            {typeButtons.map(({ t, icon: Icon, label }) => (
              <button key={t} onClick={() => setType(t)}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                  type === t ? "bg-blue-600/20 border-blue-500/50 text-blue-300" : "bg-white/3 border-white/10 text-gray-600 hover:text-gray-400")}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </button>
            ))}
          </div>

          {/* Title */}
          <Input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />

          {/* Body */}
          <Textarea value={body} onChange={(e) => setBody(e.target.value)}
            placeholder="What's on your mind? Share a win, ask a question, or start a discussion..."
            className="min-h-[120px] bg-white/5 border-white/10 text-gray-300 placeholder:text-gray-600 resize-none"
          />

          {/* Image URL */}
          {type === "IMAGE" && (
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          )}

          {/* Link URL */}
          {type === "LINK" && (
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-700">{body.length}/2000</p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-300">Cancel</Button>
              <Button onClick={submit} disabled={loading || (!body.trim() && !imageUrl && !linkUrl)}
                className="bg-blue-600 hover:bg-blue-500 text-white border-0">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
