import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import {
  getServices,
  getFeaturedPortfolioItems,
  getTestimonials,
  getSiteContent,
  getSiteContentUpdatedAt,
} from "@/lib/data";
import { clientLogos as fallbackClientLogos } from "@/lib/constants";

// Dynamically import below-the-fold sections to code-split framer-motion
// and reduce initial JS payload by ~124 KiB
const ClientMarquee = dynamic(
  () => import("@/components/sections/ClientMarquee").then((mod) => ({ default: mod.ClientMarquee })),
  { ssr: true }
);
const ServicesGrid = dynamic(
  () => import("@/components/sections/ServicesGrid").then((mod) => ({ default: mod.ServicesGrid })),
  { ssr: true }
);
const WorkShowcase = dynamic(
  () => import("@/components/sections/WorkShowcase").then((mod) => ({ default: mod.WorkShowcase })),
  { ssr: true }
);
const ProcessSteps = dynamic(
  () => import("@/components/sections/ProcessSteps").then((mod) => ({ default: mod.ProcessSteps })),
  { ssr: true }
);
const StatsCounter = dynamic(
  () => import("@/components/sections/StatsCounter").then((mod) => ({ default: mod.StatsCounter })),
  { ssr: true }
);
const Testimonials = dynamic(
  () => import("@/components/sections/Testimonials").then((mod) => ({ default: mod.Testimonials })),
  { ssr: true }
);
const CTABanner = dynamic(
  () => import("@/components/sections/CTABanner").then((mod) => ({ default: mod.CTABanner })),
  { ssr: true }
);

export const revalidate = 60;

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description:
    "Glovax Technologies is a world-class software house and digital agency delivering AI-powered web development, mobile apps, cloud solutions, and digital marketing.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
  },
};

export default async function Home() {
  const services = await getServices();
  const featuredPortfolio = await getFeaturedPortfolioItems();
  const testimonials = await getTestimonials();
  const cta = await getSiteContent<{
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    buttons: { label: string; href: string; variant: "primary" | "outline" | "ghost" }[];
  }>("cta_banner");
  const lastUpdated = await getSiteContentUpdatedAt("cta_banner");
  const clientLogos = await getSiteContent<string[]>("client_logos");
  const processSteps = await getSiteContent<{ number: string; title: string; description: string; icon: string }[]>("process_steps");
  const stats = await getSiteContent<{ value: number; suffix: string; label: string }[]>("stats");

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ClientMarquee clientLogos={clientLogos ?? fallbackClientLogos} />
        <ServicesGrid services={services} />
        <WorkShowcase projects={featuredPortfolio} />
        <ProcessSteps steps={processSteps ?? undefined} />
        <StatsCounter stats={stats ?? undefined} />
        <Testimonials testimonials={testimonials} />
        <CTABanner cta={cta ?? undefined} lastUpdated={lastUpdated} />
      </main>
      <Footer />
    </>
  );
}
