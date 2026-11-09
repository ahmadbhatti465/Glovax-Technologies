import type { Metadata, Viewport } from "next";
import { getHiddenNavHrefs } from "@/lib/data";
import { SiteVisibilityProvider } from "@/components/layout/SiteVisibility";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig, ogImage } from "@/lib/constants";
import { StructuredData } from "@/components/shared/StructuredData";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";

// One variable font file serves every weight for both headings and body text;
// omitting `weight` makes next/font ship the variable file instead of statics.
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  // Mono only appears in small eyebrow labels and kbd hints — don't block
  // the initial render on it.
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030303" },
    { media: "(prefers-color-scheme: light)", color: "#030303" },
  ],
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "software house",
    "digital agency",
    "web development company",
    "mobile app development",
    "AI solutions",
    "machine learning development",
    "cloud services",
    "DevOps consulting",
    "digital marketing agency",
    "SEO services",
    "SaaS development",
    "custom software development",
    "software house Pakistan",
    "software house Lahore",
    "hire developers",
    "remote development team",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  category: "technology",
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [ogImage],
  },
  // Title, description and image fall back to each page's Open Graph values.
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  },
};

// Keeps the navigation current on pages that have no timer of their own, for
// example when a scheduled post makes the blog live.
export const revalidate = 3600;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} dark`}>
      <body
        className="font-body antialiased bg-background text-foreground min-h-screen"
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ScrollProgress />
        <StructuredData />
        <SiteVisibilityProvider hiddenHrefs={await getHiddenNavHrefs()}>
          {children}
        </SiteVisibilityProvider>
        <BackToTop />
      </body>
    </html>
  );
}
