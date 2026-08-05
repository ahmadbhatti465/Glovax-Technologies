import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/constants";
import { Toaster } from "sonner";
import { StructuredData } from "@/components/shared/StructuredData";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { BackToTop } from "@/components/layout/BackToTop";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08110F" },
    { media: "(prefers-color-scheme: light)", color: "#08110F" },
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
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@glovaxtech",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@glovaxtech",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jakarta.variable} ${inter.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ScrollProgress />
        <CursorGlow />
        <StructuredData />
        {children}
        <BackToTop />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface-raised)",
              color: "var(--foreground)",
              border: "1px solid var(--border-default)",
            },
          }}
        />
      </body>
    </html>
  );
}
