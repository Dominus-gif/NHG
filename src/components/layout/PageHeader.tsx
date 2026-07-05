import { Reveal } from "@/components/ui/Reveal";

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-hairline pt-40 pb-16 lg:pt-44 lg:pb-20">
      <div className="blob h-[320px] w-[320px] bg-accent/10" style={{ top: "-120px", right: "10%" }} />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
