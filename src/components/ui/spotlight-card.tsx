import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Card surface with a hover glow. The effect is CSS only; see `.spotlight` in globals.css. */
export function SpotlightCard({ className, children, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "spotlight rounded-2xl border border-white/[0.06] bg-canvas-surface",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] transition-colors duration-300",
        "hover:bg-canvas-elevated/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
