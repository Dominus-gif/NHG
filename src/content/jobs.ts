export type Job = {
  slug: string;
  title: string;
  department: string;
  team: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  posted: string;
  summary: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  offer: string[];
};

export const jobs: Job[] = [
  {
    slug: "senior-full-stack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    team: "Product Engineering (team of 6)",
    location: "Remote · Europe / Americas timezones",
    type: "Full-time",
    level: "Senior (5+ years)",
    salary: "$130k – $170k + equity",
    posted: "Posted 2 weeks ago",
    summary:
      "We're looking for a senior engineer who's happiest shipping real features to real users — someone who can own a slice of a product end to end, from the database schema to the last pixel, and who cares as much about the empty state as the happy path.",
    about:
      "You'll join a small, senior product team where there are no tickets thrown over a wall. We pair with clients directly, make our own product decisions, and take responsibility for the outcome — not just the code. Most of us have been the person on call, so we build things we're comfortable being woken up by.",
    responsibilities: [
      "Design, build, and ship production features across the stack — TypeScript, React/Next.js, Node, and PostgreSQL.",
      "Own the architecture of the services you build, and be ready to defend the trade-offs to a room of smart people.",
      "Sit in on client calls, understand the actual problem, and translate fuzzy business goals into a concrete plan.",
      "Care about the whole experience — loading, empty, error, and permission-denied states are your job too, not an afterthought.",
      "Review code thoughtfully, write the tests that matter, and leave the codebase a little better than you found it.",
    ],
    requirements: [
      "5+ years building and operating web applications that real people depend on.",
      "Deep, practical fluency in TypeScript and a modern React framework (Next.js preferred).",
      "Strong instincts for data modeling and API design — you've felt the pain of getting them wrong.",
      "You communicate clearly in writing and would rather over-share context than leave a teammate guessing.",
    ],
    niceToHave: [
      "Experience modernizing a legacy system without a big-bang rewrite.",
      "Comfort with cloud infrastructure and CI/CD (you can get your own thing to production).",
      "A side project, an open-source contribution, or a strong opinion about a framework you can back up.",
    ],
    offer: [
      "Fully remote, async-friendly, with real overlap hours — not 3 a.m. standups.",
      "Genuinely senior peers and zero micromanagement.",
      "A hardware budget and a yearly learning stipend.",
      "Meaningful equity — we want you to own a piece of what you build.",
    ],
  },
  {
    slug: "product-designer",
    title: "Product Designer (Enterprise UX)",
    department: "Design",
    team: "Design (team of 3)",
    location: "Remote · EU / Americas timezones",
    type: "Full-time",
    level: "Mid–Senior (4+ years)",
    salary: "$110k – $145k + equity",
    posted: "Posted 5 days ago",
    summary:
      "Enterprise software has a reputation for being ugly and confusing. We're looking for a designer who takes that personally — who can make genuinely complex, data-dense products feel calm, obvious, and even pleasant to use.",
    about:
      "You'll own the end-to-end design of complex products — research, flows, prototypes, and the shipped pixels — working shoulder to shoulder with engineers who care about craft. We don't have a big design bureaucracy; we have real problems and the autonomy to solve them well.",
    responsibilities: [
      "Lead design for complex, data-heavy enterprise products from first sketch to shipped screen.",
      "Design the whole spectrum of states — empty, loading, error, permission-denied — because in enterprise software they're the common case, not the exception.",
      "Build and maintain a real design system alongside engineering, so consistency is a default, not a chore.",
      "Run lightweight research and usability sessions, and let what you learn change your mind.",
      "Bring clarity to genuine complexity — your job is to make hard things feel simple, not to make simple things look pretty.",
    ],
    requirements: [
      "4+ years designing complex software (B2B / enterprise experience is a strong plus).",
      "A portfolio that shows judgment — clarity brought to messy, real problems, not just dribbble shots.",
      "Fluency in Figma and a working understanding of what's cheap vs expensive to build.",
      "You're comfortable being the person who says 'this is too complicated' and then fixing it.",
    ],
    niceToHave: [
      "You can prototype in code, or at least read it well enough to collaborate closely.",
      "Experience owning or contributing to a design system used by multiple teams.",
      "A point of view about accessibility that goes beyond passing a contrast checker.",
    ],
    offer: [
      "A seat at the table from discovery onward — not a service desk taking pixel requests.",
      "Small, senior team with high trust and low process.",
      "Fully remote with real overlap hours, hardware budget, and learning stipend.",
      "Equity, because your design decisions shape the business.",
    ],
  },
  {
    slug: "cloud-infrastructure-engineer",
    title: "Cloud & Infrastructure Engineer",
    department: "Platform",
    team: "Platform (team of 4)",
    location: "Remote · Global",
    type: "Full-time",
    level: "Senior (4+ years)",
    salary: "$125k – $165k + equity",
    posted: "Posted 3 weeks ago",
    summary:
      "You'll build the scalable, cost-predictable foundation our client platforms run on — the kind of infrastructure that's boring in the best way, because it just works and nobody has to think about it.",
    about:
      "Platform work here isn't a ticket queue. You'll design the systems, automate the toil away, and make problems visible before customers feel them. We treat security and cost as design constraints from day one, not clean-up work for later.",
    responsibilities: [
      "Design and operate cloud infrastructure on AWS/GCP, with everything defined as code.",
      "Build CI/CD pipelines that make shipping to production safe, fast, and unremarkable.",
      "Set up observability and alerting so we hear about problems before customers do.",
      "Keep performance high and costs predictable — and be able to explain the bill.",
      "Bake security and compliance into the platform so product teams inherit it for free.",
    ],
    requirements: [
      "4+ years in DevOps / platform / SRE roles on a major cloud provider.",
      "Strong with Terraform (or similar), containers, and Kubernetes in production.",
      "Solid scripting and automation instincts — you delete toil rather than tolerate it.",
      "A calm, methodical approach to incidents, and the habit of writing down what you learned.",
    ],
    niceToHave: [
      "Experience with multi-region or multi-tenant architectures.",
      "Cost-optimization war stories you're a little proud of.",
      "Security or compliance experience in a regulated industry.",
    ],
    offer: [
      "Ownership of the platform, not just its tickets.",
      "Fully remote, global-friendly, async-first.",
      "Hardware budget, learning stipend, and on-call that's humane and fairly compensated.",
      "Equity in a company where the platform is a real differentiator.",
    ],
  },
];

export function getJob(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}
