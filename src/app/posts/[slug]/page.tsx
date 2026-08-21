import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { posts, getPost } from "@/content/posts";
import { siteUrl, absoluteUrl, toISODate } from "@/lib/seo";
import { authorSlug } from "@/lib/authors";
import { relatedPosts } from "@/lib/postDomains";
import PostBody from "./PostBody";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found — Nord Harton" };
  return {
    title: `${post.title} — Nord Harton`,
    description: post.excerpt,
    alternates: { canonical: `/posts/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/posts/${slug}`,
      publishedTime: toISODate(post.date),
      authors: [post.author],
      tags: [post.tag],
    },
    authors: [{ name: post.author }],
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const published = toISODate(post.date);
  const authorUrl = `${siteUrl}/authors/${authorSlug(post.author)}`;
  const related = relatedPosts(post, posts, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${siteUrl}/posts/${slug}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: published,
        dateModified: published,
        author: { "@type": "Person", name: post.author, url: authorUrl },
        publisher: { "@id": `${siteUrl}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/posts/${slug}` },
        image: absoluteUrl("/opengraph-image"),
        articleSection: post.tag,
        url: `${siteUrl}/posts/${slug}`,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/posts/${slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Posts", item: `${siteUrl}/posts` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/posts/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="relative overflow-hidden border-b border-hairline pt-40 pb-16 lg:pt-44 lg:pb-20">
        <div className="blob h-[320px] w-[320px] bg-accent/10" style={{ top: "-120px", right: "10%" }} />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <Link href="/posts" className="text-sm text-fg-muted transition-colors hover:text-accent">
              ← All posts
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center rounded-full border border-hairline bg-base px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-muted">
                {post.tag}
              </span>
              <span className="text-xs text-fg-subtle">
                {post.date} · {post.readTime}
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted">{post.excerpt}</p>
            <Link href={`/authors/${authorSlug(post.author)}`} className="group mt-8 flex w-fit items-center gap-3 border-t border-hairline pt-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-fg" style={{ background: "var(--surface-subtle)" }}>
                {post.author.split(" ").map((n) => n[0]).join("")}
              </span>
              <span className="text-sm text-fg transition-colors group-hover:text-accent">{post.author}</span>
            </Link>
          </Reveal>
        </div>
      </article>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <PostBody body={post.body} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-hairline py-14 lg:py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Related posts</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/posts/${r.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-hairline bg-elevated/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent">{r.tag}</span>
                  <h3 className="mt-3 text-base font-semibold leading-snug text-fg transition-colors group-hover:text-accent">{r.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted line-clamp-3">{r.excerpt}</p>
                  <span className="mt-4 text-xs text-fg-subtle">{r.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
