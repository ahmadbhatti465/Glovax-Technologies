import { BlogPost } from "@/types";

export const softwareBlogs: BlogPost[] = [
  {
    id: "legacy-codebase-modernization-strangler-fig-pattern",
    title: "Legacy Codebase Modernization: The Strangler Fig Pattern & Incremental Refactoring",
    slug: "legacy-codebase-modernization-strangler-fig-pattern",
    excerpt: "How to modernize legacy monolithic enterprise software without risky total rewrites: Strangler Fig pattern, API proxy routing, and event-driven data sync.",
    author: "Glovax Architecture Group",
    category: "Custom Software",
    tags: ["Legacy Modernization", "Strangler Fig", "Refactoring", "Enterprise Architecture", "Software Engineering"],
    publishedAt: "2026-08-25",
    readTime: 9,
    featured: true,
    featuredImage: "/images/glovax-og.png",
    featuredImageAlt: "Legacy Codebase Modernization using the Strangler Fig Pattern Architecture",
    seoTitle: "Legacy Codebase Modernization: Strangler Fig Pattern (2026)",
    metaDescription: "Modernize legacy systems safely. Learn how the Strangler Fig architectural pattern replaces legacy monoliths incrementally with zero downtime.",
    focusKeyword: "legacy software modernization Strangler Fig",
    secondaryKeywords: ["Strangler Fig pattern tutorial", "modernize legacy enterprise codebase", "monolith refactoring strategy", "legacy migration roadmap"],
    canonicalUrl: "https://glovaxtechnologies.com/blog/legacy-codebase-modernization-strangler-fig-pattern",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "Legacy Codebase Modernization: Strangler Fig Pattern",
    ogDescription: "An executive and architectural guide for replacing aging legacy applications with modern, cloud-native tech stacks.",
    ogImage: "/images/glovax-og.png",
    ogImageAlt: "Legacy Modernization Architecture",
    twitterTitle: "Legacy Codebase Modernization Guide",
    twitterDescription: "Eliminate legacy technical debt without risking business continuity using the Strangler Fig pattern.",
    twitterImage: "/images/glovax-og.png",
    status: "published",
    content: `<h2>The Lethal Risk of the 'Big Bang' Software Rewrite</h2>
<p>Attempting to replace a 10-year-old mission-critical enterprise system with a massive total rewrite often ends in disaster: multi-year delivery delays, blown budgets, and missed edge cases. The <strong>Strangler Fig Pattern</strong> offers an incremental, risk-free alternative by gradually replacing specific features until the legacy core can be safely deprecated.</p>

<h2>The 3 Phases of Strangler Fig Migration</h2>
<ol>
  <li><strong>Transform:</strong> Build a new microservice or Next.js module to handle a specific slice of functionality (e.g., user authentication or invoice generation).</li>
  <li><strong>Coexist (API Gateway Interception):</strong> Place an intelligent reverse proxy (such as Cloudflare or AWS API Gateway) in front of both systems, routing target URLs to the new service while proxying everything else to legacy.</li>
  <li><strong>Eliminate:</strong> Gradually expand the scope of the new architecture until the legacy monolith handles zero traffic and can be safely decommissioned.</li>
</ol>
<p>Modernize your enterprise systems with <a href="/services#web-development">Glovax Technologies Custom Software Engineering</a>.</p>`,
    faqs: [
      {
        question: "Why is it called the Strangler Fig pattern?",
        answer: "It is named after the biological Strangler Fig tree, which seeds in the upper branches of a host tree, gradually grows around it, and eventually replaces the host tree completely."
      }
    ]
  },
  {
    id: "building-enterprise-mvp-in-90-days-cto-playbook",
    title: "Building an Enterprise MVP in 90 Days: The Lean Engineering Playbook for CTOs",
    slug: "building-enterprise-mvp-in-90-days-cto-playbook",
    excerpt: "How technical founders and enterprise innovation labs build, test, and launch fully production-ready MVPs in under 3 months without technical debt.",
    author: "Glovax Product Leadership",
    category: "Custom Software",
    tags: ["MVP", "Startup", "Product Development", "CTO Playbook", "Agile"],
    publishedAt: "2026-08-15",
    readTime: 8,
    featured: false,
    featuredImage: "/images/glovax-og.png",
    featuredImageAlt: "Enterprise 90-Day MVP Lean Engineering Roadmap",
    seoTitle: "Building an Enterprise MVP in 90 Days (CTO Playbook 2026)",
    metaDescription: "Launch your enterprise MVP in 90 days. The complete engineering roadmap for scoping features, selecting tech stacks, and shipping with speed and quality.",
    focusKeyword: "building enterprise MVP fast CTO playbook",
    secondaryKeywords: ["90 day MVP development roadmap", "lean software development for startups", "speed up product time to market", "CTO MVP tech stack"],
    canonicalUrl: "https://glovaxtechnologies.com/blog/building-enterprise-mvp-in-90-days-cto-playbook",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "Building an Enterprise MVP in 90 Days: CTO Playbook",
    ogDescription: "How to ship a high-quality, scalable Minimum Viable Product in 3 months to validate market demand and secure investor funding.",
    ogImage: "/images/glovax-og.png",
    ogImageAlt: "Enterprise MVP Playbook",
    twitterTitle: "Building an Enterprise MVP in 90 Days",
    twitterDescription: "Ship your minimum viable product in 90 days with our battle-tested engineering playbook.",
    twitterImage: "/images/glovax-og.png",
    status: "published",
    content: `<h2>The Trap of Over-Engineering the MVP</h2>
<p>Too many technical founders spend six months engineering multi-region Kubernetes clusters and complex event buses before validating whether customers actually want their product. A high-impact <strong>Minimum Viable Product (MVP)</strong> balances development speed with production-grade architectural foundations.</p>

<h2>The 90-Day Sprint Roadmap</h2>
<ul>
  <li><strong>Days 1–14 (Scope & Wireframing):</strong> Ruthlessly cutting non-core features to isolate the single highest-value user workflow.</li>
  <li><strong>Days 15–60 (Rapid Full-Stack Build):</strong> Leveraging battle-tested boilerplate stacks (Next.js 16 + TypeScript + Drizzle ORM + Tailwind CSS + Auth0/Clerk).</li>
  <li><strong>Days 61–75 (End-to-End QA & Security):</strong> Penetration testing, automated smoke tests, and payment checkout verification.</li>
  <li><strong>Days 76–90 (Beta Launch & Analytics):</strong> Deploying to production with PostHog analytics and onboarding early design partners.</li>
</ul>
<p>Launch your product in record time with <a href="/services#web-development">Glovax Technologies MVP Acceleration Services</a>.</p>`,
    faqs: [
      {
        question: "How do you avoid creating massive technical debt during rapid MVP builds?",
        answer: "By enforcing TypeScript strict mode, clean modular directory structures, and using standard relational SQL databases that scale effortlessly when product-market fit is achieved."
      }
    ]
  },
  {
    id: "managing-technical-debt-in-rapidly-scaling-engineering-teams",
    title: "Managing Technical Debt: How High-Growth Engineering Teams Maintain 10x Velocity",
    slug: "managing-technical-debt-in-rapidly-scaling-engineering-teams",
    excerpt: "A practical framework for managing tech debt: the 20% engineering budget rule, technical debt scoring matrices, and preventing codebase bankruptcy.",
    author: "Glovax Engineering Leadership",
    category: "Custom Software",
    tags: ["Technical Debt", "Engineering Leadership", "Refactoring", "Code Quality", "DevOps"],
    publishedAt: "2026-08-05",
    readTime: 8,
    featured: false,
    featuredImage: "/images/glovax-og.png",
    featuredImageAlt: "Technical Debt Scoring Matrix and Sprint Allocation Framework",
    seoTitle: "Managing Technical Debt in Scaling Teams (2026 Guide)",
    metaDescription: "Master technical debt management. Learn the 20% sprint allocation rule, tech debt scoring matrices, and maintaining developer velocity at scale.",
    focusKeyword: "technical debt management software engineering",
    secondaryKeywords: ["how to pay down tech debt", "engineering velocity optimization", "technical debt ROI calculation", "refactoring vs feature development"],
    canonicalUrl: "https://glovaxtechnologies.com/blog/managing-technical-debt-in-rapidly-scaling-engineering-teams",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "Managing Technical Debt in Scaling Engineering Teams",
    ogDescription: "How engineering leaders balance new feature velocity with codebase health to prevent developer burnout and slowdowns.",
    ogImage: "/images/glovax-og.png",
    ogImageAlt: "Managing Technical Debt",
    twitterTitle: "Managing Technical Debt in Engineering Teams",
    twitterDescription: "Maintain high development velocity without succumbing to technical debt bankruptcy.",
    twitterImage: "/images/glovax-og.png",
    status: "published",
    content: `<h2>The Compounding Interest of Unchecked Technical Debt</h2>
<p>Just like financial debt, taking on technical shortcuts can be a rational strategic choice to hit an urgent product deadline. However, failing to service the interest causes feature velocity to plummet, bug counts to soar, and senior developers to burn out. High-performing engineering organizations manage debt systematically.</p>

<h2>The 20% Continuous Refactoring Rule</h2>
<p>Allocate a mandatory 20% of every two-week sprint capacity exclusively to technical debt remediation, dependency upgrades, automated test coverage expansion, and performance tuning. This keeps the codebase nimble without halting the product roadmap.</p>
<p>Audit and refactor your engineering systems with <a href="/services#web-development">Glovax Technologies Custom Software Engineering</a>.</p>`,
    faqs: [
      {
        question: "How do you justify technical debt refactoring to non-technical executives?",
        answer: "Frame tech debt in terms of business impact: calculate how much faster new revenue-generating features will ship once core abstractions and testing pipelines are modernized."
      }
    ]
  },
  {
    id: "selecting-software-development-partner-vetting-guide",
    title: "How to Choose a Software Development Partner: The 2026 Technical Vetting Guide",
    slug: "selecting-software-development-partner-vetting-guide",
    excerpt: "How to evaluate and hire custom software agencies: technical code audits, agile communication models, IP ownership contracts, and avoiding offshore traps.",
    author: "Glovax Executive Team",
    category: "Custom Software",
    tags: ["Software Agency", "Hiring", "Vendor Vetting", "Outsourcing", "CTO"],
    publishedAt: "2026-07-28",
    readTime: 8,
    featured: false,
    featuredImage: "/images/glovax-og.png",
    featuredImageAlt: "Software Development Partner Technical Vetting Checklist",
    seoTitle: "How to Choose a Software Development Partner (2026 Guide)",
    metaDescription: "Learn how to vet and select the right software development agency. Review technical vetting checklists, IP ownership clauses, and fixed-price vs sprint models.",
    focusKeyword: "hire software development agency partner",
    secondaryKeywords: ["vetting custom software agency", "software outsourcing checklist", "choose web development company", "enterprise software vendor selection"],
    canonicalUrl: "https://glovaxtechnologies.com/blog/selecting-software-development-partner-vetting-guide",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "How to Choose a Software Development Partner (2026)",
    ogDescription: "An executive evaluation framework for selecting a dedicated software engineering partner that delivers real business results.",
    ogImage: "/images/glovax-og.png",
    ogImageAlt: "Software Partner Vetting",
    twitterTitle: "How to Choose a Software Development Partner",
    twitterDescription: "Avoid costly agency mistakes with our comprehensive technical vetting and vendor evaluation guide.",
    twitterImage: "/images/glovax-og.png",
    status: "published",
    content: `<h2>The High Cost of Choosing the Wrong Development Vendor</h2>
<p>Hiring a low-bid agency that writes unmaintainable, spaghetti code ends up costing 3x more when the entire project has to be scrapped and rebuilt. Choosing the right <strong>Software Engineering Partner</strong> requires evaluating architectural acumen, transparency, and product intuition.</p>

<h2>The 5-Point Agency Vetting Criteria</h2>
<ol>
  <li><strong>Technical Code & Repository Audits:</strong> Request live code samples or public GitHub repositories to evaluate automated test coverage and TypeScript quality.</li>
  <li><strong>Direct Access to Senior Engineers:</strong> Ensure your team communicates directly with lead architects via Slack, not through layers of non-technical account managers.</li>
  <li><strong>100% Intellectual Property (IP) Ownership:</strong> Clear contractual guarantees assigning all source code, design assets, and database schemas directly to your company upon payment.</li>
</ol>
<p>Discover how <a href="/about">Glovax Technologies</a> partners with ambitious startups and enterprises to build mission-critical digital products. <a href="/contact">Book a consultation today</a>.</p>`,
    faqs: [
      {
        question: "What contract model is best when working with a software agency?",
        answer: "Agile Time & Materials (T&M) sprints with clearly defined bi-weekly milestone deliverables provide the optimal balance of flexibility, quality, and budget predictability."
      }
    ]
  },
  {
    id: "enterprise-api-gateway-architecture-and-governance",
    title: "Enterprise API Gateway Architecture: Kong, Envoy, AWS API Gateway & GraphQL Federation",
    slug: "enterprise-api-gateway-architecture-and-governance",
    excerpt: "Architect a resilient enterprise API gateway layer: centralized authentication, global rate limiting, schema validation, and Canary traffic management.",
    author: "Glovax Architecture Group",
    category: "Custom Software",
    tags: ["API Gateway", "Kong", "Envoy", "AWS", "Backend Architecture"],
    publishedAt: "2026-07-15",
    readTime: 8,
    featured: false,
    featuredImage: "/images/glovax-og.png",
    featuredImageAlt: "Enterprise API Gateway Architecture with Kong, Envoy, and Centralized Auth",
    seoTitle: "Enterprise API Gateway Architecture & Governance (2026)",
    metaDescription: "Master enterprise API gateway architecture. Learn Kong vs Envoy, centralized OAuth/JWT authentication, distributed rate limiting, and traffic routing.",
    focusKeyword: "enterprise API gateway architecture",
    secondaryKeywords: ["Kong API gateway tutorial", "Envoy proxy service mesh", "centralized API authentication", "API gateway governance best practices"],
    canonicalUrl: "https://glovaxtechnologies.com/blog/enterprise-api-gateway-architecture-and-governance",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "Enterprise API Gateway Architecture & Governance",
    ogDescription: "How to engineer a high-throughput, secure API gateway layer for managing hundreds of internal and external microservice endpoints.",
    ogImage: "/images/glovax-og.png",
    ogImageAlt: "API Gateway Architecture",
    twitterTitle: "Enterprise API Gateway Architecture",
    twitterDescription: "Centralize authentication, rate limiting, and observability with modern API gateway patterns.",
    twitterImage: "/images/glovax-og.png",
    status: "published",
    content: `<h2>The Critical Role of the API Gateway</h2>
<p>In modern microservice and distributed systems architectures, the <strong>API Gateway</strong> serves as the single secure entry point for all external client traffic. It decouples client applications from internal service topologies while centralizing cross-cutting concerns.</p>

<h2>Core API Gateway Responsibilities</h2>
<ul>
  <li><strong>Centralized Authentication & JWT Verification:</strong> Offloading TLS termination and token authentication at the perimeter so internal services operate securely.</li>
  <li><strong>Distributed Rate Limiting & Throttling:</strong> Protecting downstream microservices from traffic surges and denial-of-service attempts.</li>
  <li><strong>Canary & Blue-Green Traffic Splitting:</strong> Gradually routing 5% of traffic to new service versions to verify performance before full rollout.</li>
</ul>
<p>Architect robust enterprise API layers with <a href="/services#cloud-devops">Glovax Technologies Backend Services</a>.</p>`,
    faqs: [
      {
        question: "What is the difference between an API Gateway and a Service Mesh?",
        answer: "An API Gateway manages North-South traffic (external clients to internal services), while a Service Mesh manages East-West traffic (service-to-service communication within the cluster)."
      }
    ]
  }
];
