"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp, Calculator, Award, BarChart3, Target } from "lucide-react";

const categories = [
  {
    title: "Prediction Strategies",
    description: "Proven techniques to pick more winners",
    icon: TrendingUp,
    href: "/i",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Free Calculators",
    description: "Tools that show you the real odds",
    icon: Calculator,
    href: "/i/components",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Winner Analysis",
    description: "What actual winners did differently",
    icon: Award,
    href: "/i",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    title: "Data & Patterns",
    description: "Insights from thousands of past jackpots",
    icon: BarChart3,
    href: "/i",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
  {
    title: "Draw Predictions",
    description: "The hardest pick — made easier",
    icon: Target,
    href: "/i/how-to-predict-draws",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
  },
];

export default function LandingCategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 180;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.title}
              href={cat.href}
              className="snap-start flex-shrink-0 w-[calc(33.333%-8px)] min-w-[160px] p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className={`inline-flex p-2.5 rounded-lg ${cat.bg} mb-3`}>
                <Icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {cat.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">
                {cat.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
