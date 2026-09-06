export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
}

export interface PortfolioGalleryItem {
  url: string;
  alt?: string;
  title?: string;
  caption?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug?: string;
  client: string;
  category: string;
  shortDescription?: string;
  description: string;
  link?: string;
  clientWebsite?: string;
  industry?: string;
  services?: string[];
  technologies: string[];
  timeline?: string;
  projectYear?: string;
  location?: string;
  featured: boolean;
  status?: "draft" | "published" | "archived";
  challenge?: string;
  solution?: string;
  process?: string[];
  results: string[];
  keyFeatures?: string[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  testimonialCompany?: string;
  testimonialRating?: number;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
    rating?: number;
  };
  image?: string;
  imageAlt?: string;
  imageTitle?: string;
  imageCaption?: string;
  gallery?: PortfolioGalleryItem[];
  screenshots?: string[];
  relatedProjects?: string[];
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  includeInSitemap?: boolean;
  sitemapPriority?: number;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaType?: "CreativeWork" | "Article" | "WebPage" | "None";
  publishedAt?: string;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  /** Optional trust/social-proof fields — surfaced when present. */
  country?: string;
  countryCode?: string;
  linkedin?: string;
  avatar?: string;
  companyLogo?: string;
  /** Type of project delivered (e.g. "SaaS Platform", "Mobile App"). */
  projectType?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  expertise: string[];
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  featured: boolean;
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageTitle?: string;
  featuredImageCaption?: string;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  faqs?: FAQItem[];
  status?: PageStatus;
  createdAt?: Date;
  updatedAt?: Date;
  versionHistory?: PageVersion[];
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  country: string;
  shortDescription: string;
  description: string;
  rating: number;
  reviewCount: number;
  address?: string;
  phone?: string;
  website?: string;
  hours: { day: string; hours: string }[];
  tags: string[];
  image?: string;
  featured: boolean;
  isRemote: boolean;
}

export type PageType =
  | "standard"
  | "service"
  | "landing"
  | "portfolio"
  | "case_study"
  | "company"
  | "contact"
  | "policy"
  | "custom";

export type PageStatus = "draft" | "published" | "scheduled" | "archived";

export type SchemaType =
  | "WebPage"
  | "AboutPage"
  | "ContactPage"
  | "Service"
  | "FAQPage"
  | "Organization"
  | "SoftwareApplication"
  | "BreadcrumbList"
  | "None";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PageVersion {
  version: number;
  title: string;
  updatedAt: string;
  author: string;
  note?: string;
  contentSnippet?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  pageType: PageType;
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageTitle?: string;
  featuredImageCaption?: string;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords: string[];
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  includeInSitemap: boolean;
  sitemapPriority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaType: SchemaType;
  faqs: FAQItem[];
  status: PageStatus;
  author: string;
  featured: boolean;
  readTime: number;
  scheduledAt?: Date | string | null;
  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  versionHistory?: PageVersion[];
}

export interface Redirect {
  id: string;
  source: string;
  destination: string;
  statusCode: number;
  createdAt?: Date | string | null;
}

export interface InternalLinkTarget {
  title: string;
  url: string;
  category: "Page" | "Service" | "Portfolio" | "Blog" | "System";
  description?: string;
}
