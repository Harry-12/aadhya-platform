"use client";

import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import {
  SparklesIcon,
  CalendarIcon,
  UsersIcon,
  ShareIcon,
  BarChartIcon,
  GlobeIcon,
  HeartIcon,
  CheckIcon,
  WhatsAppIcon,
  ChevronRightIcon,
  StarIcon,
} from "@/components/ui/icons";
import { PaisleyBorder } from "@/components/event/paisley-border";

const FEATURES = [
  {
    icon: <SparklesIcon size={24} />,
    title: "Stunning Designs",
    description: "Elegant templates for weddings, cradle ceremonies, housewarmings, and every celebration.",
  },
  {
    icon: <WhatsAppIcon size={24} />,
    title: "WhatsApp Sharing",
    description: "Share your invitation instantly via WhatsApp, SMS, or email with a single tap.",
  },
  {
    icon: <UsersIcon size={24} />,
    title: "Smart RSVP Tracking",
    description: "Real-time guest responses with meal preferences, plus-ones, and headcount.",
  },
  {
    icon: <CalendarIcon size={24} />,
    title: "Event Timeline",
    description: "Keep guests informed with a beautiful schedule of your event's special moments.",
  },
  {
    icon: <BarChartIcon size={24} />,
    title: "Host Dashboard",
    description: "Manage your guest list, track RSVPs, and get analytics all in one place.",
  },
  {
    icon: <GlobeIcon size={24} />,
    title: "Multi-Language",
    description: "Support for Telugu, Hindi, and English so every guest feels at home.",
  },
];

const STEPS = [
  { number: "01", title: "Choose Your Template", description: "Pick from our curated collection of culturally rich designs." },
  { number: "02", title: "Customize Everything", description: "Add your details, photos, timeline, and personal touches." },
  { number: "03", title: "Share & Track", description: "Send via WhatsApp and watch RSVPs roll in on your dashboard." },
];

