export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const jobs: Job[] = [
  {
    slug: "senior-full-stack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote · Global",
    type: "Full-time",
    summary:
      "Build mission-critical enterprise platforms end to end — from data models and APIs to polished, performant interfaces — as part of a small, senior, high-trust team.",
    responsibilities: [
      "Design and ship production features across the stack (TypeScript, React/Next.js, Node, PostgreSQL).",
      "Own architecture decisions for the services you build and defend the assumptions behind them.",
      "Partner directly with clients and strategists to translate business objectives into technical plans.",
      "Uphold Lynstad quality: rigorous code review, meaningful tests, and clear documentation.",
      "Mentor peers and raise the engineering bar through pairing and thoughtful feedback.",
    ],
    requirements: [
      "5+ years building and operating production web applications at scale.",
      "Deep expertise in TypeScript and a modern React framework (Next.js preferred).",
      "Strong data modeling and API design fundamentals; comfortable with cloud infrastructure.",
      "Excellent written communication and a bias toward radical transparency.",
    ],
  },
  {
    slug: "product-designer",
    title: "Product Designer (Enterprise UX)",
    department: "Design",
    location: "Remote · EU / Americas",
    type: "Full-time",
    summary:
      "Turn genuine domain complexity into interfaces that feel calm and obvious. You'll own the end-to-end design of enterprise products from research to shipped pixels.",
    responsibilities: [
      "Lead design for complex, data-dense enterprise products from discovery through delivery.",
      "Design the full spectrum of states — empty, loading, error, and permission-denied.",
      "Build and maintain reusable design-system components alongside engineering.",
      "Run lightweight research and usability sessions to validate decisions with real users.",
    ],
    requirements: [
      "4+ years designing complex software products (B2B / enterprise strongly preferred).",
      "A portfolio that shows clarity brought to genuinely complex problems.",
      "Fluency in Figma and a working understanding of frontend constraints.",
      "Comfort collaborating closely with engineers in a tight delivery loop.",
    ],
  },
  {
    slug: "cloud-infrastructure-engineer",
    title: "Cloud & Infrastructure Engineer",
    department: "Platform",
    location: "Remote · Global",
    type: "Full-time",
    summary:
      "Engineer the scalable, cost-predictable foundation our client platforms run on — cloud architecture, CI/CD, observability, and secure-by-default defaults.",
    responsibilities: [
      "Design and operate cloud infrastructure (AWS/GCP), IaC, and CI/CD pipelines.",
      "Build observability and alerting so problems are visible before customers feel them.",
      "Optimize for performance at scale while keeping costs predictable and transparent.",
      "Embed security and compliance into the platform rather than bolting it on later.",
    ],
    requirements: [
      "4+ years in DevOps / platform / SRE roles on major cloud providers.",
      "Strong with Terraform (or similar), containers, and Kubernetes.",
      "Solid scripting and automation instincts; you eliminate toil.",
      "Calm, methodical approach to incidents and a habit of writing things down.",
    ],
  },
];

export function getJob(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}
