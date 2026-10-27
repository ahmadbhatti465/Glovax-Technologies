import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  as?: "h1" | "h2";
}

const alignClasses = {
  left: "text-left items-start",
  center: "text-center items-center mx-auto",
  right: "text-right items-end ml-auto",
};

export function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = "center",
  className = "",
  as: Tag = "h2",
}: SectionHeaderProps) {
  const isPageTitle = Tag === "h1";

  const content = (
    <>
      {eyebrow && (
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-mono font-medium uppercase tracking-[0.18em] text-brand-textSecondary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-electricBright shadow-[0_0_8px_var(--accent-electric-bright)]" />
          {eyebrow}
        </span>
      )}
      <Tag
        className={cn(
          "font-semibold leading-[1.05] text-balance",
          isPageTitle
            ? "text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] tracking-[-0.045em]"
            : "text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] tracking-[-0.035em]"
        )}
      >
        <span className="text-premium">{title}</span>
        {titleHighlight && <span className="text-signal"> {titleHighlight}</span>}
      </Tag>
      {subtitle && (
        <p className="mt-5 text-base md:text-lg leading-relaxed text-brand-textSecondary max-w-2xl">
          {subtitle}
        </p>
      )}
    </>
  );

  const classes = cn("flex flex-col max-w-3xl mb-12 md:mb-16", alignClasses[align], className);

  // Page titles are the LCP element: render them visible immediately with a
  // CSS-only entrance instead of waiting for hydration + an in-view trigger.
  if (isPageTitle) {
    return <div className={cn("enter", classes)}>{content}</div>;
  }

  return (
    <div
      data-reveal
      className={classes}
    >
      {content}
    </div>
  );
}
