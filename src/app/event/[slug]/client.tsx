"use client";

import { useState, useEffect } from "react";
import { cn, formatDate, getWhatsAppShareUrl, getSmsShareUrl, getEmailShareUrl } from "@/lib/utils";
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

  if (!envelopeOpen) {
    return (
      <EnvelopeAnimation
        title={event.title}
        subtitle={event.subtitle || undefined}
        onOpen={() => setEnvelopeOpen(true)}
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
      toast.success(rsvpStatus === "yes" ? "See you there!" : "Thanks for letting us know!");
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

  return (
    <div className="min-h-screen bg-cream relative">
      <FloatingPetals count={10} />
      <ConfettiEffect active={showConfetti} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {event.cover_image && (
          <div className="absolute inset-0">
            <img src={event.cover_image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-cream" />
          </div>
        )}
        <div className={cn("relative max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center", !event.cover_image && "pt-12")}>
          <PaisleyBorder position="top" className="mb-8" />
          <p className="text-gold-muted text-sm uppercase tracking-widest mb-3">You are cordially invited to</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-burgundy leading-tight">
            {event.title}
          </h1>
          {event.subtitle && (
            <p className="font-display text-xl text-gold-muted mt-2">{event.subtitle}</p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-gold/20">
              <CalendarIcon size={16} className="text-burgundy" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-gold/20">
              <ClockIcon size={16} className="text-burgundy" />
              {event.time}{event.end_time ? ` – ${event.end_time}` : ""}
            </span>
            {event.venue && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-gold/20">
                <MapPinIcon size={16} className="text-burgundy" />
                {event.venue}
              </span>
            )}
          </div>
          {event.description && (
            <p className="mt-8 text-charcoal-light max-w-lg mx-auto leading-relaxed">{event.description}</p>
          )}
          <PaisleyBorder position="bottom" className="mt-8" />
        </div>
      </section>

      {/* Countdown */}
      {event.settings.showCountdown && (
        <section className="py-10 bg-white/50">
          <div className="max-w-2xl mx-auto px-4">
            <CountdownTimer date={event.date} time={event.time} />
          </div>
        </section>
      )}

      {/* RSVP */}
      <section className="py-12 sm:py-16" id="rsvp">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <HeartIcon size={28} className="text-burgundy mx-auto mb-3" />
            <h2 className="font-display text-2xl font-bold text-charcoal">RSVP</h2>
            <p className="text-charcoal-light mt-1">Will you be joining us?</p>
          </div>

          {rsvpSubmitted ? (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckIcon size={28} className="text-green-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal mb-2">Thank You!</h3>
              <p className="text-charcoal-light">Your RSVP has been received. We look forward to celebrating with you!</p>
            </div>
          ) : !showRsvpForm ? (
            <div className="flex gap-3 justify-center">
              {(["yes", "maybe", "no"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => { setRsvpStatus(status); setShowRsvpForm(true); }}
                  className={cn(
                    "card p-5 text-center flex-1 max-w-[140px] transition-all hover:shadow-md",
                    status === "yes" && "hover:border-green-300",
                    status === "maybe" && "hover:border-amber-300",
                    status === "no" && "hover:border-red-300"
                  )}
                >
                  <span className="text-2xl block mb-2">
                    {status === "yes" ? "🎉" : status === "maybe" ? "🤔" : "😔"}
                  </span>
                  <span className="text-sm font-medium text-charcoal capitalize">{status === "yes" ? "Attending" : status === "maybe" ? "Maybe" : "Can't Make It"}</span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="card p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-charcoal">
                  {rsvpStatus === "yes" ? "🎉 Attending" : rsvpStatus === "maybe" ? "🤔 Maybe" : "😔 Can't Make It"}
                </p>
                <button type="button" onClick={() => { setShowRsvpForm(false); setRsvpStatus(null); }} className="text-charcoal-muted hover:text-charcoal">
                  <XIcon size={18} />
                </button>
              </div>
              <Input label="Your Name" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} required placeholder="Full name" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Email" type="email" value={rsvpEmail} onChange={(e) => setRsvpEmail(e.target.value)} placeholder="Optional" />
                <Input label="Phone" type="tel" value={rsvpPhone} onChange={(e) => setRsvpPhone(e.target.value)} placeholder="Optional" />
              </div>
              {rsvpStatus === "yes" && event.settings.allowPlusOnes && (
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Adults" type="number" min={1} value={rsvpAdults} onChange={(e) => setRsvpAdults(parseInt(e.target.value) || 1)} />
                  <Input label="Kids" type="number" min={0} value={rsvpKids} onChange={(e) => setRsvpKids(parseInt(e.target.value) || 0)} />
                </div>
              )}
              {rsvpStatus === "yes" && event.settings.collectDietary && (
                <Input label="Dietary Preferences" value={rsvpDietary} onChange={(e) => setRsvpDietary(e.target.value)} placeholder="Vegetarian, allergies, etc." />
              )}
              <Textarea label="Message (optional)" value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} placeholder="A note for the hosts" rows={3} />
              <Button type="submit" loading={rsvpLoading} className="w-full" icon={<SendIcon size={18} />}>
                Confirm RSVP
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Timeline */}
      {event.settings.showTimeline && event.timeline_items.length > 0 && (
        <section className="py-12 sm:py-16 bg-white/50">
          <div className="max-w-md mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-charcoal text-center mb-8">Event Schedule</h2>
            <div className="space-y-0">
              {event.timeline_items.map((item, i) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    {i < event.timeline_items.length - 1 && <div className="w-0.5 flex-1 bg-gold/20 my-1" />}
                  </div>
                  <div className="pb-8">
                    <p className="text-xs text-burgundy font-semibold">{item.time}</p>
                    <h3 className="font-display font-semibold text-charcoal">{item.title}</h3>
                    {item.description && <p className="text-sm text-charcoal-light mt-0.5">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {event.settings.showGallery && event.photos.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-charcoal text-center mb-8">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {event.photos.map((photo) => (
                <div key={photo.id} className="aspect-square rounded-xl overflow-hidden">
                  <img src={photo.thumbnail_url || photo.url} alt={photo.caption || ""} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wishes */}
      {event.settings.showWishes && (
        <section className="py-12 sm:py-16 bg-white/50">
          <div className="max-w-md mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-charcoal text-center mb-8">Wishes & Messages</h2>
            <form onSubmit={handleWishSubmit} className="card p-5 space-y-3 mb-6">
              <Input value={wishName} onChange={(e) => setWishName(e.target.value)} placeholder="Your name" required />
              <Textarea value={wishText} onChange={(e) => setWishText(e.target.value)} placeholder="Write your wish..." rows={3} required />
              <Button type="submit" size="sm" loading={wishLoading} icon={<HeartIcon size={16} />}>
                Post Wish
              </Button>
            </form>
            <div className="space-y-3">
              {wishes.map((w) => (
                <div key={w.id} className="card p-4 flex gap-3">
                  <Avatar name={w.name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{w.name}</p>
                    <p className="text-sm text-charcoal-light mt-0.5">{w.text}</p>
                  </div>
                </div>
              ))}
              {wishes.length === 0 && (
                <p className="text-center text-charcoal-muted text-sm py-4">Be the first to leave a wish!</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Registry */}
      {event.settings.showRegistry && event.registry_items.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-md mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-charcoal text-center mb-8">Gift Registry</h2>
            <div className="space-y-3">
              {event.registry_items.map((item) => (
                <a key={item.id} href={item.url || "#"} target="_blank" rel="noopener noreferrer" className="card-hover p-4 flex items-center gap-3 block">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-charcoal">{item.name}</p>
                    {item.description && <p className="text-sm text-charcoal-light">{item.description}</p>}
                  </div>
                  <GiftIcon size={18} className="text-charcoal-muted" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Directions */}
      {event.settings.showDirections && event.address && (
        <section className="py-12 sm:py-16 bg-white/50">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">Getting There</h2>
            <div className="card p-6">
              <MapPinIcon size={24} className="text-burgundy mx-auto mb-3" />
              <p className="font-semibold text-charcoal">{event.venue}</p>
              <p className="text-sm text-charcoal-light mt-1">{event.address}</p>
              {event.city && <p className="text-sm text-charcoal-light">{event.city}</p>}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.address}, ${event.city || ""}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block"
              >
                <Button variant="secondary" size="sm" icon={<NavigationIcon size={16} />}>
                  Open in Google Maps
                </Button>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Guest count */}
      {event.settings.guestCanSeeGuestList && yesCount > 0 && (
        <section className="py-8">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 text-charcoal-light">
              <UsersIcon size={18} />
              <span className="text-sm">{yesCount} guest{yesCount !== 1 ? "s" : ""} attending</span>
            </div>
          </div>
        </section>
      )}

      {/* Share FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          {showShareMenu && (
            <div className="absolute bottom-14 right-0 card p-3 space-y-2 w-56 shadow-xl animate-in slide-in-from-bottom-2">
              <a href={getWhatsAppShareUrl(eventUrl, event.title, event.date)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cream transition-colors text-sm text-charcoal">
                <WhatsAppIcon size={18} className="text-green-600" />
                WhatsApp
              </a>
              <a href={getSmsShareUrl(eventUrl, event.title)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cream transition-colors text-sm text-charcoal">
                <MessageCircleIcon size={18} className="text-blue-600" />
                SMS
              </a>
              <a href={getEmailShareUrl(eventUrl, event.title, event.date)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cream transition-colors text-sm text-charcoal">
                <MailIcon size={18} className="text-red-600" />
                Email
              </a>
              <button onClick={copyLink} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cream transition-colors text-sm text-charcoal w-full">
                <CopyIcon size={18} className="text-charcoal-muted" />
                Copy Link
              </button>
            </div>
          )}
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-burgundy to-burgundy-light text-white shadow-lg shadow-burgundy/30 flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <ShareIcon size={22} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs text-charcoal-muted">
          Made with <HeartIcon size={12} className="inline text-burgundy" /> on{" "}
          <a href="/" className="text-burgundy hover:underline">Aadhya</a>
        </p>
      </footer>
    </div>
  );
}
