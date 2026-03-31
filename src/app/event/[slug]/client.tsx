"use client";

import { useState, useEffect, useRef } from "react";
import { cn, formatDate, formatTime, getWhatsAppShareUrl, getSmsShareUrl, getEmailShareUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { PaisleyBorder } from "@/components/event/paisley-border";
import { FloatingPetals } from "@/components/event/floating-petals";
import { CountdownTimer } from "@/components/event/countdown-timer";
import { ConfettiEffect } from "@/components/event/confetti-effect";
import { EnvelopeAnimation } from "@/components/event/envelope-animation";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  HeartIcon,
  SendIcon,
  ShareIcon,
  WhatsAppIcon,
  MailIcon,
  PhoneIcon,
  MessageCircleIcon,
  NavigationIcon,
  GiftIcon,
  CheckIcon,
  XIcon,
  CopyIcon,
} from "@/components/ui/icons";
import type { Event, TimelineItem, Rsvp, Comment, Photo, RegistryItem } from "@/lib/types";
import { toast } from "sonner";

interface EventPageClientProps {
  event: Event & {
    timeline_items: TimelineItem[];
    comments: Comment[];
    photos: Photo[];
    registry_items: RegistryItem[];
    rsvps: Pick<Rsvp, "id" | "name" | "status" | "message" | "rsvp_date">[];
  };
}

