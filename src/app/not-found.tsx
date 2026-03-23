import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-burgundy/5 flex items-center justify-center mx-auto mb-6">
          <span className="font-display text-4xl font-bold text-burgundy">404</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-charcoal mb-3">Page Not Found</h1>
        <p className="text-charcoal-light mb-8">
          The page you&apos;re looking for doesn&apos;t exist or the event may have been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-burgundy to-burgundy-light shadow-lg shadow-burgundy/30 hover:shadow-xl transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
