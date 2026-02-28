import { create } from "zustand";

export interface Pick {
  id: string;
  eventNumber: number;
  homeTeam: string;
  awayTeam: string;
  selection: "Home" | "Draw" | "Away";
  odds: number;
  competition: string;
  kickoffTime: string;
}

interface PicksState {
  picks: Pick[];
  isDrawerOpen: boolean;
  isStrategyRunning: boolean;
  selectedStrategy: string | null;
  addPick: (pick: Pick) => void;
  removePick: (pickId: string) => void;
  removePickByEvent: (eventNumber: number) => void;
  clearPicks: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setStrategyRunning: (running: boolean) => void;
  setSelectedStrategy: (strategyId: string | null) => void;
}

export const usePicksStore = create<PicksState>((set) => ({
  picks: [],
  isDrawerOpen: false,
  isStrategyRunning: false,
  selectedStrategy: null,

  addPick: (pick) =>
    set((state) => {
      const filtered = state.picks.filter(
        (p) => p.eventNumber !== pick.eventNumber
      );
      return {
        picks: [...filtered, pick],
      };
    }),

  removePick: (pickId) =>
    set((state) => ({
      picks: state.picks.filter((p) => p.id !== pickId),
    })),

  removePickByEvent: (eventNumber) =>
    set((state) => ({
      picks: state.picks.filter((p) => p.eventNumber !== eventNumber),
    })),

  clearPicks: () => set({ picks: [], selectedStrategy: null }),

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  setStrategyRunning: (running) => set({ isStrategyRunning: running }),
  setSelectedStrategy: (strategyId) => set({ selectedStrategy: strategyId }),
}));
