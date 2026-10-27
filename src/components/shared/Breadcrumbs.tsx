import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="enter mb-10 md:mb-14">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-brand-textMuted">
        <li className="flex items-center">
          <Link href="/" className="transition-colors hover:text-brand-textPrimary">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-brand-textMuted/70" aria-hidden />
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-brand-textSecondary" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-brand-textPrimary">
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
