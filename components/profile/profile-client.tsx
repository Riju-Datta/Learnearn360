"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/posts/post-card";
import { useToast } from "@/components/ui/use-toast";
import { getLevelTitle, getProgressToNextLevel, formatNumber, cn } from "@/lib/utils";
import { Flame, Zap, Users, UserPlus, UserMinus, Github, Linkedin, Twitter, Globe, MapPin, Edit, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Props = { user: any; posts: any[]; isFollowing: boolean; isOwnProfile: boolean };

export function ProfileClient({ user, posts, isFollowing: initialFollowing, isOwnProfile }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [following, setFollowing] = useState(initialFollowing);
  const [followerCount, setFollowerCount] = useState(user._count.followers);
  const [toggling, setToggling] = useState(false);

  const level = user.xpLevel || 1;
  const { percent } = getProgressToNextLevel(user.xpTotal || 0);

  const handleFollow = async () => {
    setToggling(true);
    const wasFollowing = following;
    setFollowing(!wasFollowing);
    setFollowerCount((c: number) => wasFollowing ? c - 1 : c + 1);
    const res = await fetch(`/api/users/${user.username}/follow`, { method: wasFollowing ? "DELETE" : "POST" });
    if (!res.ok) { setFollowing(wasFollowing); setFollowerCount((c: number) => wasFollowing ? c + 1 : c - 1); }
    else if (!wasFollowing) toast({ title: "Following! ✨" });
    setToggling(false);
  };

  const socialLinks = [
    { icon: Github, url: user.profile?.githubUrl, label: "GitHub" },
    { icon: Linkedin, url: user.profile?.linkedinUrl, label: "LinkedIn" },
    { icon: Twitter, url: user.profile?.twitterUrl, label: "Twitter" },
    { icon: Globe, url: user.profile?.websiteUrl, label: "Website" },
  ].filter((s) => s.url);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Profile card */}
      <div className="bg-white/3 border border-white/10 rounded-xl overflow-hidden mb-6">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-pink-900/20 relative">
          {user.profile?.coverImage && (
            <img src={user.profile.coverImage} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <Avatar className="w-20 h-20 ring-4 ring-[#0a0f1a]">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                {user.name?.[0] || user.username?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 pb-1">
              {isOwnProfile ? (
                <Link href="/settings">
                  <Button variant="outline" size="sm" className="border-white/20 text-gray-400 hover:text-white gap-1.5">
                    <Edit className="w-3.5 h-3.5" /> Edit Profile
                  </Button>
                </Link>
              ) : (
                <Button size="sm" onClick={handleFollow} disabled={toggling}
                  className={cn("gap-1.5 h-9",
                    following
                      ? "bg-white/5 border border-white/20 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                      : "bg-blue-600 hover:bg-blue-500 text-white border-0"
                  )}>
                  {following ? <><UserMinus className="w-3.5 h-3.5" /> Unfollow</> : <><UserPlus className="w-3.5 h-3.5" /> Follow</>}
                </Button>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">{user.name || user.username}</h1>
            <p className="text-gray-500 text-sm">@{user.username}</p>
            {user.profile?.headline && <p className="text-sm text-gray-300 mt-1">{user.profile.headline}</p>}

            {user.profile?.bio && (
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{user.profile.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-600">
              {user.profile?.location && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.profile.location}</span>
              )}
              {socialLinks.map((s) => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <s.icon className="w-3 h-3" /> {s.label}
                </a>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-sm font-bold text-white">{formatNumber(user.xpTotal || 0)}</span>
                </div>
                <p className="text-xs text-gray-700">XP</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-sm font-bold text-white">{user.streakCurrent || 0}</span>
                </div>
                <p className="text-xs text-gray-700">Streak</p>
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-white block mb-0.5">{formatNumber(followerCount)}</span>
                <p className="text-xs text-gray-700">Followers</p>
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-white block mb-0.5">{formatNumber(user._count.following)}</span>
                <p className="text-xs text-gray-700">Following</p>
              </div>
            </div>

            {/* Level bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-blue-300 font-medium">Level {level} — {getLevelTitle(level)}</span>
                <span className="text-gray-600">{percent}% to Level {level + 1}</span>
              </div>
              <Progress value={percent} className="h-1.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts ({user._count.posts})</TabsTrigger>
          <TabsTrigger value="badges">Badges ({user.userBadges.length})</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-16 bg-white/3 border border-white/10 rounded-xl">
                <p className="text-gray-500">No posts yet</p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {user.userBadges.map((ub: any) => (
              <div key={ub.id} className="bg-white/3 border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-colors">
                <div className="text-3xl mb-2">{ub.badge.icon}</div>
                <p className="text-xs font-semibold text-white">{ub.badge.name}</p>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{ub.badge.description}</p>
              </div>
            ))}
            {user.userBadges.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-600">No badges yet</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <div className="bg-white/3 border border-white/10 rounded-xl p-5">
            {user.profile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.profile.skills.map((skill: any) => (
                  <Badge key={skill.id} variant="outline" className="text-sm px-3 py-1 border-white/20 text-gray-300 gap-2">
                    {skill.name}
                    <span className="text-xs text-gray-600">{skill.proficiency}</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm text-center py-4">No skills added yet</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
