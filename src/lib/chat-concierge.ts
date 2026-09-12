import { siteConfig } from "@/lib/constants";

// The Glovax Chat Concierge: a fully local, no-API Q&A engine.
// Visitors type a query; we match it against this curated knowledge bank
// and return the best answer. No external calls, no data leaves the browser.

export interface ChatEntry {
  id: string;
  keywords: string[];
  answer: string;
}

const fmt = (tpl: string) =>
  tpl
    .replace("{calendar}", `${siteConfig.url}/contact`)
    .replace("{whatsapp}", siteConfig.social.whatsapp)
    .replace("{email}", siteConfig.email)
    .replace("{phone}", siteConfig.phone)
    .replace("{url}", siteConfig.url);

const CHAT_ENTRIES: ChatEntry[] = [
  {
    id: "services-overview",
    keywords: ["services", "what do you do", "offer", "help with", "capabilities"],
    answer:
      "We're a software house and AI/ML agency serving UK & US clients. We build: web apps & SaaS, mobile apps, AI/LLM features & RAG systems, cloud & DevOps, UI/UX design, and digital marketing. Tell me which one interests you — or book a free call: {calendar}",
  },
  {
    id: "web",
    keywords: ["web", "website", "saas", "frontend", "next", "react", "e-commerce", "ecommerce", "shop"],
    answer:
      "We build fast, conversion-focused web apps and SaaS with Next.js/React — e-commerce, dashboards, and custom platforms that load fast and rank well. Want a quick scope? Book a free call: {calendar}",
  },
  {
    id: "mobile",
    keywords: ["mobile", "app", "ios", "android", "react native", "play store"],
    answer:
      "We build cross-platform iOS & Android apps (React Native) with intuitive UX that drives retention. Happy to scope yours on a free call: {calendar}",
  },
  {
    id: "ai",
    keywords: ["ai", "ai services", "ai development", "ai apps", "ai app", "ml", "machine learning", "chatbot", "llm", "rag", "openai", "gpt", "assistant", "langchain", "mistral"],
    answer:
      "Yes — AI is our specialty. We build AI chatbots & assistants, RAG systems on your own documents, and custom LLM apps (OpenAI, Mistral, LangChain). This is exactly the kind of project we love. Let's talk: {calendar}",
  },
  {
    id: "cloud-devops",
    keywords: ["cloud", "devops", "aws", "deploy", "infrastructure", "kubernetes", "docker", "ci/cd", "hosting"],
    answer:
      "We handle AWS architecture, CI/CD pipelines, Docker/Kubernetes, and cost & security optimization. Book a free call to discuss your setup: {calendar}",
  },
  {
    id: "design",
    keywords: ["design", "ui", "ux", "wireframe", "prototype", "branding", "figma"],
    answer:
      "We do research-driven UI/UX design, design systems, and WCAG-accessible interfaces. Happy to share examples — or book a call: {calendar}",
  },
  {
    id: "pricing",
    keywords: ["cost", "price", "pricing", "how much", "quote", "budget", "expensive", "rate", "fee", "charge", "afford"],
    answer:
      "We work in three engagement models: an MVP Sprint (fixed quote, 2–4 weeks), Product Build (custom proposal, milestone billing), and AI & Team Aug (monthly retainer). No hidden costs — we scope precisely on a free 30-minute call: {calendar}",
  },
  {
    id: "process",
    keywords: ["process", "how do you work", "methodology", "steps", "agile", "sprint", "workflow"],
    answer:
      "A proven 4-step process: 1) Discover — we research your business, users, and goals; 2) Design — architecture + UI; 3) Develop — clean, scalable code in weekly sprints with live demos; 4) Deliver — deploy, monitor, and support. You see real progress every week.",
  },
  {
    id: "timezone",
    keywords: ["timezone", "time zone", "uk", "us", "london", "overseas", "remote", "different country", "abroad"],
    answer:
      "Yes — most of our clients are in the UK & US. We keep 6+ hours of overlap with London and Eastern US working hours, so meetings and reviews happen at times that suit you, not just us.",
  },
  {
    id: "communication",
    keywords: ["communicate", "communication", "slack", "whatsapp", "zoom", "updates", "meeting", "demo", "progress"],
    answer:
      "We use Slack or WhatsApp for day-to-day updates, Zoom for calls & demos, and a live board you can check any time. You get a weekly demo — no black boxes.",
  },
  {
    id: "payments",
    keywords: ["payment", "pay", "escrow", "upwork", "invoice", "milestone", "deposit", "money", "secure payment", "refund"],
    answer:
      "We work on fixed milestones with clear deliverables — typically 30–50% upfront, then at agreed milestones. We invoice properly, and if you hire through Upwork, payments go through Upwork's escrow for extra protection.",
  },
  {
    id: "nda",
    keywords: ["nda", "confidential", "non-disclosure", "sign"],
    answer:
      "Absolutely. We'll sign your NDA (ours or yours) before we discuss your idea in detail. Your source code and IP always remain yours — we only ever build what you approve.",
  },
  {
    id: "ip",
    keywords: ["ip", "intellectual property", "ownership", "source code", "who owns", "rights", "your code"],
    answer:
      "Your source code and IP are 100% yours from day one. Nothing is reused, resold, or retained after the project.",
  },
  {
    id: "timeline",
    keywords: ["timeline", "how long", "long does", "weeks", "months", "deadline", "when will", "estimate time"],
    answer:
      "An MVP can ship in 2–4 weeks. A full SaaS or web product typically takes 8–16 weeks depending on scope and integrations. You'll get a precise timeline in the proposal after a free scoping call: {calendar}",
  },
  {
    id: "support",
    keywords: ["support", "after launch", "maintenance", "post-launch", "warranty", "update", "ongoing", "iterate"],
    answer:
      "Every project includes a post-launch support window, plus optional extended support plans. We monitor, fix issues, and help you iterate — we don't disappear once it's live.",
  },
  {
    id: "booking",
    keywords: ["book", "call", "meeting", "schedule", "calendly", "appointment", "talk", "discuss", "consult", "call with"],
    answer:
      "You can book a free 30-minute call right here: {calendar}. Or message us on WhatsApp: {whatsapp} — we reply within 24 hours.",
  },
  {
    id: "contact",
    keywords: ["contact", "email", "phone", "reach", "get in touch", "number", "whatsapp"],
    answer:
      "You can reach us at {email}, call/text {phone}, or chat on WhatsApp: {whatsapp}. Prefer to talk? Book a free call: {calendar}",
  },
  {
    id: "team",
    keywords: ["team", "who", "founder", "ahmad", "experience", "developers", "engineers", "staff"],
    answer:
      "Glovax is founder-led by Muhammad Ahmad, a full-stack & AI/ML engineer with 5+ years of experience building for UK/US clients. You talk directly to the senior engineer on your project — no account-manager middlemen.",
  },
  {
    id: "location",
    keywords: ["location", "where", "pakistan", "lahore", "based", "office", "address", "country"],
    answer:
      "We're based in Lahore, Pakistan (31 K, DHA Phase 5) and work remote-first with UK & US clients. Timezone overlap and clear communication are built into how we work.",
  },
  {
    id: "tech",
    keywords: ["tech", "stack", "technology", "react", "python", "node", "docker", "aws", "postgres", "typescript", "stack do you"],
    answer:
      "We ship with React, Next.js, TypeScript, Node.js, Python, FastAPI, LangChain, OpenAI, AWS, Docker, and PostgreSQL — the exact stack depends on your project.",
  },
  {
    id: "trust",
    keywords: ["trust", "secure", "security", "safe", "reliable", "scam", "legit", "fraud", "worried", "risk"],
    answer:
      "Fair question! We protect clients with: NDAs on request, 100% IP ownership, private repos & secure code handling, milestone payments (escrow via Upwork available), and a 24-hour response promise. Book a free call and judge for yourself: {calendar}",
  },
  {
    id: "careers",
    keywords: ["career", "job", "hiring", "work for", "vacancy", "apply", "join"],
    answer: "We're always interested in great engineers and designers. See open roles at {url}/career",
  },
];

