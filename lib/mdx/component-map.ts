import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/articles");

export interface ComponentUsage {
  slug: string;
  title: string;
  category: string;
}

export interface ComponentInfo {
  name: string;
  description: string;
  importPath: string;
  usedIn: ComponentUsage[];
}

const COMPONENT_REGISTRY: { name: string; description: string; importPath: string }[] = [
  { name: "JackpotWinProbability", description: "Calculate exact odds for Mega and Midweek jackpots with double chance", importPath: "@/components/interactive/odds/JackpotWinProbability" },
  { name: "ImpliedProbability", description: "Find value bets by comparing your probability estimate vs bookmaker odds", importPath: "@/components/interactive/odds/ImpliedProbability" },
  { name: "OutcomePredictor", description: "Rate factors to build confidence for home or away win predictions", importPath: "@/components/interactive/odds/OutcomePredictor" },
  { name: "DrawProbabilityCalculator", description: "Analyze draw probability by league and odds range", importPath: "@/components/interactive/stats/DrawProbabilityCalculator" },
  { name: "DrawCounter", description: "Check your jackpot slip draw distribution before submitting", importPath: "@/components/interactive/stats/DrawCounter" },
  { name: "WinnersShowcase", description: "Browse real jackpot winner stories and their strategies", importPath: "@/components/interactive/stats/WinnersShowcase" },
  { name: "MoneyPlanner", description: "Plan how to manage jackpot winnings with tax and investment breakdown", importPath: "@/components/interactive/tools/MoneyPlanner" },
  { name: "FakeWinnerCard", description: "Generate fake winner cards for fun and sharing with friends", importPath: "@/components/interactive/tools/FakeWinnerCard" },
  { name: "SiteComparison", description: "Compare betting platforms side by side", importPath: "@/components/interactive/common/SiteComparison" },
  { name: "JackpotBonusCalculator", description: "See bonus payouts for partial correct picks (12/17, 13/17, etc.)", importPath: "@/components/interactive/tools/JackpotBonusCalculator" },
];

export function getComponentMap(): ComponentInfo[] {
  if (!fs.existsSync(CONTENT_DIR)) return COMPONENT_REGISTRY.map((c) => ({ ...c, usedIn: [] }));

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return COMPONENT_REGISTRY.map((comp) => {
    const usedIn: ComponentUsage[] = [];

    for (const file of files) {
      const filePath = path.join(CONTENT_DIR, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      if (!data.published) continue;

      // Check if this component name appears in the MDX content
      if (content.includes(`<${comp.name}`) || content.includes(`<${comp.name} `)) {
        usedIn.push({
          slug: file.replace(/\.mdx$/, ""),
          title: data.title || file.replace(/\.mdx$/, ""),
          category: data.category || "Uncategorized",
        });
      }
    }

    return { ...comp, usedIn };
  });
}
