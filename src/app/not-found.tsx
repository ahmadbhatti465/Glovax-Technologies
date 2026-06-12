import Link from "next/link";
import { MagneticButton } from "@/components/shared/MagneticButton";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl md:text-9xl font-bold tracking-tight gradient-text mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Page not found
        </h2>
        <p className="text-muted mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <MagneticButton href="/" variant="primary">
          Back to Home
        </MagneticButton>
      </div>
    </div>
  );
}
