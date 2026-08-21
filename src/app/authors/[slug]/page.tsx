import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { allAuthors, authorBySlug, postsByAuthor } from "@/lib/authors";
import { siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return allAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = authorBySlug(slug);
  if (!author) return { title: "Author not found — Nord Harton" };
  return {
    title: `${author.name} — Nord Harton`,
    description: `Articles by ${author.name}. ${author.role}.`,
    alternates: { canonical: `/authors/${slug}` },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = authorBySlug(slug);
  if (!author) notFound();

  const authored = postsByAuthor(author.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/authors/${slug}#profilepage`,
    url: `${siteUrl}/authors/${slug}`,
    mainEntity: {
      "@type": "Person",
      "@id": `${siteUrl}/authors/${slug}#person`,
      name: author.name,
      jobTitle: author.role,
      url: `${siteUrl}/authors/${slug}`,
      worksFor: { "@id": `${siteUrl}/#organization` },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader eyebrow="Author" title={author.name} description={`${author.role}. ${authored.length} article${authored.length === 1 ? "" : "s"}.`} />

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {authored.map((post) => (
              <StaggerItem key={post.slug}>
                <Link href={`/posts/${post.slug}`} className="group flex h-full flex-col rounded-2xl border border-hairline bg-elevated/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                  <span className="inline-flex w-fit items-center rounded-full border border-hairline bg-base px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-muted">{post.tag}</span>
                  <h2 className="mt-6 text-lg font-semibold leading-snug tracking-tight text-fg transition-colors group-hover:text-accent">{post.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
                  <div className="mt-6 border-t border-hairline pt-4 text-xs text-fg-subtle">{post.date} · {post.readTime}</div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <Link href="/posts" className="mt-10 inline-block text-sm font-medium text-accent transition-colors hover:underline">← All posts</Link>
        </div>
      </section>
    </>
  );
}
