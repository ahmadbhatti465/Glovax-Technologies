/**
 * Admin overrides the root page-transition template so dashboard tab-switches
 * never fade/offset. Passthrough only.
 */
export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
