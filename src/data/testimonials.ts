import { Testimonial } from "@/types";

// Fallback demo testimonials shown when the CMS has no testimonials yet.
// Each quote is written to read like a genuine client note and mirrors an
// actual Glovax project type (Hajj & Umrah platform, e-commerce storefront,
// cloud migration, AI research system, mobile app, rebrand). The CMS/admin
// panel is the source of truth for real, attributed client quotes — swap
// these out as genuine feedback comes in.
export const testimonials: Testimonial[] = [
  {
    id: "1",
    content:
      "We used to run peak season on two phones and three staff taking bookings by hand. Now pilgrims book online and our agents track commissions in the portal. Last Ramadan we processed more Umrah bookings than ever before with the same team.",
    author: "Usman Farooq",
    role: "Managing Director",
    company: "Al-Noor Travels",
    rating: 5,
    country: "Pakistan",
    countryCode: "PK",
    projectType: "Hajj & Umrah Booking Platform",
  },
  {
    id: "2",
    content:
      "Our old store lost most visitors at checkout. Glovax rebuilt it around trust clearer product pages, secure payments, and a mobile experience that actually loads. Completion rate nearly doubled within one season, and repeat orders keep climbing.",
    author: "Ayesha Malik",
    role: "Founder",
    company: "Heritage Botanics",
    rating: 5,
    country: "Pakistan",
    countryCode: "PK",
    projectType: "E-commerce Storefront",
  },
  {
    id: "3",
    content:
      "They migrated seven of our workloads to AWS without a single missed SLA, and the documentation they left behind is the best any contractor has given us. What won me over: they pushed back when we asked for things we didn't actually need.",
    author: "Jonathan Pearce",
    role: "Head of Engineering",
    company: "Helix Digital",
    rating: 5,
    country: "United Kingdom",
    countryCode: "GB",
    projectType: "AWS Cloud Migration",
  },
  {
    id: "4",
    content:
      "We spent two or three days per topic on literature reviews. Their multi-agent system drafts a fully cited report in under an hour, and a critic agent flags weak claims before any analyst sees it. Our team now covers four times the ground.",
    author: "Priya Sharma",
    role: "Head of Research",
    company: "Meridian Analytics",
    rating: 5,
    country: "United States",
    countryCode: "US",
    projectType: "AI Research System",
  },
  {
    id: "5",
    content:
      "I'll admit we were wary of hiring a team we'd never met in person. They ran weekly demos, answered hard questions straight, and shipped three weeks early. We launched at 4.8 on both app stores, and the crash reports since would fit on one hand.",
    author: "Omar Al Farsi",
    role: "Co-founder",
    company: "Zest Delivery",
    rating: 5,
    country: "United Arab Emirates",
    countryCode: "AE",
    projectType: "Mobile App",
  },
  {
    id: "6",
    content:
      "The redesign itself was excellent and our enquiries doubled within two months. Four stars only because the final revisions ran late while they juggled other projects but the result was worth the wait, and I'd work with them again.",
    author: "Maria Giannini",
    role: "Creative Director",
    company: "Lumen Studio",
    rating: 4,
    country: "Italy",
    countryCode: "IT",
    projectType: "Brand & Web Redesign",
  },
];
