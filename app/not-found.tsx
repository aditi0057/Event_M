import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="page-shell">
      <div className="wrapper flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--color-text-primary)]">Page not found</h1>
        <p className="mt-3 max-w-md text-sm text-[var(--color-text-secondary)]">The page you are looking for does not exist or has moved.</p>
        <Button asChild className="mt-6">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </section>
  );
}