const TESTIMONIALS = [
  { name: "Priya Reddy", event: "Wedding", text: "The most beautiful digital invitation our guests had ever seen. The Telugu support made it perfect for our families." },
  { name: "Rahul Sharma", event: "Baby Shower", text: "So easy to set up and share. We got 95% RSVP responses within 24 hours through WhatsApp!" },
  { name: "Lakshmi Nair", event: "Housewarming", text: "The timeline feature was amazing. Our guests knew exactly when each ceremony was happening." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-white to-cream" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burgundy/5 border border-burgundy/10 mb-6">
            <SparklesIcon size={14} className="text-burgundy" />
            <span className="text-sm text-burgundy font-medium">Beautiful invitations for every occasion</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-charcoal leading-tight max-w-4xl mx-auto">
            Create Invitations That{" "}
            <span className="text-burgundy">Touch Hearts</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-charcoal-light max-w-2xl mx-auto leading-relaxed">
            Stunning digital invitations for weddings, cradle ceremonies, housewarmings, and more.
            Share via WhatsApp, track RSVPs, and celebrate beautifully.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" icon={<SparklesIcon size={18} />}>
                Create Your First Event
              </Button>
            </Link>
            <Link href="/event/demo">
              <Button variant="secondary" size="lg" icon={<EyeIcon size={18} />}>
                See a Live Demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-charcoal-muted">Free to start. No credit card required.</p>

          {/* Hero preview */}
          <div className="mt-16 relative max-w-3xl mx-auto">
            <div className="rounded-2xl bg-white shadow-2xl shadow-burgundy/10 border border-gold/10 overflow-hidden">
              <div className="bg-gradient-to-r from-burgundy/5 via-gold/5 to-burgundy/5 p-8 sm:p-12">
                <PaisleyBorder position="top" className="mb-6" />
                <p className="text-gold-muted text-sm uppercase tracking-widest mb-2">You are cordially invited to</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy">
                  Aadhya&apos;s Cradle Ceremony
                </h2>
                <p className="text-gold-muted mt-1">&amp; Housewarming</p>
                <div className="mt-6 flex justify-center gap-6 text-sm text-charcoal-light">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon size={16} className="text-burgundy" />
                    April 11, 2026
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClockIcon size={16} className="text-burgundy" />
                    10:00 AM
                  </span>
                </div>
                <PaisleyBorder position="bottom" className="mt-6" />
              </div>
            </div>
            {/* Floating badges */}
            <div className="absolute -right-4 top-8 hidden sm:block bg-white rounded-xl shadow-lg border border-gold/10 p-3 animate-bounce-slow">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckIcon size={16} className="text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-charcoal">42 Attending</p>
                  <p className="text-xs text-charcoal-muted">3 new today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-burgundy text-sm font-semibold uppercase tracking-wider mb-3">Everything you need</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">
              Celebrations Made Simple
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-burgundy/5 flex items-center justify-center text-burgundy mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">{f.title}</h3>
                <p className="text-charcoal-light text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-burgundy text-sm font-semibold uppercase tracking-wider mb-3">Simple & elegant</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">
              Three Steps to Your Perfect Invite
            </h2>
          </div>
          <div className="space-y-8">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-white">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal">{step.title}</h3>
                  <p className="mt-1 text-charcoal-light">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-burgundy text-sm font-semibold uppercase tracking-wider mb-3">Loved by hosts</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">
              What Our Users Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} size={16} className="text-gold" style={{ fill: "#D4A574" }} />
                  ))}
                </div>
                <p className="text-charcoal-light text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-charcoal text-sm">{t.name}</p>
                  <p className="text-xs text-charcoal-muted">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-burgundy text-sm font-semibold uppercase tracking-wider mb-3">Simple pricing</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">
              Start Free, Upgrade When Ready
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="card p-8">
              <h3 className="font-display text-xl font-semibold text-charcoal">Free</h3>
              <p className="mt-2 text-charcoal-muted text-sm">Perfect for getting started</p>
              <div className="mt-6">
                <span className="font-display text-4xl font-bold text-charcoal">$0</span>
                <span className="text-charcoal-muted text-sm">/event</span>
              </div>
              <ul className="mt-6 space-y-3">
                {["1 event", "Up to 50 guests", "Basic templates", "WhatsApp sharing", "RSVP tracking"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-charcoal-light">
                    <CheckIcon size={16} className="text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block mt-8">
                <Button variant="secondary" className="w-full">Get Started</Button>
              </Link>
            </div>
            {/* Premium */}
            <div className="card p-8 ring-2 ring-burgundy relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-burgundy text-white text-xs font-semibold">
                Most Popular
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal">Premium</h3>
              <p className="mt-2 text-charcoal-muted text-sm">For the perfect celebration</p>
              <div className="mt-6">
                <span className="font-display text-4xl font-bold text-charcoal">$9</span>
                <span className="text-charcoal-muted text-sm">/event</span>
              </div>
              <ul className="mt-6 space-y-3">
                {["5 events", "Unlimited guests", "Premium templates", "Photo gallery", "Custom domain", "Event timeline", "Guest wishes wall"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-charcoal-light">
                    <CheckIcon size={16} className="text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block mt-8">
                <Button className="w-full">Choose Premium</Button>
              </Link>
            </div>
            {/* Pro */}
            <div className="card p-8">
              <h3 className="font-display text-xl font-semibold text-charcoal">Pro</h3>
              <p className="mt-2 text-charcoal-muted text-sm">For event planners</p>
              <div className="mt-6">
                <span className="font-display text-4xl font-bold text-charcoal">$29</span>
                <span className="text-charcoal-muted text-sm">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {["Unlimited events", "Unlimited guests", "All templates", "Priority support", "Custom branding", "Analytics & exports", "Co-host management", "Registry feature"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-charcoal-light">
                    <CheckIcon size={16} className="text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block mt-8">
                <Button variant="secondary" className="w-full">Choose Pro</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-burgundy to-burgundy-dark text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Ready to Create Something Beautiful?
          </h2>
          <p className="mt-4 text-white/80 text-lg">
            Join thousands of hosts who trust Aadhya for their special celebrations.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-burgundy hover:bg-cream shadow-xl"
                icon={<HeartIcon size={18} />}
              >
                Create Your Free Invitation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white/60 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">A</span>
              </div>
              <span className="font-display text-xl font-bold text-white">Aadhya</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} Aadhya. Made with love.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EyeIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ClockIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
