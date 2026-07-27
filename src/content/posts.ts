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
    author: "Marcus Nord Harton",
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
  {
    slug: "ai-in-the-design-workflow",
    title: "AI in the design workflow: co-pilot, not autopilot",
    excerpt:
      "Generative tools have changed how teams explore ideas. The winners treat AI as a fast intern, not a replacement for judgment.",
    tag: "Design",
    date: "Feb 18, 2024",
    readTime: "6 min read",
    author: "Sofia Reyes",
    body: [
      "The first wave of AI design tools promised to replace designers. The reality is more interesting: they replaced the blank canvas. Exploration that used to take a day now takes an hour, and the cost of trying a bad idea has dropped close to zero.",
      "That shift rewards teams who can judge quickly. When you can generate forty directions before lunch, taste and critique become the scarce skills — not the ability to push pixels. The best designers we work with use AI to widen the funnel, then apply ruthless editorial judgment to narrow it.",
      "Where it breaks down is systems thinking. AI is excellent at a single beautiful screen and poor at the twentieth state of a complex flow — the empty, error, and permission-denied cases that define enterprise software. Those still demand a human who understands the domain.",
      "Our rule is simple: AI drafts, humans decide. Used that way, it is the most useful collaborator to arrive in a decade. Used as autopilot, it produces confident, plausible, subtly wrong work at scale.",
    ],
  },
  {
    slug: "design-systems-that-survive-scale",
    title: "Design systems that survive scale",
    excerpt:
      "Most design systems die not from bad components, but from weak governance. Here's what keeps one alive across dozens of teams.",
    tag: "Design",
    date: "Sep 9, 2025",
    readTime: "7 min read",
    author: "Sofia Reyes",
    body: [
      "A design system is easy to launch and hard to keep alive. The launch is a library of components; survival is a social contract about how those components change, who owns them, and how teams adopt them without forking.",
      "The systems that last treat tokens as the source of truth — color, spacing, and type defined once and consumed everywhere. When a brand refresh means changing values in one place rather than hunting through a hundred screens, the system has earned its keep.",
      "Governance is the unglamorous half. A clear contribution path, versioning that doesn't break consumers overnight, and documentation that shows the why, not just the what, are what separate a living system from an abandoned Figma file.",
      "Measure adoption, not output. A system with fifty components and 20% adoption is failing; one with twenty components used everywhere is a quiet success.",
    ],
  },
  {
    slug: "edge-computing-comes-of-age",
    title: "Edge computing comes of age",
    excerpt:
      "Running logic closer to users is no longer exotic. It's becoming the default for latency-sensitive, globally distributed products.",
    tag: "Cloud",
    date: "Nov 22, 2024",
    readTime: "8 min read",
    author: "David Okonkwo",
    body: [
      "For years the edge was a niche — CDNs for static assets and little else. That has changed. Runtimes now let you execute real application logic within milliseconds of your users, anywhere in the world, without managing servers in every region.",
      "The appeal is obvious for anything latency-sensitive: personalization, auth checks, A/B routing, and API shaping all belong at the edge, where a round trip to a central database would cost you a hundred milliseconds you can't spare.",
      "The trade-off is a new mental model. State is the hard part — the edge is stateless by design, so you architect around distributed data, eventual consistency, and careful cache invalidation rather than a single trusted database.",
      "Used well, the edge collapses the distance between your users and your product. Used carelessly, it scatters your logic across two runtimes and doubles your debugging surface. The discipline is deciding what genuinely belongs there.",
    ],
  },
  {
    slug: "accessibility-is-a-feature",
    title: "Accessibility is a feature, not a checklist",
    excerpt:
      "Treating accessibility as a compliance chore produces mediocre products. Treating it as a design constraint produces better ones for everyone.",
    tag: "Design",
    date: "Apr 3, 2025",
    readTime: "5 min read",
    author: "Priya Anand",
    body: [
      "Accessibility gets framed as a legal risk to be managed, which is exactly why so many products do it badly. A checklist at the end of a project produces the minimum: technically compliant, practically clumsy.",
      "The reframe that works is treating accessibility as a design constraint from the start. Keyboard navigation forces clearer focus order. Sufficient contrast forces a more legible palette. Captions and transcripts make content searchable. Constraints, as ever, produce better design.",
      "The population that benefits is far wider than people realize — anyone on a phone in bright sunlight, anyone in a noisy room, anyone tired at the end of a long day. Designing for the edges improves the center.",
      "We build the accessible states first because in real products they are not edge cases; they are Tuesday. A product that works for everyone is simply a better product.",
    ],
  },
  {
    slug: "serverless-grows-up",
    title: "Serverless grows up",
    excerpt:
      "The cold-start jokes are mostly obsolete. Serverless has matured into a credible default for a wide class of backends.",
    tag: "Engineering",
    date: "Jan 14, 2026",
    readTime: "7 min read",
    author: "Priya Anand",
    body: [
      "Serverless earned a reputation early for cold starts, vendor lock-in, and debugging pain. Much of that critique is now out of date. Runtimes are faster, tooling is mature, and the operational savings are real.",
      "The strongest case is spiky, event-driven work: webhooks, scheduled jobs, image processing, and APIs with unpredictable traffic. Paying only for execution time — and never for idle servers at 3 a.m. — is a genuine advantage.",
      "It is still not a universal answer. Long-running processes, heavy stateful workloads, and latency floors below a few milliseconds are better served elsewhere. Maturity means knowing the boundary, not evangelizing past it.",
      "For most product teams, the right architecture in 2026 is a pragmatic mix: serverless for the spiky edges, long-lived services for the hot core, and a clear reason for each choice.",
    ],
  },
  {
    slug: "motion-with-meaning",
    title: "Motion with meaning: micro-interactions that earn their keep",
    excerpt:
      "Animation is easy to add and easy to overdo. Good motion communicates; decorative motion just delays.",
    tag: "Design",
    date: "Jul 27, 2025",
    readTime: "5 min read",
    author: "Sofia Reyes",
    body: [
      "Motion is the most abused tool in the modern interface. A page where everything fades, slides, and bounces feels less premium, not more — it feels slow, because every animation is a small tax on the user's attention.",
      "Motion earns its place when it communicates: showing where a panel came from so the user keeps their bearings, confirming an action landed, or drawing the eye to a change they'd otherwise miss. That is functional motion, and users barely notice it — which is the point.",
      "Timing is everything. Interface motion lives in the 150–400ms range; anything slower feels sluggish, anything instant feels broken. Easing should mimic the physical world, arriving with a gentle deceleration rather than a mechanical linear slide.",
      "The test we apply: remove the animation and see if the interaction is worse. If it isn't, the motion was decoration, and decoration is the first thing to cut.",
    ],
  },
  {
    slug: "typescript-everywhere",
    title: "TypeScript everywhere: the quiet standardization",
    excerpt:
      "Types have gone from a debate to a default. The interesting question now is how to use them well, not whether to use them.",
    tag: "Engineering",
    date: "May 30, 2024",
    readTime: "6 min read",
    author: "David Okonkwo",
    body: [
      "The argument about whether to adopt TypeScript is effectively over. New projects reach for it by default, and the ecosystem has followed — libraries ship types, frameworks assume them, and editors are built around them.",
      "The value was never about catching typos. It is about encoding intent: a well-typed API is documentation that cannot go stale, and a refactor across a large codebase becomes a conversation with the compiler rather than an act of faith.",
      "The failure mode is overreach. Teams that model every conceivable state in the type system produce signatures no one can read. The craft is knowing when a precise type clarifies and when it just obscures — types serve the reader, not the author's cleverness.",
      "Used with restraint, types are the cheapest quality investment available: a permanent safety net that pays out on every change for the life of the project.",
    ],
  },
  {
    slug: "theming-and-dark-mode-done-right",
    title: "Theming and dark mode, done right",
    excerpt:
      "Dark mode is table stakes. Doing it properly means a token architecture, not a second stylesheet.",
    tag: "Design",
    date: "Mar 11, 2026",
    readTime: "6 min read",
    author: "Priya Anand",
    body: [
      "Users expect dark mode, and bolting it on as a duplicate stylesheet is how teams end up maintaining two sources of truth that slowly drift apart. The maintainable path is semantic tokens.",
      "Instead of naming a color 'gray-900', name it by role: 'surface', 'text-strong', 'border'. Each theme maps those roles to concrete values, and every component references the role. Switching themes becomes swapping a small map, not rewriting components.",
      "The subtleties are in the details. Dark mode is not just inverted — shadows barely read, so elevation shifts to subtle borders and lighter surfaces; pure white text on pure black vibrates, so both are pulled toward gray. These are design decisions, not toggles.",
      "Get the token layer right and a full rebrand — or a new client's palette — becomes an afternoon, not a quarter.",
    ],
  },
  {
    slug: "zero-trust-becomes-the-baseline",
    title: "Zero trust becomes the baseline",
    excerpt:
      "The perimeter is gone. Security models that assume a trusted internal network are quietly being replaced by verify-everything defaults.",
    tag: "Cloud",
    date: "Oct 16, 2025",
    readTime: "8 min read",
    author: "David Okonkwo",
    body: [
      "The old model was a castle and a moat: a hardened perimeter, and implicit trust for anything inside it. Remote work, cloud services, and third-party integrations dissolved the moat. There is no longer a reliable 'inside'.",
      "Zero trust replaces location-based trust with continuous verification. Every request is authenticated and authorized on its own merits, regardless of where it originates. A service in your own network gets no more benefit of the doubt than one on the public internet.",
      "In practice this means strong identity for both users and services, least-privilege access that is reviewed rather than granted forever, and logging that makes anomalies visible before they become incidents.",
      "It is a shift in posture more than a product you buy. Adopted incrementally — starting with your most sensitive systems — it dramatically shrinks the blast radius when, not if, something is compromised.",
    ],
  },
  {
    slug: "composable-and-headless-architecture",
    title: "Composable, headless, and the return of the best tool for the job",
    excerpt:
      "Monolithic platforms are giving way to composable stacks. The freedom is real — and so is the responsibility that comes with it.",
    tag: "Engineering",
    date: "Jun 8, 2026",
    readTime: "7 min read",
    author: "Marcus Nord Harton",
    body: [
      "The all-in-one platform promised simplicity and often delivered a cage: you got everything, and you were stuck with the weakest part of everything. Composable architecture is the reaction — assemble best-in-class pieces connected by clean APIs.",
      "Headless is the clearest expression of this. Decoupling the content and commerce layer from the presentation layer lets the same data drive a website, an app, a kiosk, and a partner integration without duplicating logic.",
      "The freedom has a cost. Someone now owns the seams between services — the integration, the data contracts, the failure modes when one piece is slow. Composable stacks move complexity from inside a vendor's platform to inside your architecture.",
      "The teams that thrive treat those seams as first-class engineering, not an afterthought. Done well, composable architecture is how you stay fast for a decade instead of rewriting every three years.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
