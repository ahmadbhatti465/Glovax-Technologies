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

export const metadata: Metadata = {
  title: siteConfig.tagline,
  description: siteConfig.description,
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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ClientMarquee />
        <ServicesGrid />
        <WorkShowcase />
        <ProcessSteps />
        <StatsCounter />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
