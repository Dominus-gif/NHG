import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Posts — Nord Harton Group",
  description:
    "Perspectives on enterprise digital transformation, engineering, design, and cloud from the Nord Harton team.",
  alternates: { canonical: "/posts" },
};

export default function PostsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Posts"
        title="Insights from the Nord Harton team"
        description="Perspectives on strategy, engineering, and design from the people building mission-critical systems."
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StaggerItem key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-hairline bg-elevated/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-accent">{post.tag}</span>
                    <span className="text-xs text-fg-subtle">{post.readTime}</span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold leading-snug text-fg transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
                  <div className="mt-6 flex items-center gap-2 border-t border-hairline pt-4 text-xs text-fg-subtle">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
