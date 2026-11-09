import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { TeamMember } from "@/types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageBackdrop } from "@/components/shared/PageBackdrop";

interface TeamContentProps {
  team?: TeamMember[];
  lastUpdated?: Date | null;
}

export default function TeamContent({ team: serverTeam, lastUpdated }: TeamContentProps) {
  const team = serverTeam ?? [];

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative isolate outline-none pt-28 pb-24">
        <PageBackdrop />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Breadcrumbs items={[{ label: "Team", href: "/team" }]} />
          <SectionHeader
            as="h1"
            eyebrow="Our Team"
            title="Meet the minds behind"
            titleHighlight="Glovax Technologies"
            subtitle="A diverse team of innovators, engineers, and problem-solvers dedicated to transforming businesses through technology."
          />

          {lastUpdated && (
            <p className="text-xs text-muted-foreground mb-8 -mt-8 text-center">
              Last updated:{" "}
              {new Date(lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div
                data-reveal
                style={{ ["--stagger" as string]: index * 0.1 }}
                key={member.id}
                className="group p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{member.name}</h2>
                    <p className="text-sm text-accent mb-2">{member.role}</p>
                    <p className="text-sm text-muted leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
