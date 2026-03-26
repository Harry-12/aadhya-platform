"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input, Textarea } from "@/components/ui/input";
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
import { formatDate, formatTime } from "@/lib/utils";
import { TEMPLATES } from "@/lib/templates";
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

  // Edit form state
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editVenue, setEditVenue] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMaxGuests, setEditMaxGuests] = useState<number | null>(null);
  const [editTemplateId, setEditTemplateId] = useState("");

  useEffect(() => {
    async function load() {
      const { data: evt } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();
      if (evt) {
        setEvent(evt);
        populateEditForm(evt);
      }

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

  function populateEditForm(evt: Event) {
    setEditTitle(evt.title || "");
    setEditSubtitle(evt.subtitle || "");
    setEditDate(evt.date || "");
    setEditTime(evt.time || "");
    setEditEndTime(evt.end_time || "");
    setEditVenue(evt.venue || "");
    setEditAddress(evt.address || "");
    setEditCity(evt.city || "");
    setEditDescription(evt.description || "");
    setEditMaxGuests(evt.max_guests || null);
    setEditTemplateId(evt.template_id || "midnight-bloom");
  }

  function startEditing() {
    if (event) populateEditForm(event);
    setTab("settings");
  }

  function cancelEditing() {
    if (event) populateEditForm(event);
    setTab("overview");
  }

  async function saveChanges() {
    if (!event) return;
    setSaving(true);

    // Look up the selected template and sync theme colors
    const selectedTemplate = TEMPLATES.find(t => t.id === editTemplateId);
    const themeColors = selectedTemplate
      ? { primary: selectedTemplate.theme.primary, accent: selectedTemplate.theme.accent, background: selectedTemplate.theme.background }
      : event.theme;

    const updates: Record<string, unknown> = {
      title: editTitle,
      subtitle: editSubtitle || null,
      date: editDate,
      time: editTime,
      end_time: editEndTime || null,
      venue: editVenue || null,
      address: editAddress || null,
      city: editCity || null,
      description: editDescription || null,
      max_guests: editMaxGuests || null,
      template_id: editTemplateId,
      theme: themeColors,
    };

    const { error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", event.id);

    if (error) {
      toast.error("Failed to save: " + error.message);
    } else {
      setEvent({ ...event, ...updates } as Event);
      toast.success("Event updated successfully!");
      setTab("overview");
    }
    setSaving(false);
  }

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
            {formatDate(event.date)} &middot; {formatTime(event.time)} &middot; {event.venue || "No venue"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={copyEventLink} icon={<CopyIcon size={16} />}>
            Copy Link
          </Button>
          <Button variant="secondary" size="sm" onClick={startEditing} icon={<EditIcon size={16} />}>
            Edit Event
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
            {t === "settings" ? "Edit Details" : t}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-charcoal">Event Details</h3>
              <Button variant="ghost" size="sm" onClick={startEditing} icon={<EditIcon size={16} />}>
                Edit
              </Button>
            </div>
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
                  <p className="font-medium text-charcoal">{formatTime(event.time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ""}</p>
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
            {event.template_id && (
              <div className="mt-4 pt-4 border-t border-gold/10">
                <p className="text-charcoal-muted text-sm mb-1">Theme</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ background: TEMPLATES.find(t => t.id === event.template_id)?.preview.gradient || "#ccc" }}
                  />
                  <p className="text-sm font-medium text-charcoal">
                    {TEMPLATES.find(t => t.id === event.template_id)?.name || event.template_id}
                  </p>
                </div>
              </div>
            )}
            {event.address && (
              <div className="mt-4 pt-4 border-t border-gold/10">
                <p className="text-charcoal-muted text-sm mb-1">Full Address</p>
                <p className="text-sm text-charcoal">{event.address}{event.city ? `, ${event.city}` : ""}</p>
              </div>
            )}
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

      {/* Edit Details tab */}
      {tab === "settings" && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-semibold text-charcoal">Edit Event Details</h3>
            <Button variant="ghost" size="sm" onClick={cancelEditing}>
              Cancel
            </Button>
          </div>

          <div className="space-y-5">
            <Input
              label="Event Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="e.g., Housewarming & Cradle Ceremony"
              required
            />

            <Input
              label="Subtitle"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              placeholder="e.g., Join us for a joyous celebration!"
            />

            {/* Template Selector */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Invitation Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setEditTemplateId(tmpl.id)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      editTemplateId === tmpl.id
                        ? "border-burgundy shadow-lg scale-[1.02]"
                        : "border-transparent hover:border-gold/30"
                    }`}
                  >
                    <div
                      className="h-16 w-full"
                      style={{ background: tmpl.preview.gradient }}
                    />
                    <div className="px-2 py-1.5 bg-white">
                      <p className="text-xs font-medium text-charcoal truncate">{tmpl.name}</p>
                      <p className="text-[10px] text-charcoal-muted capitalize">{tmpl.category}</p>
                    </div>
                    {editTemplateId === tmpl.id && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-burgundy rounded-full flex items-center justify-center">
                        <CheckIcon size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                required
              />
              <Input
                label="Start Time"
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                required
              />
              <Input
                label="End Time (optional)"
                type="time"
                value={editEndTime}
                onChange={(e) => setEditEndTime(e.target.value)}
              />
            </div>

            <Input
              label="Venue Name"
              value={editVenue}
              onChange={(e) => setEditVenue(e.target.value)}
              placeholder="e.g., Our New Home"
            />

            <Input
              label="Full Address"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              placeholder="e.g., 141 Montecilo Drive, Liberty Hill, TX 78642"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                placeholder="e.g., Liberty Hill, Texas"
              />
              <Input
                label="Max Guests (leave empty for unlimited)"
                type="number"
                value={editMaxGuests || ""}
                onChange={(e) => setEditMaxGuests(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Unlimited"
              />
            </div>

            <Textarea
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Tell your guests about the event..."
              rows={4}
            />

            <div className="flex gap-3 pt-2">
              <Button
                onClick={saveChanges}
                loading={saving}
                icon={<CheckIcon size={16} />}
              >
                Save Changes
              </Button>
              <Button variant="ghost" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
