export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  link?: string;
  results: string[];
  technologies: string[];
  image?: string;
  featured: boolean;
  /** Case-study enrichment (optional — merged from the case-study data file). */
  industry?: string;
  timeline?: string;
  challenge?: string;
  solution?: string;
  process?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
    rating?: number;
  };
  screenshots?: string[];
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
  updatedAt?: Date;
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
