import type { Metadata } from "next";
import Link from "next/link";
import { getComponentMap } from "@/lib/mdx/component-map";
import ComponentShowcase from "./client";

export const metadata: Metadata = {
  title: "Interactive Components — App",
  description: "Browse all interactive tools and calculators used across our articles.",
};

export default function ComponentsPage() {
  const componentMap = getComponentMap();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/i"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
        >
          ← All guides
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Interactive Components
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          All the interactive tools and calculators used in our articles. Click the dropdown on each to see which articles use it.
        </p>
      </div>

      <ComponentShowcase components={componentMap} />
    </div>
  );
}
