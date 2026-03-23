export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white font-display font-bold text-lg">A</span>
        </div>
        <p className="text-charcoal-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}
