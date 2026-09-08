import type { Metadata } from "next";
import { siteConfig, ogImage } from "@/lib/constants";
import {
  BreadcrumbJsonLd,
  FAQJsonLD,
  ServiceJsonLd,
} from "@/components/shared/StructuredData";
import ServicesContent from "./services-content";
import { getServices, getLatestUpdatedAt } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Engineering Services: Next.js, AI RAG & FastAPI",
  description:
    "Glovax Technologies provides custom AI engineering, enterprise RAG systems, full-stack Next.js/MERN development, and scalable FastAPI Python backends for UK & US clients.",
  keywords: [
    "AI engineering services",
    "custom RAG development",
    "Next.js developers",
    "MERN stack development",
    "FastAPI backend development",
    "LangChain multi-agent systems",
    "Docker AWS deployment",
    "hire software developers UK",
    "hire software developers US",
  ],
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
  openGraph: {
    url: `${siteConfig.url}/services`,
    title: `Software & AI Development Services | ${siteConfig.name}`,
    description:
      "Enterprise Next.js web development, custom RAG systems, LangChain AI agents, and scalable cloud architecture.",
    type: "website",
    images: [ogImage],
  },
};

const faqs = [
  {
    question: "What is Retrieval-Augmented Generation (RAG) and how does it prevent LLM hallucinations?",
    answer:
      "Retrieval-Augmented Generation (RAG) is an AI architecture that retrieves proprietary company documents from vector databases (like Pinecone or Qdrant) before generating a response with an LLM. By grounding models like GPT-4 or Claude in real-time verified data, RAG eliminates factual hallucinations and ensures audit-compliant enterprise answers.",
  },
  {
    question: "When should a startup choose Next.js over a traditional MERN Single-Page App?",
    answer:
      "Startups should choose Next.js when organic search ranking (SEO), AI engine indexing (GEO), and fast initial page load (<1.8s LCP) are critical to growth. While traditional MERN SPAs render on the client, Next.js executes Server-Side Rendering (SSR) and static generation, delivering pre-rendered HTML that search engines and AI crawlers immediately index.",
  },
  {
    question: "Why is FastAPI the preferred backend for AI and Machine Learning applications?",
    answer:
      "FastAPI is an asynchronous Python web framework built on Starlette and Pydantic. It provides native asyncio concurrency, sub-millisecond serialization, and automatic OpenAPI documentation. This makes FastAPI 300% faster than traditional Flask or Django setups when streaming LLM responses and serving high-throughput machine learning inference pipelines.",
  },
  {
    question: "How do Multi-Agent AI systems operate in commercial software?",
    answer:
      "Multi-Agent AI systems deploy specialized autonomous agents—such as researchers, coders, and critics—that collaborate via orchestrators like LangChain or LangGraph. Each agent handles distinct sub-tasks, shares memory states, and cross-validates outputs, automating complex multi-step workflows with higher accuracy than single-prompt AI models.",
  },
  {
    question: "How long does it take Glovax Technologies to build and deploy a SaaS MVP?",
    answer:
      "Glovax Technologies builds and launches production-ready MVPs within 3 to 6 weeks. Our process utilizes reusable Next.js architectures, modular FastAPI services, pre-built authentication, and automated AWS/Docker deployment pipelines, saving startups 40% in initial development time and capital.",
  },
  {
    question: "Why do UK and US startups partner with Glovax Technologies for custom development?",
    answer:
      "UK and US companies hire Glovax Technologies to secure senior full-stack and AI/ML engineers with guaranteed GMT and EST time zone overlap. Clients receive Tier-1 technical execution, transparent Git-based workflows, and 50–60% cost efficiency compared to local agency retainers without compromising code quality.",
  },
  {
    question: "How does containerizing web applications with Docker and AWS improve reliability?",
    answer:
      "Containerizing applications with Docker standardizes development, staging, and production environments, eliminating host configuration drift. Deployed onto AWS ECS or EKS with automated CI/CD pipelines, your platform gains zero-downtime rolling updates, isolated microservices, and auto-scaling to absorb sudden traffic surges efficiently.",
  },
];

export default async function ServicesPage() {
  const services = await getServices();
  const lastUpdated = await getLatestUpdatedAt(["services"]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Services", url: `${siteConfig.url}/services` },
        ]}
      />
      <FAQJsonLD items={faqs} />
      <ServiceJsonLd services={services} />
      <ServicesContent services={services} faqs={faqs} lastUpdated={lastUpdated} />
    </>
  );
}
