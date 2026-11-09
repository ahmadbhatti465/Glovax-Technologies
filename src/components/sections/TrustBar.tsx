// Real technologies the team ships with — honest social proof for technical buyers.
const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "FastAPI",
  "LangChain",
  "OpenAI",
  "RAG",
  "AWS",
  "Docker",
  "PostgreSQL",
];

export function TrustBar() {
  return (
    <section className="py-16 md:py-20 border-b border-neutral-border bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-mono tracking-[0.25em] uppercase text-muted-foreground font-medium mb-8">
            The stack behind your product
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {techStack.map((tech, index) => (
              <span
                key={tech}
                data-reveal
                style={{ ["--stagger" as string]: index * 0.03 }}
                className="px-4 py-2 rounded-full bg-surface-raised border border-neutral-border text-sm font-mono font-medium text-muted-foreground hover:text-accent hover:border-white/[0.14] hover:shadow-glow transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
