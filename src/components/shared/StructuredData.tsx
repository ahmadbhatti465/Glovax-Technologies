import { siteConfig } from "@/lib/constants";
import type { Service, PortfolioItem, TeamMember, JobPosition, BlogPost } from "@/types";

interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteConfig.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function StructuredData() {
  const orgData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.ogImage),
    image: absoluteUrl(siteConfig.ogImage),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: "31 K, DHA Phase 5",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      postalCode: "54000",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.4808,
      longitude: 74.3758,
    },
    areaServed: "Worldwide",
    knowsAbout: [
      "Web Development",
      "Mobile App Development",
      "Artificial Intelligence",
      "Machine Learning",
      "Cloud Computing",
      "DevOps",
      "UI/UX Design",
      "Digital Marketing",
      "Search Engine Optimization",
      "SaaS Development",
    ],
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.instagram,
      siteConfig.social.upwork,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.email,
      telephone: siteConfig.phone,
      availableLanguage: ["English"],
    },
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.ogImage),
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
}

export function HomeJsonLd() {
  return null;
}

export function FAQJsonLD({ items }: { items: FAQItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ServiceJsonLd({ services }: { services: Service[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        url: `${siteConfig.url}/services`,
        category: service.title,
        serviceType: service.title,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function CollectionPageJsonLd({
  items,
  name,
  url,
}: {
  items: PortfolioItem[];
  name: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
    description: "A curated portfolio of web, mobile, AI, and cloud projects delivered by Glovax Technologies.",
    hasPart: items.map((item) => ({
      "@type": "CreativeWork",
      name: item.title,
      description: item.description,
      url: item.link || `${siteConfig.url}/work#${item.id}`,
      image: item.image ? absoluteUrl(item.image) : undefined,
      about: item.category,
      keywords: item.technologies.join(", "),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function normalizeEmploymentType(type: string): string {
  const map: Record<string, string> = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    "Contract": "CONTRACTOR",
    "Internship": "INTERN",
  };
  return map[type] || "FULL_TIME";
}

export function JobPostingJsonLd({ positions }: { positions: JobPosition[] }) {
  const data = positions.map((position) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: position.title,
    description: position.description || `${position.title} at ${siteConfig.name}.`,
    datePosted: new Date().toISOString().slice(0, 10),
    employmentType: normalizeEmploymentType(position.type),
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
      logo: absoluteUrl(siteConfig.ogImage),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: position.location,
        addressCountry: "PK",
      },
    },
    jobLocationType: position.location.toLowerCase().includes("remote") ? "TELECOMMUTE" : "ONSITE",
    experienceRequirements: position.experience,
    responsibilities: position.responsibilities,
    qualifications: position.requirements,
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function TeamJsonLd({ members }: { members: TeamMember[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: members.map((member, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: member.name,
        jobTitle: member.role,
        description: member.bio,
        image: member.image ? absoluteUrl(member.image) : undefined,
        worksFor: {
          "@type": "Organization",
          name: siteConfig.name,
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({ post, url }: { post: BlogPost; url: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt?.toISOString() || post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.ogImage),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.tags.join(", "),
    image: [absoluteUrl(siteConfig.ogImage)],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function AboutPageJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${siteConfig.name}`,
    url: `${siteConfig.url}/about`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ContactPageJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${siteConfig.name}`,
    url: `${siteConfig.url}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
