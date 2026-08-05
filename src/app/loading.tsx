import Image from "next/image";

/**
 * Root loading fallback — shown while a route suspends on navigation.
 * A quiet brand mark, not a spinner wall.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-background">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-teal/20 blur-2xl animate-pulse" />
        <Image
          src="/images/glovax-logo.png"
          alt="Glovax Technologies"
          width={161}
          height={49}
          priority
          className="relative w-36 h-auto opacity-90"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="typing-dot w-2 h-2 rounded-full bg-teal" />
        <span className="typing-dot w-2 h-2 rounded-full bg-teal" />
        <span className="typing-dot w-2 h-2 rounded-full bg-teal" />
      </div>
    </div>
  );
}
