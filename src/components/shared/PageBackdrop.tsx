/**
 * Shared top-of-page atmosphere for inner pages: aurora wash, masked tech
 * grid and a lit hairline. Purely decorative CSS — no JS, no hydration.
 * Place as the first child of a `relative isolate` container.
 */
export function PageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] overflow-hidden">
      <div className="aurora absolute inset-0 opacity-80" />
      <div className="tech-grid absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-electricBright/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas-base" />
    </div>
  );
}
