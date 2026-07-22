import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import CtaBand from "@/components/sections/CtaBand";
import { posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Posts — Nord Harton Group",
  description:
    "Perspectives on enterprise digital transformation, engineering, design, and cloud from the Nord Harton team.",
};

const grads = ["30% 30%", "70% 40%", "50% 70%", "40% 50%"];

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
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <StaggerItem key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-elevated/60 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
                >
                  <div className="relative h-44 overflow-hidden bg-base">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at ${grads[i % grads.length]}, var(--accent-soft-2), transparent 60%)`,
                      }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-mono text-xs text-accent">{post.tag}</span>
                    <h2 className="mt-3 flex-1 text-lg font-semibold leading-snug text-fg">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
                    <div className="mt-5 flex items-center gap-3 text-xs text-fg-subtle">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
