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

function BulletList({ heading, items, delay = 0 }: { heading: string; items: string[]; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <h2 className="mt-14 text-2xl font-semibold tracking-tight">{heading}</h2>
      <ul className="mt-6 flex flex-col gap-4">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 leading-relaxed text-fg-muted">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const meta = [job.location, job.type, job.level, job.salary, job.team];

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline pt-40 pb-16 lg:pt-44 lg:pb-20">
        <div className="blob h-[320px] w-[320px] bg-accent/10" style={{ top: "-120px", right: "8%" }} />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <Link href="/careers" className="text-sm text-fg-muted transition-colors hover:text-accent">
              ← All roles
            </Link>
            <div className="mt-6 flex items-center gap-3 text-xs">
              <span className="font-mono text-accent">{job.department}</span>
              <span className="text-fg-subtle">·</span>
              <span className="text-fg-subtle">{job.posted}</span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              {job.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted">{job.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {meta.map((m) => (
                <span key={m} className="rounded-full border border-hairline px-3 py-1 text-xs text-fg-subtle">{m}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight">About the role</h2>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted">{job.about}</p>
          </Reveal>

          <BulletList heading="What you'll do" items={job.responsibilities} delay={0.04} />
          <BulletList heading="What we're looking for" items={job.requirements} delay={0.04} />
          <BulletList heading="Nice to have (not required)" items={job.niceToHave} delay={0.04} />
          <BulletList heading="What we offer" items={job.offer} delay={0.04} />

          <ApplyCta title={job.title} />
        </div>
      </section>
    </>
  );
}
