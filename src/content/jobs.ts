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
    slug: "senior-full-stack-engineer-contract",
    title: "Senior Full-Stack Engineer (6-Month Contract)",
    department: "Engineering",
    team: "Product Engineering (team of 6)",
    location: "Remote · Europe / Americas timezones",
    type: "Contract · 6 months",
    level: "Senior (5+ years)",
    salary: "$110k – $150k (pro-rata)",
    posted: "Posted this week",
    summary:
      "We're looking for a senior engineer to join us for a focused six-month engagement, shipping real features to real users — someone who can own a slice of a product end to end, from the database schema to the last pixel, and who cares as much about the empty state as the happy path.",
    about:
      "This is a six-month contract on a small, senior product team where there are no tickets thrown over a wall. We pair with clients directly, make our own product decisions, and take responsibility for the outcome — not just the code. You'll have a defined scope for the engagement and real ownership of it from day one.",
    responsibilities: [
      "Design, build, and ship production features across the stack — TypeScript, React/Next.js, Go, and PostgreSQL.",
      "Own the architecture of the services you build, and be ready to defend the trade-offs to a room of smart people.",
      "Sit in on client calls, understand the actual problem, and translate fuzzy business goals into a concrete plan.",
      "Care about the whole experience — loading, empty, error, and permission-denied states are your job too, not an afterthought.",
      "Review code thoughtfully, write the tests that matter, and leave the codebase a little better than you found it.",
    ],
    requirements: [
      "5+ years building and operating web applications that real people depend on.",
      "Deep, practical fluency in TypeScript and a modern React framework (Next.js preferred).",
      "Comfort with a Go (or similar statically-typed) backend, and strong instincts for data modeling and API design.",
      "You communicate clearly in writing and ramp fast — a contract means getting productive in days, not months.",
    ],
    niceToHave: [
      "Experience modernizing a legacy system without a big-bang rewrite.",
      "Comfort with cloud infrastructure and CI/CD (you can get your own thing to production).",
      "A track record of dropping into a new codebase and contributing quickly.",
    ],
    offer: [
      "A clearly-scoped six-month engagement with potential to extend.",
      "Fully remote, async-friendly, with real overlap hours — not 3 a.m. standups.",
      "Genuinely senior peers and zero micromanagement.",
      "Competitive day/month rate and a hardware budget for the duration.",
    ],
  },
  {
    slug: "product-designer-contract",
    title: "Product Designer (Enterprise UX) — 6-Month Contract",
    department: "Design",
    team: "Design (team of 3)",
    location: "Remote · EU / Americas timezones",
    type: "Contract · 6 months",
    level: "Mid–Senior (4+ years)",
    salary: "$110k – $150k (pro-rata)",
    posted: "Posted 3 days ago",
    summary:
      "Enterprise software has a reputation for being ugly and confusing. We're looking for a designer to join us for six months who takes that personally — who can make genuinely complex, data-dense products feel calm, obvious, and even pleasant to use.",
    about:
      "This is a six-month contract where you'll own the end-to-end design of complex products — research, flows, prototypes, and the shipped pixels — working shoulder to shoulder with engineers who care about craft. We don't have a big design bureaucracy; we have real problems and the autonomy to solve them well, with a clear scope for the engagement.",
    responsibilities: [
      "Lead design for complex, data-heavy enterprise products from first sketch to shipped screen.",
      "Design the whole spectrum of states — empty, loading, error, permission-denied — because in enterprise software they're the common case, not the exception.",
      "Build and extend a design system in Figma alongside engineering, so consistency is a default, not a chore.",
      "Run lightweight research and usability sessions, and let what you learn change your mind.",
      "Bring clarity to genuine complexity — your job is to make hard things feel simple, not to make simple things look pretty.",
    ],
    requirements: [
      "4+ years designing complex software (B2B / enterprise experience is a strong plus).",
      "A portfolio that shows judgment — clarity brought to messy, real problems, not just dribbble shots.",
      "Fluency in Figma, prototyping, and design tokens, with a working understanding of what's cheap vs expensive to build.",
      "You're self-directed and ramp fast — a contract means contributing meaningfully from the first weeks.",
    ],
    niceToHave: [
      "You can prototype in code, or at least read it well enough to collaborate closely.",
      "Experience owning or contributing to a design system used by multiple teams.",
      "A point of view about accessibility that goes beyond passing a contrast checker.",
    ],
    offer: [
      "A clearly-scoped six-month engagement with potential to extend.",
      "A seat at the table from discovery onward — not a service desk taking pixel requests.",
      "Small, senior team with high trust and low process.",
      "Competitive day/month rate, fully remote with real overlap hours, and a hardware budget.",
    ],
  },
  {
    slug: "cloud-platform-engineer-contract",
    title: "Cloud & Platform Engineer (Azure) — 6-Month Contract",
    department: "Platform",
    team: "Platform (team of 4)",
    location: "Remote · Global",
    type: "Contract · 6 months",
    level: "Senior (4+ years)",
    salary: "$110k – $150k (pro-rata)",
    posted: "Posted 5 days ago",
    summary:
      "You'll spend six months building the scalable, cost-predictable foundation our client platforms run on — the kind of infrastructure that's boring in the best way, because it just works and nobody has to think about it.",
    about:
      "Platform work here isn't a ticket queue. For this six-month engagement you'll design the systems, automate the toil away, and make problems visible before customers feel them. We treat security and cost as design constraints from day one, not clean-up work for later.",
    responsibilities: [
      "Design and operate cloud infrastructure on Azure, with everything defined as code.",
      "Build CI/CD pipelines that make shipping to production safe, fast, and unremarkable.",
      "Set up observability and alerting so we hear about problems before customers do.",
      "Keep performance high and costs predictable — and be able to explain the bill.",
      "Bake security and compliance into the platform so product teams inherit it for free.",
    ],
    requirements: [
      "4+ years in DevOps / platform / SRE roles on a major cloud provider (Azure experience a strong plus).",
      "Strong with Terraform (or Bicep), containers, and Kubernetes in production.",
      "Solid scripting and automation instincts — you delete toil rather than tolerate it.",
      "A calm, methodical approach to incidents, and the ability to get productive fast on a contract.",
    ],
    niceToHave: [
      "Experience with multi-region or multi-tenant architectures.",
      "Cost-optimization war stories you're a little proud of.",
      "Security or compliance experience in a regulated industry.",
    ],
    offer: [
      "A clearly-scoped six-month engagement with potential to extend.",
      "Ownership of the platform, not just its tickets.",
      "Fully remote, global-friendly, async-first.",
      "Competitive day/month rate, a hardware budget, and on-call that's humane and fairly compensated.",
    ],
  },
  {
    slug: "machine-learning-engineer-contract",
    title: "Machine Learning Engineer — 6-Month Contract",
    department: "AI & Data",
    team: "AI & Data (team of 4)",
    location: "Remote · EU / Americas timezones",
    type: "Contract · 6 months",
    level: "Mid–Senior (4+ years)",
    salary: "$110k – $150k (pro-rata)",
    posted: "Posted 1 week ago",
    summary:
      "We're looking for an ML engineer for a six-month engagement who cares about what happens after the notebook — someone who can take a model from a promising experiment to a reliable service that clients actually depend on, and who knows the difference between a good metric and a useful one.",
    about:
      "For this six-month contract you'll own machine learning problems end to end: framing the question, wrangling the data, training the model, and — the part most people skip — getting it into production and keeping it honest once real inputs start arriving. We treat data quality and monitoring as first-class work, not afterthoughts.",
    responsibilities: [
      "Frame business problems as ML problems, then build, evaluate, and ship the models that solve them.",
      "Own the full lifecycle — data pipelines, training, deployment, and monitoring — not just the modeling notebook.",
      "Build the evaluation harness that tells the truth about whether a model is actually working in production.",
      "Watch for drift and degradation, and be ready to retrain or roll back before clients feel it.",
      "Work directly with clients and product to make sure the model solves the real problem, not a proxy for it.",
    ],
    requirements: [
      "4+ years building and deploying machine learning systems that ran in production.",
      "Strong Python and the practical ML stack (e.g. scikit-learn, pandas, and a deep-learning framework).",
      "Solid grounding in data modeling, feature engineering, and honest evaluation — you've been burned by a leaky metric.",
      "You ramp fast and communicate trade-offs clearly — a contract means shipping value early.",
    ],
    niceToHave: [
      "Experience with MLOps tooling and getting models served reliably at scale.",
      "Comfort with cloud infrastructure and data pipelines end to end.",
      "A paper, a competition placing, or a production model you're genuinely proud of.",
    ],
    offer: [
      "A clearly-scoped six-month engagement with potential to extend.",
      "Real ownership of ML problems from framing to production — no ticket queue.",
      "Fully remote, async-friendly, with real overlap hours.",
      "Competitive day/month rate, plus a hardware and compute budget for the duration.",
    ],
  },
  {
    slug: "applied-ai-engineer-contract",
    title: "Applied AI Engineer (LLM) — 6-Month Contract",
    department: "AI & Data",
    team: "AI & Data (team of 4)",
    location: "Remote · EU / Americas timezones",
    type: "Contract · 6 months",
    level: "Mid–Senior (4+ years)",
    salary: "$110k – $150k (pro-rata)",
    posted: "Posted 4 days ago",
    summary:
      "We're looking for an engineer for a six-month engagement who can turn large language models into products that are useful, safe, and dependable — someone who's past the demo phase and knows that the hard part is everything between an impressive prototype and a system you'd trust in front of a client.",
    about:
      "For this six-month contract you'll build AI features that real businesses run on — retrieval systems, assistants grounded in a client's own data, and workflows where a human stays in the loop on anything that matters. We care as much about guardrails, evaluation, and cost as we do about the clever prompt.",
    responsibilities: [
      "Design and ship LLM-powered features — retrieval-augmented systems, assistants, and agentic workflows grounded in real data.",
      "Build the evaluation and guardrails that make AI output trustworthy enough to put in front of clients.",
      "Keep a human in the loop where it counts, and draw hard lines around anything irreversible an AI shouldn't do alone.",
      "Watch and control latency, cost, and quality — an impressive feature that's slow or expensive isn't shippable.",
      "Work with clients and product to find where AI genuinely helps, and to say so when it doesn't.",
    ],
    requirements: [
      "4+ years in software engineering, with real, shipped experience building on LLMs or ML APIs.",
      "Strong Python and/or TypeScript, and fluency with the modern AI tooling ecosystem.",
      "A healthy skepticism about model output — you build checks for the failure modes rather than trusting the happy path.",
      "You get productive fast and can explain to a non-technical stakeholder what AI can and can't reliably do.",
    ],
    niceToHave: [
      "Experience with retrieval, vector search, or grounding models in private data.",
      "Familiarity with prompt evaluation, fine-tuning, or building agentic systems safely.",
      "A side project or demo that shows you can take an AI idea all the way to something usable.",
    ],
    offer: [
      "A clearly-scoped six-month engagement with potential to extend.",
      "Work on genuinely current AI problems with the autonomy to solve them well.",
      "Fully remote, async-friendly, with real overlap hours.",
      "Competitive day/month rate, plus a hardware and API/compute budget for the duration.",
    ],
  },
  {
    slug: "frontend-engineer-vue-contract",
    title: "Frontend Engineer (Vue / Nuxt) — 6-Month Contract",
    department: "Engineering",
    team: "Product Engineering (team of 6)",
    location: "Remote · Europe / Americas timezones",
    type: "Contract · 6 months",
    level: "Mid (3+ years)",
    salary: "$110k – $150k (pro-rata)",
    posted: "Posted 6 days ago",
    summary:
      "We're looking for a frontend engineer for a six-month engagement who sweats the details — someone who can turn a design into an interface that's fast, accessible, and genuinely nice to use, and who treats the empty and error states as part of the craft, not clean-up.",
    about:
      "For this six-month contract you'll build the interfaces clients live in every day, working closely with design and backend engineers who care about quality. There's no wall between design and dev here — you'll have real input on how things look and feel, and real ownership of how they perform.",
    responsibilities: [
      "Build polished, responsive, accessible interfaces in Vue and Nuxt with TypeScript.",
      "Turn designs into pixel-accurate, performant UI — and push back thoughtfully when something won't work in practice.",
      "Own the full range of states — loading, empty, error, permission-denied — because that's where good frontends are made.",
      "Care about performance and accessibility as features, not checkboxes you tick at the end.",
      "Collaborate closely with design and backend so the seams between them disappear.",
    ],
    requirements: [
      "3+ years building production web interfaces with Vue (Nuxt a strong plus); comfort picking up new frameworks fast.",
      "Strong TypeScript, CSS, and an eye for detail that makes good design feel effortless.",
      "A real understanding of accessibility and web performance, and how to actually improve them.",
      "You ramp quickly and would rather ask a question than guess at an ambiguous design.",
    ],
    niceToHave: [
      "Experience with design systems and component libraries used across teams.",
      "Comfort with animation and interaction detail done tastefully.",
      "A side project or portfolio piece where the craft is obvious.",
    ],
    offer: [
      "A clearly-scoped six-month engagement with potential to extend.",
      "A real say in how the product looks and feels — not just implementing tickets.",
      "Fully remote, async-friendly, with real overlap hours.",
      "Competitive day/month rate and a hardware budget for the duration.",
    ],
  },
  {
    slug: "business-analyst-contract",
    title: "Business Analyst — 6-Month Contract",
    department: "Strategy",
    team: "Strategy & Delivery (team of 5)",
    location: "Remote · EU / Americas timezones",
    type: "Contract · 6 months",
    level: "Mid (3+ years)",
    salary: "$110k – $150k (pro-rata)",
    posted: "Posted 1 week ago",
    summary:
      "We're looking for a business analyst for a six-month engagement who can sit between the client and the build team and make both sides sharper — someone who turns fuzzy goals into clear requirements, and who cares whether what we ship actually moved the number it was supposed to.",
    about:
      "For this six-month contract you'll be the person who makes sure we're solving the right problem before anyone writes code. You'll talk to clients, dig into their data and processes, and translate what you learn into requirements the team can build against — then close the loop and check it worked.",
    responsibilities: [
      "Work directly with clients to understand their goals, processes, and the problem underneath the request.",
      "Turn fuzzy business goals into clear, testable requirements the delivery team can build against.",
      "Analyze data and processes to find where the real friction and opportunity are, and back recommendations with evidence.",
      "Define the metrics that tell us whether a project actually worked — before it ships, not after.",
      "Keep clients and the build team aligned, so nothing important gets lost in translation.",
    ],
    requirements: [
      "3+ years as a business analyst, product analyst, or similar bridging business and delivery.",
      "Strong analytical skills and comfort working with data and BI tools (e.g. SQL, Power BI) to support a recommendation.",
      "Excellent written and verbal communication — you can run a client workshop and write a crisp requirements doc.",
      "You get up to speed quickly and ask 'what problem are we actually solving?' before jumping to a solution.",
    ],
    niceToHave: [
      "Familiarity with digging into data yourself rather than waiting on someone else.",
      "Experience in enterprise or consulting environments with multiple stakeholders.",
      "Exposure to how software actually gets built, so your requirements are realistic.",
    ],
    offer: [
      "A clearly-scoped six-month engagement with potential to extend.",
      "A real seat in shaping what gets built and why — not just note-taking.",
      "Fully remote, async-friendly, with real overlap hours.",
      "Competitive day/month rate and a hardware budget for the duration.",
    ],
  },
];

export function getJob(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}
