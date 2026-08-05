import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBusinessBySlug } from "@/lib/data";
import { businesses as businessesTable } from "@/db/schema";
import { db } from "@/db";
import { siteConfig } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-static";

export async function generateStaticParams() {
  try {
    const rows = await db.select().from(businessesTable);
    return rows.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) {
    return {
      title: "Listing Not Found",
      description:
        "The directory listing you're looking for doesn't exist or has been removed.",
      robots: { index: false, follow: false },
    };
  }

  const url = `${siteConfig.url}/directory/${business.slug}`;

  return {
    title: business.name,
    description: business.shortDescription.slice(0, 160),
    keywords: [business.category, ...business.tags],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${business.name} | ${siteConfig.name} Directory`,
      description: business.shortDescription,
      images: business.image ? [{ url: `${siteConfig.url}${business.image}` }] : undefined,
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  const url = `${siteConfig.url}/directory/${business.slug}`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    url,
    telephone: business.phone || undefined,
    address: business.address
      ? {
          "@type": "PostalAddress",
          streetAddress: business.address,
          addressLocality: business.city,
          addressCountry: business.country,
        }
      : {
          "@type": "PostalAddress",
          addressLocality: business.city,
          addressCountry: business.country,
        },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
    },
    ...(business.website ? { sameAs: [business.website] } : {}),
    ...(business.isRemote ? { areaServed: "Worldwide" } : {}),
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <Breadcrumbs
            items={[
              { label: "Directory", href: "/directory" },
              { label: business.name },
            ]}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
          />
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: siteConfig.url },
              { name: "Directory", url: `${siteConfig.url}/directory` },
              { name: business.name, url },
            ]}
          />

          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mt-8 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="px-3 py-1 text-xs font-medium bg-surface-raised border border-neutral-border rounded-full text-muted-foreground">
              {business.category}
            </span>
            {business.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-teal text-accent-foreground rounded-full">
                <BadgeCheck className="w-3 h-3" /> Featured
              </span>
            )}
            {business.isRemote && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium border border-teal/40 text-teal rounded-full">
                <Globe className="w-3 h-3" /> Remote / Online
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            {business.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-semibold text-foreground">{business.rating.toFixed(1)}</span>
              <span>
                ({business.reviewCount} {business.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {business.city}, {business.country}
            </span>
          </div>

          <div className="w-24 h-px bg-gradient-to-r from-teal to-transparent my-8" />

          <p className="text-lg text-muted leading-relaxed mb-8">
            {business.description}
          </p>

          {business.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {business.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full bg-surface border border-neutral-border text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Contact + hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-surface-raised border border-neutral-border">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Contact
              </h2>
              <ul className="space-y-3.5 text-sm">
                {business.address && (
                  <li className="flex items-start gap-3 text-foreground/90">
                    <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    {business.address}, {business.city}
                  </li>
                )}
                {business.phone && (
                  <li className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <a
                      href={`tel:${business.phone}`}
                      className="text-accent hover:text-accent-hover transition-colors"
                    >
                      {business.phone}
                    </a>
                  </li>
                )}
                {business.website ? (
                  <li className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:text-accent-hover transition-colors"
                    >
                      Visit Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                ) : (
                  <li className="flex items-start gap-3 text-muted">
                    <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {business.isRemote ? "Serving customers online" : "Website coming soon"}
                  </li>
                )}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-surface-raised border border-neutral-border">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Opening Hours
              </h2>
              <ul className="space-y-3 text-sm">
                {business.hours.map((slot) => (
                  <li
                    key={slot.day}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="inline-flex items-center gap-2 text-foreground/90">
                      <Clock className="w-4 h-4 text-accent" />
                      {slot.day}
                    </span>
                    <span className={slot.hours === "Closed" ? "text-muted" : "text-foreground/80"}>
                      {slot.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA panel */}
          <div className="p-8 md:p-10 rounded-3xl bg-surface border border-neutral-border text-center relative overflow-hidden">
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full opacity-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, var(--teal) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                Want a site like this for your business?
              </h2>
              <p className="text-muted mb-8 max-w-md mx-auto">
                We build fast, conversion-focused websites and platforms — and
                can list your business here too. We respond within 24 hours.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <MagneticButton href="/contact" variant="primary" size="lg">
                  Start a Project
                </MagneticButton>
                <MagneticButton href="/contact" variant="outline" size="lg">
                  Book a Call
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
