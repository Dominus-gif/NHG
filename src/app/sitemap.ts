import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { posts } from "@/content/posts";
import { jobs } from "@/content/jobs";
import { allAuthors } from "@/lib/authors";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/posts", priority: 0.8, changeFrequency: "weekly" },
    { path: "/careers", priority: 0.7, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/security", priority: 0.3, changeFrequency: "yearly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => {
    const d = new Date(p.date);
    return {
      url: `${siteUrl}/posts/${p.slug}`,
      lastModified: Number.isNaN(d.getTime()) ? now : d,
      changeFrequency: "monthly",
      priority: 0.6,
    };
  });

  const jobEntries: MetadataRoute.Sitemap = jobs.map((j) => ({
    url: `${siteUrl}/careers/${j.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const authorEntries: MetadataRoute.Sitemap = allAuthors().map((a) => ({
    url: `${siteUrl}/authors/${a.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticEntries, ...postEntries, ...jobEntries, ...authorEntries];
}
