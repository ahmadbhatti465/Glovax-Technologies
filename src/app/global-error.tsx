"use client";

import "./globals.css";
import { ErrorScreen } from "@/components/shared/ErrorScreen";

// Replaces the root layout when the layout itself fails, so it needs its own <html>.
export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <ErrorScreen {...props} />
      </body>
    </html>
  );
}
