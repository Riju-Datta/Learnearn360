import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  xpTotal: number;
  xpLevel: number;
  streakCurrent: number;
  plan: string;
  setXp: (xp: number) => void;
  setLevel: (level: number) => void;
  setStreak: (streak: number) => void;
  setPlan: (plan: string) => void;
  addXp: (amount: number) => void;
  hydrate: (data: { xpTotal: number; xpLevel: number; streakCurrent: number; plan: string }) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      xpTotal: 0,
      xpLevel: 1,
      streakCurrent: 0,
      plan: "FREE",
      setXp: (xp) => set({ xpTotal: xp }),
      setLevel: (level) => set({ xpLevel: level }),
      setStreak: (streak) => set({ streakCurrent: streak }),
      setPlan: (plan) => set({ plan }),
      addXp: (amount) => set((state) => ({ xpTotal: state.xpTotal + amount })),
      hydrate: (data) => set(data),
    }),
    { name: "learnearn-user" }
  )
);
