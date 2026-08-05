import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Glovax Technologies collects, uses, and protects your personal information. Our commitment to data privacy and security.",
  alternates: { canonical: `${siteConfig.url}/privacy` },
  openGraph: {
    url: `${siteConfig.url}/privacy`,
    title: `Privacy Policy | ${siteConfig.name}`,
    description:
      "How Glovax Technologies collects, uses, and protects your personal information.",
    type: "website",
  },
};

const sections = [
  {
    title: "Information we collect",
    body: "We collect information you provide directly to us — such as your name, email address, phone number, and project details when you contact us, book a call, or subscribe to our newsletter. We also collect limited, non-identifying analytics data about how visitors use our site to improve its performance and usability.",
  },
  {
    title: "How we use your information",
    body: "We use the information you provide to respond to enquiries, prepare project proposals, deliver services you have engaged us for, and send occasional updates if you have subscribed. We never sell, rent, or trade your personal information to third parties.",
  },
  {
    title: "Data retention",
    body: "We retain enquiry and project records only as long as needed to serve you and meet legal or accounting obligations. You may request deletion of your personal data at any time by emailing us, and we will honour the request within a reasonable timeframe.",
  },
  {
    title: "Data security",
    body: "We take reasonable technical and organisational measures to protect your information — including encrypted connections, restricted access to our systems, and signed confidentiality agreements with our team where appropriate.",
  },
  {
    title: "Cookies",
    body: "Our site may use essential cookies to keep the experience working, and limited analytics cookies to understand aggregate usage. You can control cookies through your browser settings at any time.",
  },
  {
    title: "Your rights",
    body: "Depending on your jurisdiction (including GDPR and UK GDPR), you may have rights to access, correct, or erase your personal data, and to object to or restrict certain processing. Contact us to exercise any of these rights.",
  },
  {
    title: "Contact us",
    body: `Questions about this policy? Email us at ${siteConfig.email} or write to ${siteConfig.name}, ${siteConfig.address}.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Privacy Policy", url: `${siteConfig.url}/privacy` },
        ]}
      />
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy" }]} />

          <div className="mt-6 mb-14">
            <p className="text-accent text-xs md:text-sm font-semibold tracking-[0.28em] uppercase mb-5">
              Legal
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.06]">
              Privacy Policy
            </h1>
            <p className="mt-5 text-muted leading-relaxed">
              Effective date: 1 August 2026. This policy explains what we collect and why, in plain language.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">
                  {section.title}
                </h2>
                <p className="text-muted leading-relaxed">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
