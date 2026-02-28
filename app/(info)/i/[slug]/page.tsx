import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getArticleBySlug } from "@/lib/mdx";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.updated || article.date,
      tags: article.tags,
      ...(article.image && { images: [{ url: article.image, alt: article.imageAlt || article.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      ...(article.image && { images: [article.image] }),
    },
  };
}

// ─── Interactive Component Registry ───
const InteractiveWrapper = dynamic(() => import("@/components/interactive/common/InteractiveWrapper"));
const ImpliedProbability = dynamic(() => import("@/components/interactive/odds/ImpliedProbability"));
const JackpotWinProbability = dynamic(() => import("@/components/interactive/odds/JackpotWinProbability"));
const OutcomePredictor = dynamic(() => import("@/components/interactive/odds/OutcomePredictor"));
const DrawProbabilityCalculator = dynamic(() => import("@/components/interactive/stats/DrawProbabilityCalculator"));
const DrawCounter = dynamic(() => import("@/components/interactive/stats/DrawCounter"));
const WinnersShowcase = dynamic(() => import("@/components/interactive/stats/WinnersShowcase"));
const MoneyPlanner = dynamic(() => import("@/components/interactive/tools/MoneyPlanner"));
const FakeWinnerCard = dynamic(() => import("@/components/interactive/tools/FakeWinnerCard"));
const SiteComparison = dynamic(() => import("@/components/interactive/common/SiteComparison"));
const JackpotBonusCalculator = dynamic(() => import("@/components/interactive/tools/JackpotBonusCalculator"));

const mdxComponents = {
  InteractiveWrapper,
  ImpliedProbability,
  JackpotWinProbability,
  OutcomePredictor,
  DrawProbabilityCalculator,
  DrawCounter,
  WinnersShowcase,
  MoneyPlanner,
  FakeWinnerCard,
  SiteComparison,
  JackpotBonusCalculator,
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updated || article.date,
    author: { "@type": "Organization", name: "Zeqqat" },
    ...(article.image && { image: article.image }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Title — 36px, centered, tight to component */}
        <h1 className="text-[28px] sm:text-[36px] leading-tight font-bold text-gray-900 dark:text-white text-center mb-3">
          {article.title}
        </h1>

        {/* Article content — component first, then text */}
        <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-headings:text-lg prose-headings:font-semibold prose-p:text-sm prose-p:leading-relaxed prose-li:text-sm">
          <MDXRemote source={article.content} components={mdxComponents} />
        </div>

        {/* Metadata — quiet, at the bottom */}
        <footer className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <span>·</span>
              <span>{article.readingTime}</span>
            </div>
            <Link
              href={`/i/category/${article.category.toLowerCase()}`}
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {article.category}
            </Link>
          </div>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/i/tag/${tag.toLowerCase()}`}
                  className="text-xs px-2 py-0.5 text-gray-500 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </footer>
      </article>
    </>
  );
}
