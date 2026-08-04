import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Glovax",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#041E18",
    theme_color: "#378C92",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    categories: ["business", "technology", "productivity"],
    lang: "en",
  };
}