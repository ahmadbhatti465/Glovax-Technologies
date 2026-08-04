import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import DirectoryContent from "@/components/directory/DirectoryContent";
import { getBusinesses } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Business Directory",
  description:
    "Browse the businesses Glovax Technologies has helped get online — e-commerce stores, travel platforms, consultancies, and local services across the world.",
  keywords: [
    "business directory",
    "local business directory",
    "e-commerce stores",
    "online businesses",
    "Glovax directory",
    "trusted businesses",
    "find local businesses",
    "digital agency portfolio",
  ],
  alternates: {
    canonical: `${siteConfig.url}/directory`,
  },
  openGraph: {
    url: `${siteConfig.url}/directory`,
    title: `Business Directory | ${siteConfig.name}`,
    description:
      "Discover the businesses and services we've helped bring online — from e-commerce stores to cloud consultancies.",
    type: "website",
  },
};

export default async function DirectoryPage() {
  const businesses = await getBusinesses();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Directory", url: `${siteConfig.url}/directory` },
        ]}
      />
      <DirectoryContent businesses={businesses} />
    </>
  );
}