const GREETING_KEYWORDS = ["hi", "hello", "hey", "salam", "assalam", "good morning", "good afternoon", "good evening", "hola"];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findEmail(raw: string): string | null {
  const match = raw.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  return match ? match[0] : null;
}

export function getChatAnswer(raw: string): { text: string; id: string } {
  const msg = normalize(raw);
  if (!msg) return { text: fmt(fallbackAnswer), id: "fallback" };

  if (GREETING_KEYWORDS.some((g) => msg === normalize(g) || msg.startsWith(normalize(g) + " "))) {
    return { text: fmt(greetingAnswer), id: "greeting" };
  }

  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  let best: ChatEntry | null = null;
  let bestScore = 0;
  for (const entry of CHAT_ENTRIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      const nk = normalize(kw);
      if (!nk) continue;
      // Word-boundary match (so "ai" doesn't hit inside "detail"), allowing a
      // trailing plural so "payments" still matches "payment".
      const re = new RegExp(`\\b${escapeRegex(nk)}(?:es|s)?\\b`);
      if (re.test(msg)) score += nk.split(" ").length; // longer, more specific keywords weigh more
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore > 0) {
    return { text: fmt(best.answer), id: best.id };
  }
  return { text: fmt(fallbackAnswer), id: "fallback" };
}

const greetingAnswer =
  "Hi there! 👋 Welcome to Glovax Technologies. I can answer questions about our services, pricing, process, NDAs, and more — or book you a free 30-minute call. What would you like to know?";

const fallbackAnswer =
  "I'm not sure I caught that. I can help with: pricing & costs, services, the process, NDAs & IP, payments, and booking a free call. Try one of the quick options below, email us directly at {email}, or book a call: {calendar}";

export const QUICK_REPLIES = [
  { label: "Pricing", message: "How much does a project cost?" },
  { label: "Book a call", message: "I'd like to book a free call" },
  { label: "Email & Contact", message: "How can I contact or email you?" },
  { label: "NDAs", message: "Will you sign an NDA?" },
  { label: "Your process", message: "How do you work?" },
];
