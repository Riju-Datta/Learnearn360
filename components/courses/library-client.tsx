"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Search, Play, Clock, Users, Star, Lock, BookOpen } from "lucide-react";
import { formatNumber, cn } from "@/lib/utils";

const CATEGORIES = ["All", "Coding", "Freelancing", "Startup", "AI", "Career", "Marketing", "Design"];
const LEVELS = ["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

type Props = { courses: any[]; userPlan: string };

export function LibraryClient({ courses, userPlan }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [enrolling, setEnrolling] = useState<string | null>(null);

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    const matchLevel = level === "All" || c.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  const handleEnroll = async (slug: string, isPremium: boolean) => {
    if (isPremium && userPlan === "FREE") {
      toast({ title: "Premium required", description: "Upgrade to access premium courses", variant: "destructive" });
      router.push("/settings/billing");
      return;
    }
    setEnrolling(slug);
    try {
      const res = await fetch(`/api/courses/${slug}/enroll`, { method: "POST" });
      if (res.ok) {
        toast({ title: "Enrolled! Let's learn 🚀" });
        router.refresh();
      }
    } finally { setEnrolling(null); }
  };

  const levelColors: Record<string, string> = {
    BEGINNER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    INTERMEDIATE: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    ADVANCED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Library</h1>
        <p className="text-gray-500 text-sm mt-1">Courses, roadmaps, and resources to level up your skills</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="pl-9 bg-white/5 border-white/10 text-gray-300 placeholder:text-gray-700" />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              category === cat ? "bg-blue-600/20 border-blue-500/40 text-blue-300" : "bg-white/3 border-white/10 text-gray-600 hover:text-gray-400")}>
            {cat}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-6">
        {LEVELS.map((l) => (
          <button key={l} onClick={() => setLevel(l)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              level === l ? "bg-purple-600/20 border-purple-500/40 text-purple-300" : "bg-white/3 border-white/10 text-gray-600 hover:text-gray-400")}>
            {l === "All" ? "All Levels" : l.charAt(0) + l.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Courses grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <div key={course.id} className="group bg-white/3 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl flex flex-col">
              {/* Thumbnail */}
              <div className="relative h-40 bg-gradient-to-br from-blue-900/40 to-purple-900/30 flex items-center justify-center overflow-hidden">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-12 h-12 text-gray-700" />
                )}
                {course.isPremium && (
                  <div className="absolute top-2 right-2">
                    <Badge className="text-xs bg-yellow-500/80 text-yellow-900 border-0 font-bold">PRO</Badge>
                  </div>
                )}
                {course.isEnrolled && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <Progress value={course.userProgress} className="h-1 rounded-none bg-black/30" />
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border", levelColors[course.level] || "bg-white/5 text-gray-500 border-white/10")}>
                    {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
                  </span>
                  <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{course.category}</span>
                </div>

                <Link href={`/library/course/${course.slug}`} className="font-semibold text-white hover:text-blue-300 transition-colors mb-1 leading-snug line-clamp-2">
                  {course.title}
                </Link>

                {course.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">{course.description}</p>
                )}

                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                  {course.ratingAvg > 0 && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3 h-3 fill-current" /> {course.ratingAvg.toFixed(1)}
                    </span>
                  )}
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {formatNumber(course._count.enrollments)}</span>
                  <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {course._count.lessons} lessons</span>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={course.instructor?.image || ""} />
                    <AvatarFallback className="text-xs">{course.instructor?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-600 flex-1 truncate">{course.instructor?.name}</span>
                  {course.price > 0 && <span className="text-sm font-bold text-white">${course.price}</span>}
                </div>

                <div className="mt-3">
                  {course.isEnrolled ? (
                    <Link href={`/library/course/${course.slug}`}>
                      <Button size="sm" className="w-full h-8 bg-emerald-600 hover:bg-emerald-500 text-white border-0 text-xs">
                        <Play className="w-3 h-3 mr-1" /> Continue ({course.userProgress}%)
                      </Button>
                    </Link>
                  ) : (
                    <Button size="sm" onClick={() => handleEnroll(course.slug, course.isPremium)}
                      disabled={enrolling === course.slug}
                      className={cn("w-full h-8 text-xs font-medium",
                        course.isPremium && userPlan === "FREE"
                          ? "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
                          : "bg-blue-600 hover:bg-blue-500 text-white border-0"
                      )}>
                      {course.isPremium && userPlan === "FREE" ? <><Lock className="w-3 h-3 mr-1" /> Premium</> : "Enroll Free"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
