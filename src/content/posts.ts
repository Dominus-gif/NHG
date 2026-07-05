export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  author: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "why-enterprise-transformation-fails",
    title: "Why enterprise transformation fails — and how to fix it",
    excerpt:
      "Most transformation programs stall not because of technology, but because strategy and delivery drift apart. Here's how to keep them aligned.",
    tag: "Strategy",
    date: "Jun 12, 2026",
    readTime: "6 min read",
    author: "Marcus Lynstad",
    body: [
      "Enterprise transformation rarely fails for technical reasons. The frameworks are mature, the cloud is elastic, and the talent exists. Programs fail when the distance between the boardroom's intent and the engineering team's daily reality grows too large to bridge.",
      "The first symptom is a roadmap that reads like a wish list rather than a sequence of decisions. When every initiative is a priority, none of them are. We start every engagement by forcing a ranking: what is the single outcome that, if achieved, makes the rest easier?",
      "The second symptom is opacity. Status decks show green until the week before launch, when they turn red. Radical transparency — surfacing blockers early, with a proposed solution — is not a courtesy; it is a risk-management strategy. A problem raised in week two costs a fraction of the same problem discovered in week twenty.",
      "The fix is structural, not motivational. Tie every technical decision to a measurable business objective, review architecture assumptions out loud, and keep the people who set the strategy in the same room as the people who build it. Alignment is not a kickoff event — it is a weekly discipline.",
    ],
  },
  {
    slug: "modernizing-legacy-without-halting-the-business",
    title: "Modernizing legacy systems without halting the business",
    excerpt:
      "A big-bang rewrite is the riskiest way to modernize. We break the problem into reversible steps that keep revenue flowing.",
    tag: "Engineering",
    date: "Jun 4, 2026",
    readTime: "8 min read",
    author: "Priya Anand",
    body: [
      "The instinct to rewrite a legacy system from scratch is understandable and almost always wrong. A big-bang replacement asks the business to bet its revenue on a single cut-over date, with no way back.",
      "We favor the strangler pattern: wrap the legacy system, route new functionality through a modern layer, and migrate capabilities one at a time. Each step is small, reversible, and independently valuable.",
      "This approach demands discipline around interfaces and data contracts, but it lets the business keep operating while the foundation is rebuilt underneath it. The old and new systems coexist until the legacy core has nothing left to do.",
      "Modernization is not a project with an end date; it is a capability. Done well, it leaves the organization able to evolve continuously rather than lurching between rewrites every decade.",
    ],
  },
  {
    slug: "designing-for-complexity-enterprise-ux",
    title: "Designing for complexity: enterprise UX that scales",
    excerpt:
      "Consumer-grade polish meets enterprise-grade depth. How we design interfaces that stay clear as the data and permissions multiply.",
    tag: "Design",
    date: "May 28, 2026",
    readTime: "5 min read",
    author: "Sofia Reyes",
    body: [
      "Enterprise software has a reputation for being ugly and confusing. It doesn't have to be. The complexity is real, but complexity in the domain should not become complexity in the interface.",
      "The core technique is progressive disclosure: show the few things that matter now, and reveal depth only when the user asks for it. A dense screen is not a sign of power; it is a sign of unmade decisions.",
      "Permissions, roles, and multi-tenancy multiply the states an interface must handle. We design the empty, loading, error, and permission-denied states first — because in enterprise software, those states are the common case, not the exception.",
      "Good enterprise UX earns trust by being predictable. When the same action always lives in the same place and the system always tells you what happened, users stop fearing the software and start relying on it.",
    ],
  },
  {
    slug: "scaling-data-in-a-hyper-connected-world",
    title: "Scaling data in a hyper-connected world",
    excerpt:
      "As integrations multiply, data becomes both an asset and a liability. A pragmatic architecture keeps it fast, consistent, and governed.",
    tag: "Cloud",
    date: "May 20, 2026",
    readTime: "7 min read",
    author: "David Okonkwo",
    body: [
      "Every new integration is a promise: this data will be here, in this shape, when you need it. Multiply that across dozens of systems and the promises start to conflict.",
      "We design data platforms around a single operational truth — one authoritative source per concept, with everything else treated as a derived, cacheable view. This removes the endless debates about which system is right.",
      "Governance is not a bureaucratic afterthought; it is what makes scale safe. Clear ownership, lineage, and access policies let teams move fast without stepping on each other or breaching compliance.",
      "The goal is a platform where adding the next integration is boring — a well-understood, low-risk step rather than a fresh source of chaos.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
