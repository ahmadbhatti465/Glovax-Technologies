import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-background min-h-screen">{children}</div>;
}
