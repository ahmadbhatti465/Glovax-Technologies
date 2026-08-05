import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Glovax",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#08110F",
    theme_color: "#18D6C3",
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