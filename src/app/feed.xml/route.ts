import { posts } from "@/content/posts";
import { siteUrl, siteName, siteDescription, toISODate } from "@/lib/seo";

export const dynamic = "force-static";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// RSS 2.0 feed of the most recent posts, for syndication + crawler discovery.
export function GET() {
  const items = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
    .map((p) => {
      const url = `${siteUrl}/posts/${p.slug}`;
      const pub = new Date(toISODate(p.date));
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${Number.isNaN(pub.getTime()) ? "" : pub.toUTCString()}</pubDate>
      <dc:creator>${esc(p.author)}</dc:creator>
      <category>${esc(p.tag)}</category>
      <description>${esc(p.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteName)} — Posts</title>
    <link>${siteUrl}/posts</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(siteDescription)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
