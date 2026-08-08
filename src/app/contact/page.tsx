import type { Metadata } from "next";
import { siteConfig, ogImage } from "@/lib/constants";
import { BreadcrumbJsonLd, ContactPageJsonLd } from "@/components/shared/StructuredData";
import ContactContent from "./contact-content";

export const metadata: Metadata = {
  title: "Contact Us — Get a Quote",
  description:
    "Get in touch with Glovax Technologies. Request a quote, discuss your project, or learn how our software house can help grow your business.",
  keywords: [
    "contact software house",
    "hire developers",
    "request quote",
    "web development quote",
    "app development company contact",
    "Glovax Technologies contact",
    "digital agency contact",
  ],
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    url: `${siteConfig.url}/contact`,
    title: `Contact Us | ${siteConfig.name}`,
    description:
      "Have a project in mind? Reach out and we'll get back to you within 24 hours.",
    type: "website",
    images: [ogImage],
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Contact", url: `${siteConfig.url}/contact` },
        ]}
      />
      <ContactPageJsonLd />
      <ContactContent />
    </>
  );
}
