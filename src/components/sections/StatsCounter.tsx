import { stats as fallbackStats } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

interface StatsCounterProps {
  stats?: { value: number; suffix: string; label: string }[];
}

export function StatsCounter({ stats: serverStats }: StatsCounterProps) {
  const stats = serverStats?.length ? serverStats : fallbackStats;

  return (
    <section className="py-16 md:py-24 border-y border-neutral-border bg-section-alt relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--teal-glow) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--teal-glow) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              data-reveal
              style={{ ["--stagger" as string]: index * 0.12 }}
              key={stat.label}
              className="text-center relative"
            >
              {/* Subtle divider for desktop */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16"
                  style={{
                    background: "linear-gradient(180deg, transparent, var(--teal-muted), transparent)",
                  }}
                />
              )}

              <div className="text-5xl md:text-6xl lg:text-7xl font-heading font-semibold tracking-[-0.04em]">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="teal-shimmer"
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-5 h-px bg-gradient-to-r from-transparent to-accent/40" />
                <p className="text-sm md:text-base text-muted-foreground tracking-wide">{stat.label}</p>
                <div className="w-5 h-px bg-gradient-to-l from-transparent to-accent/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
