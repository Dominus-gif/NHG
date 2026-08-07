import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { posts, getPost } from "@/content/posts";
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
      publishedTime: post.date,
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

  return (
    <>
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
            <div className="mt-8 flex items-center gap-3 border-t border-hairline pt-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-fg" style={{ background: "var(--surface-subtle)" }}>
                {post.author.split(" ").map((n) => n[0]).join("")}
              </span>
              <span className="text-sm text-fg">{post.author}</span>
            </div>
          </Reveal>
        </div>
      </article>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <PostBody body={post.body} />
        </div>
      </section>
    </>
  );
}
