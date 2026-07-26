import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ClientMarquee } from "@/components/sections/ClientMarquee";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WorkShowcase } from "@/components/sections/WorkShowcase";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import {
  getServices,
  getFeaturedPortfolioItems,
  getTestimonials,
  getSiteContent,
  getSiteContentUpdatedAt,
} from "@/lib/data";
import { clientLogos as fallbackClientLogos } from "@/lib/constants";

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
