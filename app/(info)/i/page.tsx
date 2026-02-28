import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, getAllCategories } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "zeqqat — Data-Driven Betting Research",
  description:
    "Research tools and insights for smarter betting. Define your strategy, test it with data.",
};

export default function BlogHomePage() {
  const articles = getAllArticles();
  const categories = getAllCategories();

  const featured = articles[0] || null;
  const recent = articles.slice(1);

  return (
    <div>
      {/* Hero — centered, minimal */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Zeqqat
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Data-driven tools for smarter betting research.
        </p>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          <Link
            href="/i"
            className="text-xs px-3 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium"
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/i/category/${category.toLowerCase()}`}
              className="text-xs px-3 py-1.5 rounded-full ring-1 ring-gray-200 dark:ring-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      )}

      {/* Articles list — clean, minimal */}
      <div className="space-y-4">
        {articles.map((article, i) => (
          <Link
            key={article.slug}
            href={`/i/${article.slug}`}
            className="block group"
          >
            <div className="rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                {article.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                {article.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          Articles coming soon.
        </p>
      )}
    </div>
  );
}
