import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern the use of Glovax Technologies' website and the engagement of our services.",
  alternates: { canonical: `${siteConfig.url}/terms` },
  openGraph: {
    url: `${siteConfig.url}/terms`,
    title: `Terms of Service | ${siteConfig.name}`,
    description: "The terms that govern the use of our website and services.",
    type: "website",
  },
};

const sections = [
  {
    title: "1. Agreement to terms",
    body: "By accessing this website or engaging Glovax Technologies for services, you agree to these Terms of Service and to comply with all applicable laws. If you do not agree, please do not use the site or our services.",
  },
  {
    title: "2. Our services",
    body: "We provide software development, design, AI, cloud, and digital marketing services. Each engagement is governed by a separate written proposal or statement of work that defines scope, milestones, fees, and deliverables — this page does not replace those agreements.",
  },
  {
    title: "3. Intellectual property",
    body: "Unless otherwise agreed in writing, all work product we create for you — including source code, designs, and documentation — is transferred to you upon full payment. We retain the right to display completed work in our portfolio unless a confidentiality agreement states otherwise.",
  },
  {
    title: "4. Payment terms",
    body: "Fees are agreed per proposal and billed on agreed milestones (typically 30–50% to start). Work begins after the initial payment. Late payments may pause work until settled. Where you engage us through a platform such as Upwork, that platform's escrow terms apply.",
  },
  {
    title: "5. Confidentiality",
    body: "We treat your business information as confidential and will sign an NDA on request. Each party agrees not to disclose the other's confidential information without prior written consent, except where required by law.",
  },
  {
    title: "6. Warranties & limitations",
    body: "We deliver work to the scope agreed in your proposal and exercise reasonable professional care. To the fullest extent permitted by law, we are not liable for indirect or consequential damages arising from use of our services or this website.",
  },
  {
    title: "7. Changes to these terms",
    body: "We may update these Terms of Service from time to time. Material changes will be reflected by an updated effective date at the top of this page. Continued use of the site after changes constitutes acceptance.",
  },
  {
    title: "8. Contact",
    body: `Questions about these terms? Email ${siteConfig.email} or write to ${siteConfig.name}, ${siteConfig.address}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Terms of Service", url: `${siteConfig.url}/terms` },
        ]}
      />
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <Breadcrumbs items={[{ label: "Terms of Service", href: "/terms" }]} />

          <div className="mt-6 mb-14">
            <p className="text-accent text-xs md:text-sm font-semibold tracking-[0.28em] uppercase mb-5">
              Legal
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.06]">
              Terms of Service
            </h1>
            <p className="mt-5 text-muted leading-relaxed">
              Effective date: 1 August 2026. These terms govern your use of our website and services.
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
