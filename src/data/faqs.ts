export interface FAQ {
  question: string;
  answer: string;
}

// Homepage FAQ — also emitted as FAQPage JSON-LD for rich results + AI answer engines.
export const homeFaqs: FAQ[] = [
  {
    question: "Do you work with clients in the UK and US?",
    answer:
      "Yes — most of our clients are in the UK and US. We keep 6+ hours of overlap with London and Eastern US working hours, so meetings and reviews happen at times that suit you, not just us.",
  },
  {
    question: "How do we communicate during the project?",
    answer:
      "We use Slack or WhatsApp for day-to-day updates, Zoom for calls and demos, and share progress through a live board you can check any time. You'll get a weekly demo every step of the way — no black boxes.",
  },
  {
    question: "How do payments work, and is it secure?",
    answer:
      "We work on fixed milestones with clear deliverables — typically 30–50% upfront and the rest at agreed milestones. We invoice properly, and if you hire through Upwork, payments go through Upwork's escrow for extra protection.",
  },
  {
    question: "Will you sign an NDA?",
    answer:
      "Absolutely. We'll sign your NDA (or provide ours) before we discuss your idea in detail. Your source code and IP always remain yours — we only ever build what you approve.",
  },
  {
    question: "What happens after launch?",
    answer:
      "Every project includes a support window after launch, and we offer extended support plans. We monitor, fix issues, and help you iterate — we don't disappear once the site is live.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "An MVP can ship in 2–4 weeks. A full SaaS or web product typically takes 8–16 weeks depending on scope and integrations. We'll give you a precise timeline in the proposal after a free scoping call.",
  },
];
