"use client";

import { createContext, useContext } from "react";
import Link from "@/components/shared/Link";

const HiddenHrefsContext = createContext<string[]>([]);

/** Tells the navigation which sections have no content and should not be linked. */
export function SiteVisibilityProvider({
  hiddenHrefs,
  children,
}: {
  hiddenHrefs: string[];
  children: React.ReactNode;
}) {
  return <HiddenHrefsContext.Provider value={hiddenHrefs}>{children}</HiddenHrefsContext.Provider>;
}

export function useHiddenHrefs() {
  return useContext(HiddenHrefsContext);
}

export function FooterLinkList({ links }: { links: { label: string; href: string }[] }) {
  const hiddenHrefs = useHiddenHrefs();

  return (
    <ul className="space-y-3">
      {links
        .filter((link) => !hiddenHrefs.includes(link.href))
        .map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-brand-textSecondary transition-colors duration-200 hover:text-brand-textPrimary"
            >
              {link.label}
            </Link>
          </li>
        ))}
    </ul>
  );
}