export default function EventPageClient({ event }: EventPageClientProps) {
  const supabase = createClient();
  const [envelopeOpen, setEnvelopeOpen] = useState(!event.settings.envelopeAnimation);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"yes" | "no" | "maybe" | null>(null);
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  // RSVP form state
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpAdults, setRsvpAdults] = useState(1);
  const [rsvpKids, setRsvpKids] = useState(0);
  const [rsvpDietary, setRsvpDietary] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Wishes
  const [wishName, setWishName] = useState("");
  const [wishText, setWishText] = useState("");
  const [wishes, setWishes] = useState(event.comments);
  const [wishLoading, setWishLoading] = useState(false);

  const eventUrl = typeof window !== "undefined" ? window.location.href : "";
  const yesCount = event.rsvps.filter((r) => r.status === "yes").length;
  const maybeCount = event.rsvps.filter((r) => r.status === "maybe").length;

  // Theme from event
  const theme = event.theme || { primary: '#8B1A1A', accent: '#D4A574', background: '#FFF8F0' };

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => {
              const next = new Set(Array.from(prev));
              next.add(entry.target.id);
              return next;
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [envelopeOpen]);

  if (!envelopeOpen) {
    return (
      <EnvelopeAnimation
        title={event.title}
        subtitle={event.subtitle || undefined}
        onOpen={() => setEnvelopeOpen(true)}
        theme={theme}
      />
    );
  }

  async function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rsvpStatus || !rsvpName) return;
    setRsvpLoading(true);

    const { error } = await supabase.from("rsvps").insert({
      event_id: event.id,
      name: rsvpName,
      email: rsvpEmail || null,
      phone: rsvpPhone || null,
      status: rsvpStatus,
      adults: rsvpAdults,
      kids: rsvpKids,
      dietary: rsvpDietary,
      message: rsvpMessage || null,
    });

    if (error) {
      toast.error("Failed to submit RSVP. Please try again.");
    } else {
      setRsvpSubmitted(true);
      if (rsvpStatus === "yes" && event.settings.confettiOnRsvp) {
        setShowConfetti(true);
      }
      toast.success(rsvpStatus === "yes" ? "See you there! 🎉" : "Thanks for letting us know!");
    }
    setRsvpLoading(false);
  }

  async function handleWishSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!wishName || !wishText) return;
    setWishLoading(true);

    const { data, error } = await supabase
      .from("comments")
      .insert({ event_id: event.id, name: wishName, text: wishText })
      .select()
      .single();

    if (error) {
      toast.error("Failed to post wish.");
    } else if (data) {
      setWishes((prev) => [data, ...prev]);
      setWishName("");
      setWishText("");
      toast.success("Your wish has been posted!");
    }
    setWishLoading(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(eventUrl);
    toast.success("Link copied!");
  }

  const sectionClass = (id: string) =>
    cn(
      "transition-all duration-700",
      visibleSections.has(id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    );

  return (
    <div className="min-h-screen relative" style={{ background: theme.background }}>
      <FloatingPetals count={8} />
      <ConfettiEffect active={showConfetti} />

      {/* Hero Section - Full bleed */}
      <section className="relative overflow-hidden">
        {event.cover_image ? (
          <>
            <div className="relative" style={{ minHeight: '60vh' }}>
              <img
                src={event.cover_image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, ${theme.primary}66 0%, ${theme.primary}33 40%, ${theme.background}FF 100%)`,
                }}
              />
              <div className="relative flex flex-col items-center justify-center text-center px-4 py-20 sm:py-32" style={{ minHeight: '60vh' }}>
                <div className="animate-fade-in">
                  <p className="text-white/80 text-sm uppercase tracking-[0.3em] mb-4 font-medium">
                    You are cordially invited to
                  </p>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                    {event.title}
                  </h1>
                  {event.subtitle && (
                    <p className="font-display text-xl sm:text-2xl text-white/80 mt-3 drop-shadow">
                      {event.subtitle}
                    </p>
                  )}
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-3 animate-slide-up">
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                    <CalendarIcon size={16} />
                    {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                    <ClockIcon size={16} />
                    {formatTime(event.time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ""}
                  </span>
                  {event.venue && (
                    <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                      <MapPinIcon size={16} />
                      {event.venue}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="relative overflow-hidden">
            {/* Multi-layer gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent}88 50%, ${theme.primary} 100%)`,
              }}
            />
            {/* Subtle radial glow */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, ${theme.accent}30 0%, transparent 60%)`,
              }}
            />
            {/* Decorative floating orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute w-64 h-64 rounded-full blur-3xl animate-pulse"
                style={{ background: `${theme.accent}15`, top: '-10%', left: '-5%', animationDuration: '4s' }}
              />
              <div
                className="absolute w-48 h-48 rounded-full blur-3xl animate-pulse"
                style={{ background: `${theme.accent}10`, bottom: '5%', right: '-5%', animationDuration: '5s', animationDelay: '1s' }}
              />
            </div>
            <div className="relative max-w-2xl mx-auto px-4 py-24 sm:py-36 text-center">
              <PaisleyBorder position="top" className="mb-10" />
              <div className="animate-fade-in">
                <p className="text-white/60 text-xs sm:text-sm uppercase tracking-[0.4em] mb-5 font-medium">
                  You are cordially invited to
                </p>
                <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                  {event.title}
                </h1>
                {event.subtitle && (
                  <p className="font-display text-lg sm:text-2xl text-white/70 mt-4 font-light italic">{event.subtitle}</p>
                )}
                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="w-12 h-px" style={{ background: `${theme.accent}60` }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: `${theme.accent}80` }} />
                  <div className="w-12 h-px" style={{ background: `${theme.accent}60` }} />
                </div>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3 animate-slide-up">
                <a href="#countdown" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-sm font-medium shadow-lg cursor-pointer hover:bg-white/20 transition-colors">
                  <CalendarIcon size={16} />
                  {formatDate(event.date)}
                </a>
                <a href="#countdown" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-sm font-medium shadow-lg cursor-pointer hover:bg-white/20 transition-colors">
                  <ClockIcon size={16} />
                  {formatTime(event.time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ""}
                </a>
                {event.venue && (
                  <a href="#directions" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-sm font-medium shadow-lg cursor-pointer hover:bg-white/20 transition-colors">
                    <MapPinIcon size={16} />
                    {event.venue}
                  </a>
                )}
              </div>
              <PaisleyBorder position="bottom" className="mt-10" />
            </div>
          </div>
        )}
      </section>

      {/* Description */}
      {event.description && (
        <section
          id="description"
          data-animate
          className={cn("py-14 sm:py-20", sectionClass("description"))}
        >
          <div className="max-w-xl mx-auto px-6 text-center">
            {/* Decorative quote mark */}
            <div className="mb-4">
              <span className="font-display text-5xl leading-none" style={{ color: `${theme.primary}20` }}>&ldquo;</span>
            </div>
            <p className="text-charcoal-light leading-relaxed text-lg sm:text-xl font-light">{event.description}</p>
            <div className="mt-6">
              <span className="font-display text-5xl leading-none" style={{ color: `${theme.primary}20` }}>&rdquo;</span>
            </div>
          </div>
        </section>
      )}

      {/* Attending count - hidden from public view, only visible to host */}

      {/* Countdown */}
      {event.settings.showCountdown && (
        <section
          id="countdown"
          data-animate
          className={cn("py-10 sm:py-14 bg-white/50", sectionClass("countdown"))}
        >
          <div className="max-w-2xl mx-auto px-4">
            <CountdownTimer date={event.date} time={event.time} theme={theme} />
          </div>
        </section>
      )}

      {/* RSVP - Primary CTA section */}
      <section
        id="rsvp"
        data-animate
        className={cn("py-14 sm:py-20", sectionClass("rsvp"))}
      >
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: `${theme.primary}15` }}
            >
              <HeartIcon size={28} className="text-burgundy" />
            </div>
            <h2 className="font-display text-3xl font-bold text-charcoal">Will you join us?</h2>
            <p className="text-charcoal-light mt-2">We would love to have you celebrate with us</p>
          </div>

          {rsvpSubmitted ? (
            <div className="card p-8 text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: rsvpStatus === "yes" ? '#DCFCE7' : rsvpStatus === "maybe" ? '#FEF9C3' : '#FEE2E2' }}
              >
                <span className="text-4xl">
                  {rsvpStatus === "yes" ? "🎉" : rsvpStatus === "maybe" ? "🤔" : "😔"}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-charcoal mb-2">
                {rsvpStatus === "yes" ? "See you there!" : rsvpStatus === "maybe" ? "Hope you can make it!" : "We'll miss you!"}
              </h3>
              <p className="text-charcoal-light">
                {rsvpStatus === "yes"
                  ? "Your RSVP has been confirmed. We can't wait to celebrate with you!"
                  : rsvpStatus === "maybe"
                  ? "We've noted your response. Let us know if things change!"
                  : "Thanks for letting us know. We'll miss having you there."}
              </p>
              {/* Share prompt after RSVP */}
              <div className="mt-6 pt-6 border-t border-gold/10">
                <p className="text-sm text-charcoal-muted mb-3">Spread the word!</p>
                <div className="flex justify-center gap-3">
                  <a
                    href={getWhatsAppShareUrl(eventUrl, event.title, event.date)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    <WhatsAppIcon size={16} />
                    WhatsApp
                  </a>
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal/5 text-charcoal text-sm font-medium hover:bg-charcoal/10 transition-colors"
                  >
                    <CopyIcon size={16} />
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          ) : !showRsvpForm ? (
            <div className="grid grid-cols-3 gap-3">
              {(["yes", "maybe", "no"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => { setRsvpStatus(status); setShowRsvpForm(true); }}
                  className={cn(
                    "card p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group",
                    status === "yes" && "hover:border-green-300 hover:bg-green-50/50",
                    status === "maybe" && "hover:border-amber-300 hover:bg-amber-50/50",
                    status === "no" && "hover:border-red-300 hover:bg-red-50/50"
                  )}
                >
                  <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                    {status === "yes" ? "🎉" : status === "maybe" ? "🤔" : "😔"}
                  </span>
                  <span className="text-sm font-semibold text-charcoal">
                    {status === "yes" ? "Going!" : status === "maybe" ? "Maybe" : "Can't Go"}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="card p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {rsvpStatus === "yes" ? "🎉" : rsvpStatus === "maybe" ? "🤔" : "😔"}
                  </span>
                  <p className="text-sm font-semibold text-charcoal">
                    {rsvpStatus === "yes" ? "I'm Going!" : rsvpStatus === "maybe" ? "I Might Come" : "Can't Make It"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowRsvpForm(false); setRsvpStatus(null); }}
                  className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal-muted hover:text-charcoal hover:bg-charcoal/10 transition-colors"
                >
                  <XIcon size={16} />
                </button>
              </div>

              <Input label="Your Name" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} required placeholder="Full name" />

              <div className="grid grid-cols-2 gap-3">
                <Input label="Email" type="email" value={rsvpEmail} onChange={(e) => setRsvpEmail(e.target.value)} placeholder="Optional" />
                <Input label="Phone" type="tel" value={rsvpPhone} onChange={(e) => setRsvpPhone(e.target.value)} placeholder="Optional" />
              </div>

              {rsvpStatus === "yes" && event.settings.allowPlusOnes && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-charcoal">Adults</label>
                    <div className="flex items-center rounded-xl border border-gold/30 overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setRsvpAdults(Math.max(1, rsvpAdults - 1))}
                        className="w-11 h-11 flex items-center justify-center text-lg font-semibold hover:bg-cream transition-colors shrink-0"
                        style={{ color: theme.primary }}
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-semibold text-charcoal text-base tabular-nums">{rsvpAdults}</span>
                      <button
                        type="button"
                        onClick={() => setRsvpAdults(rsvpAdults + 1)}
                        className="w-11 h-11 flex items-center justify-center text-lg font-semibold hover:bg-cream transition-colors shrink-0"
                        style={{ color: theme.primary }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-charcoal">Kids</label>
                    <div className="flex items-center rounded-xl border border-gold/30 overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setRsvpKids(Math.max(0, rsvpKids - 1))}
                        className="w-11 h-11 flex items-center justify-center text-lg font-semibold hover:bg-cream transition-colors shrink-0"
                        style={{ color: theme.primary }}
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-semibold text-charcoal text-base tabular-nums">{rsvpKids}</span>
                      <button
                        type="button"
                        onClick={() => setRsvpKids(rsvpKids + 1)}
                        className="w-11 h-11 flex items-center justify-center text-lg font-semibold hover:bg-cream transition-colors shrink-0"
                        style={{ color: theme.primary }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {rsvpStatus === "yes" && event.settings.collectDietary && (
                <Input label="Dietary Preferences" value={rsvpDietary} onChange={(e) => setRsvpDietary(e.target.value)} placeholder="Vegetarian, allergies, etc." />
              )}

              <Textarea label="Leave a message (optional)" value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="A note for the hosts..." rows={3} />

              <button
                type="submit"
                disabled={rsvpLoading || !rsvpName}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 shadow-lg hover:shadow-xl"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
              >
                {rsvpLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Confirm RSVP"
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Timeline */}
      {event.settings.showTimeline && event.timeline_items.length > 0 && (
        <section
          id="timeline"
          data-animate
          className={cn("py-14 sm:py-20 bg-white/50", sectionClass("timeline"))}
        >
          <div className="max-w-md mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-charcoal text-center mb-10">Event Schedule</h2>
            <div className="space-y-0">
              {event.timeline_items.map((item, i) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-sm transition-transform group-hover:scale-110"
                      style={{ background: `${theme.primary}12` }}
                    >
                      {item.icon}
                    </div>
                    {i < event.timeline_items.length - 1 && (
                      <div className="w-0.5 flex-1 my-1" style={{ background: `${theme.accent}30` }} />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                      {item.time}
                    </p>
                    <h3 className="font-display font-semibold text-charcoal text-lg">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-charcoal-light mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {event.settings.showGallery && event.photos.length > 0 && (
        <section
          id="gallery"
          data-animate
          className={cn("py-14 sm:py-20", sectionClass("gallery"))}
        >
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-charcoal text-center mb-10">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {event.photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="aspect-square rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={photo.thumbnail_url || photo.url}
                    alt={photo.caption || ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Lightbox */}
          {selectedPhoto && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={() => setSelectedPhoto(null)}
              >
                <XIcon size={20} />
              </button>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || ""}
                className="max-w-full max-h-[85vh] rounded-xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              {selectedPhoto.caption && (
                <p className="absolute bottom-8 text-white/80 text-center">{selectedPhoto.caption}</p>
              )}
            </div>
          )}
        </section>
      )}

      {/* Wishes Wall */}
      {event.settings.showWishes && (
        <section
          id="wishes"
          data-animate
          className={cn("py-14 sm:py-20 bg-white/50", sectionClass("wishes"))}
        >
          <div className="max-w-md mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-charcoal text-center mb-2">Wishes & Messages</h2>
            <p className="text-charcoal-light text-center text-sm mb-8">Leave your blessings and good wishes</p>

            <form onSubmit={handleWishSubmit} className="card p-5 space-y-3 shadow-sm">
              <Input value={wishName} onChange={(e) => setWishName(e.target.value)} placeholder="Your name" required />
              <Textarea value={wishText} onChange={(e) => setWishText(e.target.value)} placeholder="Write your wish..." rows={3} required />
              <button
                type="submit"
                disabled={wishLoading || !wishName || !wishText}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: theme.primary }}
              >
                {wishLoading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <HeartIcon size={16} />
                )}
                Post Wish
              </button>
            </form>

            {/* Wishes are only visible to the host in the dashboard */}
          </div>
        </section>
      )}

      {/* Registry */}
      {event.settings.showRegistry && event.registry_items.length > 0 && (
        <section
          id="registry"
          data-animate
          className={cn("py-14 sm:py-20", sectionClass("registry"))}
        >
          <div className="max-w-md mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-charcoal text-center mb-2">Gift Registry</h2>
            <p className="text-charcoal-light text-center text-sm mb-8">Your presence is our present! But if you'd like to gift...</p>
            <div className="space-y-3">
              {event.registry_items.map((item) => (
                <a
                  key={item.id}
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-4 hover:shadow-md transition-all group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-charcoal">{item.name}</p>
                    {item.description && <p className="text-sm text-charcoal-light">{item.description}</p>}
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-charcoal-muted group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Directions */}
      {event.settings.showDirections && event.address && (
        <section
          id="directions"
          data-animate
          className={cn("py-14 sm:py-20 bg-white/50", sectionClass("directions"))}
        >
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="font-display text-2xl font-bold text-charcoal mb-6">Getting There</h2>
            <div className="card p-8 shadow-sm">
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: `${theme.primary}10` }}
              >
                <MapPinIcon size={24} style={{ color: theme.primary }} />
              </div>
              <p className="font-display font-semibold text-charcoal text-lg">{event.venue}</p>
              <p className="text-charcoal-light mt-1">{event.address}</p>
              {event.city && <p className="text-charcoal-light">{event.city}</p>}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.address}, ${event.city || ""}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
                style={{ background: theme.primary }}
              >
                <NavigationIcon size={16} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Share FAB - hidden from public guest view, only available to host in dashboard */}

      {/* Footer */}
      <footer className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-px" style={{ background: `${theme.accent}30` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${theme.accent}40` }} />
          <div className="w-8 h-px" style={{ background: `${theme.accent}30` }} />
        </div>
        <p className="text-xs text-charcoal-muted mt-3">
          Made with <HeartIcon size={12} className="inline" style={{ color: theme.primary }} /> on{" "}
          <a href="/" className="hover:underline font-medium" style={{ color: theme.primary }}>FirstPower RSVP</a>
        </p>
      </footer>
    </div>
  );
}
