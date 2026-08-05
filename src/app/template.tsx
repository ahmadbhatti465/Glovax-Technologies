/**
 * Root template — re-mounts on every client navigation so the `.page-enter`
 * fade reads as a smooth page transition. Pure CSS (no extra JS payload),
 * and auto-disabled under `prefers-reduced-motion` via globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
