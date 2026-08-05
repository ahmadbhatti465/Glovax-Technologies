import { Testimonial } from "@/types";

// Fallback demo copy shown when the CMS has no testimonials. The CMS/admin
// panel is the source of truth for real, attributed client quotes.
export const testimonials: Testimonial[] = [
  {
    id: "1",
    content:
      "Glovax Technologies transformed our entire digital presence. Their team delivered a world-class SaaS platform that increased our user engagement by 200%. The attention to detail and technical excellence is unmatched.",
    author: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc.",
    rating: 5,
    country: "United Kingdom",
    countryCode: "GB",
    projectType: "SaaS Platform",
  },
  {
    id: "2",
    content:
      "Working with Glovax Technologies was a game-changer for our startup. They built our mobile app from scratch and it now has a 4.9-star rating with over 500K downloads. Truly exceptional work.",
    author: "Michael Chen",
    role: "CTO",
    company: "InnovateLabs",
    rating: 5,
    country: "United States",
    countryCode: "US",
    projectType: "Mobile App",
  },
  {
    id: "3",
    content:
      "The AI marketing engine Glovax Technologies built for us delivered a 300% ROI within the first quarter. Their understanding of both technology and business strategy is remarkable.",
    author: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthCo",
    rating: 5,
    country: "United States",
    countryCode: "US",
    projectType: "AI / Marketing Engine",
  },
  {
    id: "4",
    content:
      "We migrated our entire infrastructure to AWS with zero downtime. Glovax Technologies' cloud expertise saved us 45% on infrastructure costs while improving performance significantly.",
    author: "David Kim",
    role: "VP of Engineering",
    company: "GlobalTech",
    rating: 5,
    country: "Singapore",
    countryCode: "SG",
    projectType: "Cloud Migration",
  },
  {
    id: "5",
    content:
      "The rebrand and website redesign exceeded our expectations. Conversions increased by 150% and we finally have a digital presence that reflects our brand quality.",
    author: "Lisa Thompson",
    role: "Founder",
    company: "DigitalFirst",
    rating: 5,
    country: "United Kingdom",
    countryCode: "GB",
    projectType: "Web Redesign",
  },
];
