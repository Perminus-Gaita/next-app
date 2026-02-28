"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import InteractiveWrapper from "@/components/interactive/common/InteractiveWrapper";
import JackpotWinProbability from "@/components/interactive/odds/JackpotWinProbability";
import DrawCounter from "@/components/interactive/stats/DrawCounter";
import ImpliedProbability from "@/components/interactive/odds/ImpliedProbability";
import MoneyPlanner from "@/components/interactive/tools/MoneyPlanner";
import JackpotBonusCalculator from "@/components/interactive/tools/JackpotBonusCalculator";

interface ToolCard {
  title: string;
  subtitle: string;
  href: string;
  component: React.ReactNode;
}

const tools: ToolCard[] = [
  {
    title: "Calculate Your Jackpot Odds",
    subtitle: "See exactly how double chance improves your probability",
    href: "/i/jackpot-win-probability",
    component: <JackpotWinProbability />,
  },
  {
    title: "Count Your Draws Before Submitting",
    subtitle: "Winners have 2-5 draws — check your slip now",
    href: "/i/free-sportpesa-draw-counter",
    component: <DrawCounter />,
  },
  {
    title: "Find Value Bets Others Miss",
    subtitle: "Calculate when the odds are actually in your favor",
    href: "/i/what-is-value-betting",
    component: <ImpliedProbability />,
  },
  {
    title: "Plan What You'll Do With Your Winnings",
    subtitle: "Smart money management for jackpot winners",
    href: "/i/what-to-do-if-you-win-sportpesa-jackpot",
    component: <MoneyPlanner />,
  },
  {
    title: "Check Your Bonus Tier",
    subtitle: "Even 12/17 correct pays — see what you could win",
    href: "/i/sportpesa-jackpot-bonus-structure",
    component: <JackpotBonusCalculator />,
  },
];

const AUTO_SCROLL_SECONDS = 5;

export default function LandingToolCarousel() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_SCROLL_SECONDS);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Measure the rendered component's height
  const measureHeight = useCallback(() => {
    if (contentRef.current) {
      const h = contentRef.current.scrollHeight;
      if (h > 0) setContentHeight(h);
    }
  }, []);

  // Measure on index change and on resize
  useEffect(() => {
    // Small delay to let dynamic imports render
    const t1 = setTimeout(measureHeight, 50);
    const t2 = setTimeout(measureHeight, 200);
    const t3 = setTimeout(measureHeight, 500);
    window.addEventListener("resize", measureHeight);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", measureHeight);
    };
  }, [activeIndex, measureHeight]);

  // ResizeObserver for when content finishes rendering
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measureHeight());
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeIndex, measureHeight]);

  const goTo = useCallback((index: number) => {
    if (index === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setCountdown(AUTO_SCROLL_SECONDS);
      setIsTransitioning(false);
    }, 150);
  }, [activeIndex, isTransitioning]);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % tools.length);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + tools.length) % tools.length);
  }, [activeIndex, goTo]);

  // Countdown timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setTimeout(() => goNext(), 0);
          return AUTO_SCROLL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, goNext]);

  // Pause on interaction
  const handleUserInteraction = () => {
    setIsPaused(true);
    setCountdown(AUTO_SCROLL_SECONDS);
    setTimeout(() => setIsPaused(false), 8000);
  };

  // Swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    handleUserInteraction();
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const currentTool = tools[activeIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); setCountdown(AUTO_SCROLL_SECONDS); }}
    >
      {/* ── Title row with countdown ── */}
      <div className="flex items-start justify-between mb-2">
        <Link href={currentTool.href} className="block flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {currentTool.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {currentTool.subtitle}
          </p>
        </Link>
        {!isPaused && (
          <span className="text-2xl font-bold tabular-nums text-gray-300 dark:text-gray-700 ml-3 mt-0.5 select-none">
            {countdown}
          </span>
        )}
      </div>

      {/* ── Dots — tight above component ── */}
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {tools.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); handleUserInteraction(); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-5 bg-blue-600 dark:bg-blue-400"
                : "w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
            aria-label={`Go to tool ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Component area — truly dynamic height ── */}
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left arrow — centered to component height */}
        <button
          onClick={() => { goPrev(); handleUserInteraction(); }}
          className="absolute left-1.5 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
          style={{
            top: contentHeight > 0 ? `${contentHeight / 2}px` : "50%",
            transform: "translateY(-50%)",
          }}
          aria-label="Previous tool"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Right arrow — centered to component height */}
        <button
          onClick={() => { goNext(); handleUserInteraction(); }}
          className="absolute right-1.5 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
          style={{
            top: contentHeight > 0 ? `${contentHeight / 2}px` : "50%",
            transform: "translateY(-50%)",
          }}
          aria-label="Next tool"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Animated height wrapper — this is what makes content below move */}
        <div
          className="transition-[height] duration-500 ease-in-out overflow-hidden"
          style={{ height: contentHeight > 0 ? `${contentHeight}px` : "auto" }}
        >
          {/* Only the active card is rendered — so height = this card's height */}
          <div
            ref={contentRef}
            className={`transition-opacity duration-150 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
          >
            <InteractiveWrapper fallbackAlt={currentTool.title}>
              {currentTool.component}
            </InteractiveWrapper>
          </div>
        </div>
      </div>

      {/* Read guide link */}
      <Link
        href={currentTool.href}
        className="block mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        Read the full guide →
      </Link>
    </div>
  );
}
