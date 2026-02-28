"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import InteractiveWrapper from "@/components/interactive/common/InteractiveWrapper";

interface ComponentUsage {
  slug: string;
  title: string;
  category: string;
}

interface ComponentInfo {
  name: string;
  description: string;
  importPath: string;
  usedIn: ComponentUsage[];
}

// Dynamic imports for all interactive components
const componentImports: Record<string, React.ComponentType<any>> = {};

const JackpotWinProbability = dynamic(() => import("@/components/interactive/odds/JackpotWinProbability"));
const ImpliedProbability = dynamic(() => import("@/components/interactive/odds/ImpliedProbability"));
const OutcomePredictor = dynamic(() => import("@/components/interactive/odds/OutcomePredictor"));
const DrawProbabilityCalculator = dynamic(() => import("@/components/interactive/stats/DrawProbabilityCalculator"));
const DrawCounter = dynamic(() => import("@/components/interactive/stats/DrawCounter"));
const WinnersShowcase = dynamic(() => import("@/components/interactive/stats/WinnersShowcase"));
const MoneyPlanner = dynamic(() => import("@/components/interactive/tools/MoneyPlanner"));
const FakeWinnerCard = dynamic(() => import("@/components/interactive/tools/FakeWinnerCard"));
const SiteComparison = dynamic(() => import("@/components/interactive/common/SiteComparison"));
const JackpotBonusCalculator = dynamic(() => import("@/components/interactive/tools/JackpotBonusCalculator"));

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  JackpotWinProbability,
  ImpliedProbability,
  OutcomePredictor,
  DrawProbabilityCalculator,
  DrawCounter,
  WinnersShowcase,
  MoneyPlanner,
  FakeWinnerCard,
  SiteComparison,
  JackpotBonusCalculator,
};

function ComponentCard({ info }: { info: ComponentInfo }) {
  const [open, setOpen] = useState(false);
  const Component = COMPONENT_MAP[info.name];

  return (
    <div className="mb-8">
      {/* Header with name + dropdown toggle */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {info.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{info.description}</p>
          <p className="text-xs text-gray-600 dark:text-gray-500 mt-1 font-mono">{info.importPath}</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0 ml-3"
        >
          Used in {info.usedIn.length} article{info.usedIn.length !== 1 ? "s" : ""}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Dropdown: articles that use this component */}
      {open && info.usedIn.length > 0 && (
        <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          {info.usedIn.map((article) => (
            <Link
              key={article.slug}
              href={`/i/${article.slug}`}
              className="flex items-center justify-between py-1.5 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-300">{article.title}</span>
              <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-500">
                {article.category}
                <ExternalLink className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      )}

      {open && info.usedIn.length === 0 && (
        <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-500">
          Not used in any published article yet.
        </div>
      )}

      {/* Live component */}
      {Component && (
        <InteractiveWrapper fallbackAlt={info.name}>
          <Component />
        </InteractiveWrapper>
      )}
    </div>
  );
}

export default function ComponentShowcase({ components }: { components: ComponentInfo[] }) {
  return (
    <div>
      {components.map((info) => (
        <ComponentCard key={info.name} info={info} />
      ))}
    </div>
  );
}
