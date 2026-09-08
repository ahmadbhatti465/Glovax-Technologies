export interface FAQ {
  question: string;
  answer: string;
}

// Homepage FAQ — also emitted as FAQPage JSON-LD for rich results + AI answer engines.
export const homeFaqs: FAQ[] = [
  {
    question: "How does Glovax Technologies build production RAG systems without hallucinations?",
    answer:
      "We implement hybrid search (dense vector embeddings + sparse BM25 keyword retrieval) combined with Cohere re-ranking models and strict prompt guardrails. This forces your AI application to strictly answer from verified corporate documents with direct source citations.",
  },
  {
    question: "Should my startup choose Next.js or a traditional MERN stack?",
    answer:
      "Next.js is recommended for public web applications, SaaS platforms, and e-commerce where SEO, Generative AI indexing (GEO), and sub-1.5s Largest Contentful Paint (LCP) matter. Traditional MERN SPAs are best reserved for internal, authenticated dashboards.",
  },
  {
    question: "Why is FastAPI our preferred backend for AI and Machine Learning systems?",
    answer:
      "FastAPI delivers asynchronous Python performance on par with NodeJS and Go. With native asyncio support and Pydantic data validation, it processes streaming LLM responses and ML inference pipelines with sub-millisecond serialization overhead.",
  },
  {
    question: "Do you work with clients in the UK and US?",
    answer:
      "Yes, the majority of our clients are startups and SMEs in the UK and US. We provide 4 to 6 hours of daily working overlap with London (GMT) and New York (EST) to ensure seamless communication and rapid iteration.",
  },
  {
    question: "How long does it take to build and deploy an MVP?",
    answer:
      "A production-ready MVP typically ships in 3 to 6 weeks. Larger custom platforms take 8 to 14 weeks. We work in agile 1-week sprints with transparent demos, continuous staging deployments, and clear milestone deliverables.",
  },
  {
    question: "How do payments work and will you sign an NDA?",
    answer:
      "Yes, we sign comprehensive mutual NDAs before reviewing proprietary specs. Payments are structured via milestone-based escrow on Upwork or direct commercial invoicing with 100% intellectual property ownership transferred to you upon delivery.",
  },
];

