"use client";

import { useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { reportClientError } from "@/lib/client-monitoring";

interface ErrorScreenProps {
  error: Error;
  reset: () => void;
}

export function ErrorScreen({ error, reset }: ErrorScreenProps) {
  useEffect(() => reportClientError(error), [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background text-foreground">
      <div className="text-center max-w-md">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">Something went wrong</h1>
        <p className="text-muted mb-8">
          We couldn&apos;t load this page. Please try again, or email us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
            {siteConfig.email}
          </a>
          .
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 rounded-full bg-accent-electric text-white text-sm font-medium hover:brightness-110 transition-all"
          >
            Try again
          </button>
          <Link href="/" className="text-sm text-accent hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
