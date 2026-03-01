"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Jackpot } from "@/features/jackpots/types";

interface CalendarJackpot {
  id: string;
  humanId: number;
  status: string;
  bettingStatus: string | null;
  openedAt: string | null;
  finishedAt: string | null;
  firstKickoff: string | null;
  endDate: string | null;
}

interface JackpotContextType {
  jackpot: Jackpot | null;
  initialLoading: boolean;
  switchingJackpot: boolean;
  error: string | null;
  calendarData: CalendarJackpot[];
  switchJackpot: (id: string) => void;
  refetch: () => void;
}

const JackpotContext = createContext<JackpotContextType>({
  jackpot: null,
  initialLoading: true,
  switchingJackpot: false,
  error: null,
  calendarData: [],
  switchJackpot: () => {},
  refetch: () => {},
});

export function useJackpot() {
  return useContext(JackpotContext);
}

interface JackpotProviderProps {
  jackpotId: string;
  children: React.ReactNode;
}

export function JackpotProvider({ jackpotId, children }: JackpotProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [jackpot, setJackpot] = useState<Jackpot | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [switchingJackpot, setSwitchingJackpot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarJackpot[]>([]);
  const hasLoadedOnce = useRef(false);

  const fetchJackpot = useCallback(async (id?: string, isSwitch = false) => {
    try {
      if (isSwitch) {
        setSwitchingJackpot(true);
      } else if (!hasLoadedOnce.current) {
        setInitialLoading(true);
      }
      setError(null);

      const endpoint = (!id || id === "latest")
        ? "/api/jackpots/latest"
        : `/api/jackpots/${id}`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to load jackpot");

      const data = await res.json();
      setJackpot(data);
      hasLoadedOnce.current = true;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setInitialLoading(false);
      setSwitchingJackpot(false);
    }
  }, []);

  const fetchCalendar = useCallback(async () => {
    try {
      const res = await fetch("/api/jackpots/calendar?all=true");
      if (res.ok) {
        const data: CalendarJackpot[] = await res.json();
        setCalendarData(data);
      }
    } catch (err) {
      console.error("Failed to prefetch calendar data:", err);
    }
  }, []);

  useEffect(() => {
    fetchJackpot(jackpotId);
    fetchCalendar();
  }, [jackpotId, fetchJackpot, fetchCalendar]);

  const switchJackpot = useCallback((id: string) => {
    // Get the current tab segment from pathname
    // pathname looks like /j/[oldId] or /j/[oldId]/picks or /j/[oldId]/comments etc
    const segments = pathname.split("/");
    // segments: ['', 'j', 'oldId'] or ['', 'j', 'oldId', 'picks']
    const tabSegment = segments.length > 3 ? segments.slice(3).join("/") : "";
    const newPath = tabSegment ? `/j/${id}/${tabSegment}` : `/j/${id}`;

    // Navigate to new jackpot URL (keeps the current tab)
    router.push(newPath);

    // Fetch new jackpot data with smooth transition
    fetchJackpot(id, true);
  }, [pathname, router, fetchJackpot]);

  const refetch = useCallback(() => {
    fetchJackpot(jackpotId);
  }, [jackpotId, fetchJackpot]);

  return (
    <JackpotContext.Provider value={{
      jackpot,
      initialLoading,
      switchingJackpot,
      error,
      calendarData,
      switchJackpot,
      refetch,
    }}>
      {children}
    </JackpotContext.Provider>
  );
}
