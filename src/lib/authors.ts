import { posts, type Post } from "@/content/posts";
import { domainForTag } from "@/lib/postDomains";

export function authorSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function postsByAuthor(name: string): Post[] {
  return posts.filter((p) => p.author === name).sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
}

/** A light, honest role derived from what the author actually writes about —
 *  no fabricated credentials. E.g. "Writes on Data & AI at Nord Harton". */
export function authorRole(name: string): string {
  const counts = new Map<string, number>();
  for (const p of postsByAuthor(name)) {
    const d = domainForTag(p.tag);
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return top ? `Writes on ${top} at Nord Harton` : "Contributor at Nord Harton";
}

export type AuthorInfo = { name: string; slug: string; role: string; count: number };

export function allAuthors(): AuthorInfo[] {
  const names = new Map<string, number>();
  for (const p of posts) names.set(p.author, (names.get(p.author) ?? 0) + 1);
  return [...names.entries()]
    .map(([name, count]) => ({ name, slug: authorSlug(name), role: authorRole(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function authorBySlug(slug: string): AuthorInfo | undefined {
  return allAuthors().find((a) => a.slug === slug);
}
