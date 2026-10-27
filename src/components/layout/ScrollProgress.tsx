/**
 * Thin gradient progress bar pinned to the top of the viewport.
 * Pure CSS: driven by the root scroll timeline (see `.scroll-progress` in
 * globals.css), so it costs no JavaScript and never re-renders.
 */
export function ScrollProgress() {
  return <div aria-hidden className="scroll-progress" />;
}
