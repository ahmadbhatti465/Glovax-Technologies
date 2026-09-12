export const siteConfig = {
  name: "Glovax Technologies",
  tagline: "Software House & AI/ML Digital Agency",
  description:
    "Glovax Technologies is a premier software house and AI engineering agency. We build production-grade Next.js web applications, custom RAG AI systems, and scalable FastAPI backends for high-growth US & UK businesses.",
  url: "https://www.glovaxtechnologies.com",
  logo: "/images/glovax-logo.png",
  ogImage: "/images/glovax-og.png",
  email: "info@glovaxtechnologies.com",
  phone: "+923254255480",
  address: "31 K, DHA Phase 5",
  calendarUrl: "https://calendly.com/glovaxtechnologies/30min",
  responseTime: "24 hours",
  founder: {
    name: "Muhammad Ahmad",
    role: "Founder & Lead Full Stack / AI Engineer",
    location: "Lahore, Pakistan",
    linkedin: "https://linkedin.com/in/ahmadbhatti465",
    github: "https://github.com/ahmadbhatti465",
    upwork: "https://www.upwork.com/freelancers/ahmadbhatti465",
  },
  social: {
    linkedin: "https://linkedin.com/company/glovaxtechnologies",
    instagram: "https://www.instagram.com/glovaxtechnologies/",
    upwork: "https://www.upwork.com/freelancers/ahmadbhatti465",
    whatsapp: "https://wa.me/923254255480",
  },
};

/**
 * Default Open Graph image (absolute URL). Pages define their own `openGraph`,
 * which replaces the root layout's `images`, so each page includes this via
 * `images: [ogImage]` — otherwise `og:image` is missing from social shares.
 */
export const ogImage = {
  url: siteConfig.ogImage.startsWith("http")
    ? siteConfig.ogImage
    : `${siteConfig.url}${siteConfig.ogImage}`,
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.tagline}`,
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Case Studies", href: "/work" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/career" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Web Development", href: "/services" },
    { label: "Mobile Apps", href: "/services" },
    { label: "AI & Machine Learning", href: "/services" },
    { label: "Cloud & DevOps", href: "/services" },
    { label: "UI/UX Design", href: "/services" },
    { label: "Digital Marketing", href: "/services" },
  ],
  resources: [
    { label: "Case Studies", href: "/work" },
    { label: "Business Directory", href: "/directory" },
    { label: "Documentation", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const clientLogos = [
  "TechStart",
  "InnovateLabs",
  "GrowthCo",
  "GlobalTech",
  "DigitalFirst",
  "AppVenture",
  "CloudNine",
  "FutureSoft",
  "DataPulse",
  "NexGen AI",
];

export const stats = [
  { value: 100, suffix: "+", label: "Projects Delivered" },
  { value: 99, suffix: "%", label: "Client Satisfaction" },
  { value: 30, suffix: "+", label: "Countries Served" },
  { value: 35, suffix: "+", label: "Team Members" },
];
