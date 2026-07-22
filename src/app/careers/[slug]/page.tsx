import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import ApplyCta from "@/components/careers/ApplyCta";
import { jobs, getJob } from "@/content/jobs";

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return { title: "Role not found — Nord Harton Group" };
  return { title: `${job.title} — Careers — Nord Harton Group`, description: job.summary };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline pt-40 pb-16 lg:pt-44 lg:pb-20">
        <div className="blob h-[320px] w-[320px] bg-accent/10" style={{ top: "-120px", right: "8%" }} />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <Link href="/careers" className="text-sm text-fg-muted transition-colors hover:text-accent">
              ← All roles
            </Link>
            <span className="mt-6 block font-mono text-xs text-accent">{job.department}</span>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              {job.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-muted">
              <span>{job.location}</span>
              <span>·</span>
              <span>{job.type}</span>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted">{job.summary}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight">Roles &amp; responsibilities</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {job.responsibilities.map((item, i) => (
                <li key={i} className="flex gap-3 text-lg leading-relaxed text-fg-muted">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-14 text-2xl font-semibold tracking-tight">What we&apos;re looking for</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {job.requirements.map((item, i) => (
                <li key={i} className="flex gap-3 text-lg leading-relaxed text-fg-muted">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <ApplyCta title={job.title} />
        </div>
      </section>
    </>
  );
}
