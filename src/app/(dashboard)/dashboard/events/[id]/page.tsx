"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  CalendarIcon,
  UsersIcon,
  EyeIcon,
  ShareIcon,
  EditIcon,
  BarChartIcon,
  CheckIcon,
  XIcon,
  CopyIcon,
  WhatsAppIcon,
  ExternalLinkIcon,
  MapPinIcon,
  ClockIcon,
} from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import type { Event, Rsvp } from "@/lib/types";
import { toast } from "sonner";

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [tab, setTab] = useState<"overview" | "guests" | "settings">("overview");

  useEffect(() => {
    async function load() {
      const { data: evt } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();
      if (evt) setEvent(evt);

      const { data: rsvpData } = await supabase
        .from("rsvps")
        .select("*")
        .eq("event_id", id)
        .order("rsvp_date", { ascending: false });
      if (rsvpData) setRsvps(rsvpData);
      setLoading(false);
    }
    load();
  }, [id]);

  async function togglePublish() {
    if (!event) return;
    setPublishing(true);
    const newStatus = event.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("events")
      .update({ status: newStatus })
      .eq("id", event.id);
    if (error) {
      toast.error(error.message);
    } else {
      setEvent({ ...event, status: newStatus });
      toast.success(newStatus === "published" ? "Event is now live!" : "Event moved to draft.");
    }
    setPublishing(false);
  }

  function copyEventLink() {
    if (!event) return;
    const url = `${window.location.origin}/event/${event.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Event link copied!");
  }

  if (loading) return <div className="text-center py-12 text-charcoal-muted">Loading...</div>;
  if (!event) return <div className="text-center py-12 text-charcoal-muted">Event not found.</div>;

  const yesCount = rsvps.filter((r) => r.status === "yes").length;
  const noCount = rsvps.filter((r) => r.status === "no").length;
  const maybeCount = rsvps.filter((r) => r.status === "maybe").length;
  const totalAdults = rsvps.filter((r) => r.status === "yes").reduce((a, r) => a + r.adults, 0);
  const totalKids = rsvps.filter((r) => r.status === "yes").reduce((a, r) => a + r.kids, 0);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-2xl font-bold text-charcoal">{event.title}</h1>
            <Badge variant={event.status === "published" ? "success" : "warning"}>{event.status}</Badge>
          </div>
          <p className="text-charcoal-light">
            {formatDate(event.date)} &middot; {event.time} &middot; {event.venue || "No venue"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={copyEventLink} icon={<CopyIcon size={16} />}>
            Copy Link
          </Button>
          {event.status === "published" && (
            <Link href={`/event/${event.slug}`} target="_blank">
              <Button variant="secondary" size="sm" icon={<ExternalLinkIcon size={16} />}>
                View Live
              </Button>
            </Link>
          )}
          <Button size="sm" loading={publishing} onClick={togglePublish} icon={event.status === "published" ? <XIcon size={16} /> : <CheckIcon size={16} />}>
            {event.status === "published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-2xl font-display font-bold text-green-600">{yesCount}</p>
          <p className="text-xs text-charcoal-muted">Attending</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-display font-bold text-amber-600">{maybeCount}</p>
          <p className="text-xs text-charcoal-muted">Maybe</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-display font-bold text-red-600">{noCount}</p>
          <p className="text-xs text-charcoal-muted">Declined</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-display font-bold text-burgundy">{totalAdults + totalKids}</p>
          <p className="text-xs text-charcoal-muted">Total Heads ({totalAdults}A + {totalKids}K)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-cream rounded-xl p-1 mb-6">
        {(["overview", "guests", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors capitalize ${
              tab === t ? "bg-white shadow-sm text-charcoal" : "text-charcoal-muted hover:text-charcoal"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display font-semibold text-charcoal mb-4">Event Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <CalendarIcon size={16} className="text-burgundy mt-0.5" />
                <div>
                  <p className="text-charcoal-muted">Date</p>
                  <p className="font-medium text-charcoal">{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ClockIcon size={16} className="text-burgundy mt-0.5" />
                <div>
                  <p className="text-charcoal-muted">Time</p>
                  <p className="font-medium text-charcoal">{event.time}{event.end_time ? ` – ${event.end_time}` : ""}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon size={16} className="text-burgundy mt-0.5" />
                <div>
                  <p className="text-charcoal-muted">Venue</p>
                  <p className="font-medium text-charcoal">{event.venue || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <UsersIcon size={16} className="text-burgundy mt-0.5" />
                <div>
                  <p className="text-charcoal-muted">Max Guests</p>
                  <p className="font-medium text-charcoal">{event.max_guests || "Unlimited"}</p>
                </div>
              </div>
            </div>
            {event.description && (
              <div className="mt-4 pt-4 border-t border-gold/10">
                <p className="text-charcoal-muted text-sm mb-1">Description</p>
                <p className="text-sm text-charcoal">{event.description}</p>
              </div>
            )}
          </div>

          {/* Quick share */}
          <div className="card p-6">
            <h3 className="font-display font-semibold text-charcoal mb-4">Share Your Event</h3>
            <div className="flex items-center gap-2 p-3 bg-cream rounded-xl">
              <code className="flex-1 text-sm text-charcoal-light truncate">
                {typeof window !== "undefined" ? `${window.location.origin}/event/${event.slug}` : ""}
              </code>
              <Button size="sm" variant="ghost" onClick={copyEventLink} icon={<CopyIcon size={16} />}>Copy</Button>
            </div>
            <div className="flex gap-3 mt-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`You're invited to ${event.title}! RSVP: ${typeof window !== "undefined" ? `${window.location.origin}/event/${event.slug}` : ""}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="sm" icon={<WhatsAppIcon size={16} />}>WhatsApp</Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Guests tab */}
      {tab === "guests" && (
        <div className="space-y-3">
          {rsvps.length === 0 ? (
            <div className="card p-8 text-center text-charcoal-muted">
              No RSVPs yet. Share your event to start collecting responses!
            </div>
          ) : (
            rsvps.map((rsvp) => (
              <div key={rsvp.id} className="card p-4 flex items-center gap-3">
                <Avatar name={rsvp.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal">{rsvp.name}</p>
                  <p className="text-xs text-charcoal-muted">
                    {rsvp.email || rsvp.phone || "No contact info"} &middot; {rsvp.adults}A {rsvp.kids > 0 ? `+ ${rsvp.kids}K` : ""}
                  </p>
                  {rsvp.message && <p className="text-sm text-charcoal-light mt-1 italic">&ldquo;{rsvp.message}&rdquo;</p>}
                </div>
                <Badge variant={rsvp.status === "yes" ? "success" : rsvp.status === "maybe" ? "warning" : "danger"}>
                  {rsvp.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      )}

      {/* Settings tab */}
      {tab === "settings" && (
        <div className="card p-6 text-center text-charcoal-muted">
          <p>Event settings editor coming soon. You can edit settings when creating the event.</p>
        </div>
      )}
    </div>
  );
}
