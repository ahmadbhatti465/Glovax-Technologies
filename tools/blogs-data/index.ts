import { BlogPost } from "@/types";
import { aiBlogs } from "./ai-blogs";
import { webBlogs } from "./web-blogs";
import { mobileBlogs } from "./mobile-blogs";
import { cloudBlogs } from "./cloud-blogs";
import { seoBlogs } from "./seo-blogs";
import { designBlogs } from "./design-blogs";
import { softwareBlogs } from "./software-blogs";

export const new100Blogs: BlogPost[] = [
  ...aiBlogs,
  ...webBlogs,
  ...mobileBlogs,
  ...cloudBlogs,
  ...seoBlogs,
  ...designBlogs,
  ...softwareBlogs,
];

export {
  aiBlogs,
  webBlogs,
  mobileBlogs,
  cloudBlogs,
  seoBlogs,
  designBlogs,
  softwareBlogs,
};
