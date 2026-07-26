"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="max-w-7xl mx-auto px-6 md:px-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              {isLast || !item.href ? (
                <span className={isLast ? "text-foreground" : ""}>{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-accent transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
