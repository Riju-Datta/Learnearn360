"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Play, CheckCircle2, Lock, Clock, Users, Star, Award, ChevronRight, BookOpen } from "lucide-react";
import { formatNumber, cn } from "@/lib/utils";

type Props = { course: any; enrollment: any; completedLessonIds: string[]; userPlan: string };

export function CourseDetailClient({ course, enrollment, completedLessonIds, userPlan }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completedSet, setCompletedSet] = useState(new Set(completedLessonIds));
  const [enrolling, setEnrolling] = useState(false);
  const [completing, setCompleting] = useState(false);

  const isEnrolled = !!enrollment;
  const canAccess = (lesson: any) => !lesson.isPremium || isEnrolled || lesson.isFreePreview;

  const handleEnroll = async () => {
    if (course.isPremium && userPlan === "FREE") {
      toast({ title: "Premium required", variant: "destructive" });
      router.push("/settings/billing");
      return;
    }
    setEnrolling(true);
    const res = await fetch(`/api/courses/${course.slug}/enroll`, { method: "POST" });
    if (res.ok) {
      toast({ title: "Enrolled! 🚀" });
      router.refresh();
    }
    setEnrolling(false);
  };

  const handleCompleteLesson = async (lessonId: string) => {
    if (!isEnrolled) return;
    setCompleting(true);
    const res = await fetch(`/api/courses/${course.slug}/lessons/${lessonId}`, { method: "POST" });
    if (res.ok) {
      const newSet = new Set([...completedSet, lessonId]);
      setCompletedSet(newSet);
      const progress = Math.round((newSet.size / course.lessons.length) * 100);
      toast({ title: `+50 XP! Lesson complete 🎯`, description: `${progress}% of course done` });
      if (newSet.size === course.lessons.length) {
        toast({ title: "Course complete! 🏆", description: "+500 XP + Certificate earned!" });
      }
      router.refresh();
    }
    setCompleting(false);
  };

  const progress = course.lessons.length > 0 ? Math.round((completedSet.size / course.lessons.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video player / lesson viewer */}
          {activeLesson ? (
            <div className="bg-black rounded-xl overflow-hidden border border-white/10">
              {activeLesson.contentUrl ? (
                <div className="aspect-video">
                  <iframe src={activeLesson.contentUrl} className="w-full h-full" allowFullScreen />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-950">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">No video URL configured</p>
                  </div>
                </div>
              )}
              <div className="p-4 border-t border-white/10">
                <h2 className="font-semibold text-white mb-2">{activeLesson.title}</h2>
                {activeLesson.body && <p className="text-sm text-gray-400 leading-relaxed">{activeLesson.body}</p>}
                {isEnrolled && !completedSet.has(activeLesson.id) && (
                  <Button onClick={() => handleCompleteLesson(activeLesson.id)} disabled={completing}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white border-0">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Complete (+50 XP)
                  </Button>
                )}
                {completedSet.has(activeLesson.id) && (
                  <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Completed!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-white/10 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">{course.title}</p>
                <p className="text-sm text-gray-700 mt-1">Select a lesson to start</p>
              </div>
            </div>
          )}

          {/* Course info */}
          <div className="bg-white/3 border border-white/10 rounded-xl p-5">
            <h1 className="text-xl font-bold text-white mb-2">{course.title}</h1>
            {course.description && <p className="text-sm text-gray-400 leading-relaxed mb-4">{course.description}</p>}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {course.ratingAvg > 0 && <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-current" /> {course.ratingAvg.toFixed(1)}</span>}
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {formatNumber(course._count.enrollments)} enrolled</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course._count.lessons} lessons</span>
              <Badge className={course.level === "BEGINNER" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : course.level === "INTERMEDIATE" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-purple-500/20 text-purple-400 border-purple-500/30"}>
                {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
              <Avatar className="w-10 h-10">
                <AvatarImage src={course.instructor?.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">{course.instructor?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{course.instructor?.name}</p>
                <p className="text-xs text-gray-500">{course.instructor?.profile?.headline || "Instructor"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Enrollment card */}
          <div className="bg-white/3 border border-white/10 rounded-xl p-5 sticky top-20">
            {isEnrolled ? (
              <>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Your progress</span>
                    <span className="text-white font-semibold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">{completedSet.size}/{course.lessons.length} lessons done</p>
                </div>
                {progress === 100 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-3">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm font-medium text-yellow-300">Certificate Earned!</p>
                      <p className="text-xs text-yellow-500">Download your certificate</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  {course.price > 0 ? (
                    <p className="text-3xl font-bold text-white">${course.price}</p>
                  ) : (
                    <p className="text-2xl font-bold text-emerald-400">Free</p>
                  )}
                </div>
                <Button onClick={handleEnroll} disabled={enrolling} className="w-full bg-blue-600 hover:bg-blue-500 text-white border-0 mb-3">
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </Button>
                <p className="text-xs text-gray-600 text-center">30-day money-back guarantee</p>
              </>
            )}
          </div>

          {/* Lessons list */}
          <div className="bg-white/3 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-white">{course._count.lessons} Lessons</h3>
            </div>
            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
              {course.lessons.map((lesson: any, i: number) => {
                const done = completedSet.has(lesson.id);
                const accessible = canAccess(lesson);
                return (
                  <button key={lesson.id} onClick={() => accessible && setActiveLesson(lesson)}
                    className={cn("w-full flex items-center gap-3 p-3 text-left transition-colors",
                      activeLesson?.id === lesson.id ? "bg-blue-600/10" : "hover:bg-white/3",
                      !accessible && "opacity-50 cursor-not-allowed"
                    )}>
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0",
                      done ? "bg-emerald-500 text-white" : "bg-white/10 text-gray-500")}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs font-medium truncate", done ? "text-emerald-400" : "text-gray-300")}>
                        {lesson.title}
                      </p>
                      {lesson.durationSeconds && (
                        <p className="text-xs text-gray-700">{Math.round(lesson.durationSeconds / 60)} min</p>
                      )}
                    </div>
                    {!accessible && <Lock className="w-3 h-3 text-gray-700 shrink-0" />}
                    {accessible && !done && <ChevronRight className="w-3 h-3 text-gray-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
