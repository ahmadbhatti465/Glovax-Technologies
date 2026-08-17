import type { Metadata } from "next";
import dynamic from "next/dynamic";
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
// Dynamically import below-the-fold sections to code-split framer-motion
// and reduce initial JS payload by ~124 KiB
const TrustBar = dynamic(
  () => import("@/components/sections/TrustBar").then((mod) => ({ default: mod.TrustBar })),
  { ssr: true }
);
const WhyGlovax = dynamic(
  () => import("@/components/sections/WhyGlovax").then((mod) => ({ default: mod.WhyGlovax })),
  { ssr: true }
);
const Pricing = dynamic(
  () => import("@/components/sections/Pricing").then((mod) => ({ default: mod.Pricing })),
  { ssr: true }
);
const FAQ = dynamic(
  () => import("@/components/sections/FAQ").then((mod) => ({ default: mod.FAQ })),
  { ssr: true }
);
const TrustSection = dynamic(
  () => import("@/components/sections/TrustSection").then((mod) => ({ default: mod.TrustSection })),
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
const BlogHighlights = dynamic(
  () => import("@/components/sections/BlogHighlights").then((mod) => ({ default: mod.BlogHighlights })),
  { ssr: true }
);

export const revalidate = 60;

export const metadata: Metadata = {
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
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <FAQJsonLD items={homeFaqs} />
      <main>
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
