import type { Metadata } from "next";
import { siteConfig, ogImage } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import { PageBackdrop } from "@/components/shared/PageBackdrop";

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
    images: [ogImage],
  },
};

interface PolicySection {
  title: string;
  body?: string;
  items?: string[];
  after?: string;
}

const LOCATION = "Lahore, Pakistan";

const sections: PolicySection[] = [
  {
    title: "Who we are",
    body: `${siteConfig.name} runs this website and is responsible for the personal data described in this policy. Our address is ${siteConfig.address}, ${LOCATION}, and you can reach us at ${siteConfig.email}.`,
  },
  {
    title: "Information we collect",
    items: [
      "Contact form: your name, email address, company (optional), the service you are interested in, and your message.",
      "Homepage and newsletter forms: your email address.",
      "Chat assistant: what you type stays in your browser unless you ask us to contact you. If you do, we receive your email address and your last message.",
      "Security: your IP address is checked to limit repeated form submissions and login attempts. We store a scrambled (hashed) version of it, not the address itself.",
      "Analytics: if you accept analytics cookies, Google Analytics collects information about how you use the site, such as the pages you visit, your device and browser, and your approximate location.",
    ],
  },
  {
    title: "How we use your information",
    body: "We save what you send us in our database so that no enquiry is lost, and then email it to our team. If you use the contact form, we may also send you a confirmation email. We use this information to respond to enquiries, prepare project proposals, deliver services you have engaged us for, and send occasional updates if you have subscribed. We never sell, rent, or trade your personal information to third parties.",
  },
  {
    title: "Our legal basis",
    items: [
      "Your request or a contract: to respond to your enquiry and to provide services you ask for.",
      "Legitimate interests: to keep the site secure, prevent spam and abuse, and find and fix errors.",
      "Consent: for analytics cookies. You can withdraw consent at any time.",
    ],
  },
  {
    title: "Service providers",
    body: "We use these companies to run the site. They process personal data on our behalf, only for the purposes described here.",
    items: [
      "Vercel hosts this website and processes technical request data such as IP addresses.",
      "Turso hosts the database where enquiries are stored.",
      "Resend delivers emails about enquiries, including the details you submit.",
      "Hostinger hosts our business mailboxes, where enquiry emails arrive.",
      "Cloudflare Turnstile checks that form submissions come from a person. It processes your IP address and information about your browser and device.",
      "Sentry helps us find and fix website errors. Error reports contain technical details about the problem. We have configured it not to collect form contents, cookies, or request headers.",
      "Google Analytics measures how the site is used, but only if you accept analytics cookies. Advertising features are turned off.",
    ],
  },
  {
    title: "International transfers",
    body: "Our team is based in Pakistan, and our service providers may process data in other countries, including the United States. Where the law requires it, we rely on the safeguards these providers offer for international transfers, such as standard contractual clauses.",
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
    title: "Cookies and similar technologies",
    items: [
      "Your cookie choice is saved in your browser so we do not ask on every visit. We ask again after six months.",
      "Google Analytics cookies (_ga and _ga_*) are set only if you accept, and can last up to two years. If you reject them, Google Analytics does not load.",
      "A login cookie is used only by our site administrators.",
    ],
    after: "You can change your choice at any time using the Cookie settings link at the bottom of any page. If you withdraw consent, we stop analytics and remove its cookies.",
  },
  {
    title: "Your rights",
    body: "Depending on where you live (including under GDPR and UK GDPR), you may have the right to access, correct, erase, or receive a copy of your personal data, to object to or restrict certain processing, and to withdraw consent. To exercise these rights, contact us. You can also complain to your local data protection authority, such as the Information Commissioner's Office in the UK.",
  },
  {
    title: "Changes to this policy",
    body: "We may update this policy from time to time. The date at the top of this page shows when it last changed.",
  },
  {
    title: "Contact us",
    body: `Questions about this policy? Email us at ${siteConfig.email} or write to ${siteConfig.name}, ${siteConfig.address}, ${LOCATION}.`,
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
      <main id="main-content" tabIndex={-1} className="relative isolate outline-none pt-32 pb-24">
        <PageBackdrop />
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy" }]} />

          <div className="mt-6 mb-14">
            <p className="text-accent text-xs md:text-sm font-mono font-semibold tracking-[0.28em] uppercase mb-5">
              Legal
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.06]">
              Privacy Policy
            </h1>
            <p className="mt-5 text-muted leading-relaxed">
              Effective date: 9 November 2026. This policy explains what we collect and why, in plain language.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">
                  {section.title}
                </h2>
                {section.body && <p className="text-muted leading-relaxed">{section.body}</p>}
                {section.items && (
                  <ul className={`list-disc space-y-2 pl-5 text-muted leading-relaxed ${section.body ? "mt-3" : ""}`}>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.after && <p className="mt-3 text-muted leading-relaxed">{section.after}</p>}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
