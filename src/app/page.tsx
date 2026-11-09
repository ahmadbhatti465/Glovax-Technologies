import type { Metadata } from "next";
import { siteConfig, ogImage } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FAQJsonLD } from "@/components/shared/StructuredData";
import { homeFaqs } from "@/data/faqs";
import {
  getServices,
  getFeaturedPortfolioItems,
  getTestimonials,
  getSiteContent,
  getSiteContentUpdatedAt,
  getBlogPosts,
} from "@/lib/data";
import { TrustBar } from "@/components/sections/TrustBar";
import { WhyGlovax } from "@/components/sections/WhyGlovax";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { TrustSection } from "@/components/sections/TrustSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WorkShowcase } from "@/components/sections/WorkShowcase";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import { BlogHighlights } from "@/components/sections/BlogHighlights";

export const revalidate = 60;

export const metadata: Metadata = {
  description:
    "Glovax Technologies is a software house delivering AI-powered web development, mobile apps, cloud solutions, and digital marketing.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    images: [ogImage],
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
  const processSteps = await getSiteContent<{ number: string; title: string; description: string; icon: string }[]>("process_steps");
  const stats = await getSiteContent<{ value: number; suffix: string; label: string }[]>("stats");
  const allPosts = await getBlogPosts();
  // Copy before sorting — getBlogPosts is React-cached, so we must not
  // mutate the shared array in place.
  const latestPosts = [...allPosts]
    .filter((p) => p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 6);

  return (
    <>
      <Navbar />
      <FAQJsonLD items={homeFaqs} />
      <main id="main-content" tabIndex={-1} className="outline-none defer-sections">
        <HeroSection />
        <TrustBar />
        <ServicesGrid services={services} />
        <WhyGlovax />
        <WorkShowcase projects={featuredPortfolio} />
        <ProcessSteps steps={processSteps ?? undefined} />
        <StatsCounter stats={stats ?? undefined} />
        <Pricing />
        <Testimonials testimonials={testimonials} />
        <BlogHighlights posts={latestPosts} />
        <FAQ />
        <TrustSection />
        <CTABanner cta={cta ?? undefined} lastUpdated={lastUpdated} />
      </main>
      <Footer />
    </>
  );
}
