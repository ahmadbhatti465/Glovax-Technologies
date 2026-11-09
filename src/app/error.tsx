"use client";

import { ErrorScreen } from "@/components/shared/ErrorScreen";

export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen {...props} />;
}
