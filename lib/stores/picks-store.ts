import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Pick {
  id: string;
  eventNumber: number;
  homeTeam: string;
  awayTeam: string;
  selection: 'Home' | 'Draw' | 'Away';
  odds: number;
  competition: string;
  kickoffTime: string;
}

interface PicksStore {
  picks: Pick[];
  isDrawerOpen: boolean;
  isStrategyRunning: boolean;
  selectedStrategy: string;
  addPick: (pick: Pick) => void;
  removePick: (id: string) => void;
  removePickByEvent: (eventNumber: number) => void;
  clearPicks: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setStrategyRunning: (running: boolean) => void;
  setSelectedStrategy: (strategy: string) => void;
}

export const usePicksStore = create<PicksStore>()(
  persist(
    (set) => ({
      picks: [],
      isDrawerOpen: false,
      isStrategyRunning: false,
      selectedStrategy: 'balanced',

      addPick: (pick) =>
        set((state) => {
          const filteredPicks = state.picks.filter(
            (p) => p.eventNumber !== pick.eventNumber
          );
          return { picks: [...filteredPicks, pick] };
        }),

      removePick: (id) =>
        set((state) => ({
          picks: state.picks.filter((p) => p.id !== id),
        })),

      removePickByEvent: (eventNumber) =>
        set((state) => ({
          picks: state.picks.filter((p) => p.eventNumber !== eventNumber),
        })),

      clearPicks: () => set({ picks: [] }),

      toggleDrawer: () =>
        set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      openDrawer: () => set({ isDrawerOpen: true }),

      closeDrawer: () => set({ isDrawerOpen: false }),

      setStrategyRunning: (running) => set({ isStrategyRunning: running }),

      setSelectedStrategy: (strategy) => set({ selectedStrategy: strategy }),
    }),
    {
      name: 'picks-storage',
      partialize: (state) => ({ picks: state.picks, selectedStrategy: state.selectedStrategy }),
    }
  )
);
