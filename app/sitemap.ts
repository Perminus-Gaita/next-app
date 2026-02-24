import type { MetadataRoute } from "next";
import { getAllArticles, getAllCategories, getAllTags } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.zeqqat.com";
  const articles = getAllArticles();
  const categories = getAllCategories();
  const tags = getAllTags();

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/i/${article.slug}`,
    lastModified: new Date(article.updated || article.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/i/category/${category.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const tagUrls = tags.map((tag) => ({
    url: `${baseUrl}/i/tag/${tag.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/i`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...articleUrls,
    ...categoryUrls,
    ...tagUrls,
  ];
}
