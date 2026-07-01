"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Target, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

type Goal = { id: string; goalText: string; isCompleted: boolean };
type Props = { goals: Goal[] };

export function DailyGoals({ goals: initialGoals }: Props) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals || []);
  const [newGoal, setNewGoal] = useState("");
  const [adding, setAdding] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const { toast } = useToast();

  const addGoal = async () => {
    if (!newGoal.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/users/me/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalText: newGoal }),
      });
      const data = await res.json();
      if (res.ok) {
        setGoals((prev) => [...prev, data]);
        setNewGoal("");
        setShowInput(false);
        toast({ title: "+15 XP!", description: "Goal added. Now crush it! 💪" });
      }
    } finally {
      setAdding(false);
    }
  };

  const toggleGoal = async (goalId: string, current: boolean) => {
    const res = await fetch(`/api/users/me/goals/${goalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !current }),
    });
    if (res.ok) {
      setGoals((prev) =>
        prev.map((g) => g.id === goalId ? { ...g, isCompleted: !current } : g)
      );
      if (!current) {
        toast({ title: "Goal crushed! 🎯", description: "+15 XP earned" });
      }
    }
  };

  const completed = goals.filter((g) => g.isCompleted).length;

  return (
    <div className="bg-white/3 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Today's Goals</h3>
        </div>
        <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
          {completed}/{goals.length}
        </span>
      </div>

      {goals.length === 0 && !showInput ? (
        <p className="text-xs text-gray-700 text-center py-2">No goals yet. Add one! 🎯</p>
      ) : (
        <div className="space-y-2 mb-3">
          {goals.map((goal) => (
            <div key={goal.id}
              className={cn(
                "flex items-center gap-2.5 p-2 rounded-lg transition-all",
                goal.isCompleted ? "opacity-60" : "hover:bg-white/3"
              )}>
              <Checkbox
                checked={goal.isCompleted}
                onCheckedChange={() => toggleGoal(goal.id, goal.isCompleted)}
                className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <span className={cn(
                "text-xs flex-1",
                goal.isCompleted ? "line-through text-gray-600" : "text-gray-300"
              )}>
                {goal.goalText}
              </span>
            </div>
          ))}
        </div>
      )}

      {showInput ? (
        <div className="flex gap-2 mt-2">
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="What's your goal today?"
            className="h-8 text-xs bg-white/5 border-white/10 text-gray-300 placeholder:text-gray-700 flex-1"
            onKeyDown={(e) => e.key === "Enter" && addGoal()}
            autoFocus
          />
          <Button size="sm" onClick={addGoal} disabled={adding}
            className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white border-0 text-xs px-3">
            {adding ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setShowInput(true)}
          className="w-full h-8 text-xs text-gray-600 hover:text-gray-400 hover:bg-white/5 mt-1 border border-dashed border-white/10">
          <Plus className="w-3 h-3 mr-1" /> Add goal
        </Button>
      )}
    </div>
  );
}
