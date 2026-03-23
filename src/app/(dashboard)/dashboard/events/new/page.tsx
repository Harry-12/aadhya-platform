"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ImageIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@/components/ui/icons";
import { slugify } from "@/lib/utils";
import { EVENT_TYPES, type EventType, type EventSettings } from "@/lib/types";
import { toast } from "sonner";

const STEPS = ["Event Type", "Details", "Venue", "Settings", "Review"];

const DEFAULT_SETTINGS: EventSettings = {
  showCountdown: true,
  showTimeline: true,
  showGuestList: false,
  showWishes: true,
  showGallery: true,
  showDirections: true,
  showRegistry: false,
  showWeather: true,
  envelopeAnimation: true,
  confettiOnRsvp: true,
  allowPlusOnes: true,
  collectDietary: false,
  guestCanSeeGuestList: false,
};

export default function CreateEventPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    type: "" as EventType | "",
    title: "",
    subtitle: "",
    date: "",
    time: "10:00",
    end_time: "",
    venue: "",
    address: "",
    city: "",
    description: "",
    description_te: "",
    language: "en",
    max_guests: "",
    cover_image: null as string | null,
    settings: { ...DEFAULT_SETTINGS },
  });

  function updateForm(updates: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function updateSettings(updates: Partial<EventSettings>) {
    setForm((prev) => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0: return form.type !== "";
      case 1: return form.title !== "" && form.date !== "" && form.time !== "";
      case 2: return true;
      default: return true;
    }
  }

  async function handleCreate() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please log in"); setLoading(false); return; }

    const slug = slugify(form.title) + "-" + Date.now().toString(36);
    const { data, error } = await supabase
      .from("events")
      .insert({
        user_id: user.id,
        slug,
        title: form.title,
        subtitle: form.subtitle || null,
        type: form.type,
        status: "draft",
        date: form.date,
        time: form.time,
        end_time: form.end_time || null,
        venue: form.venue || null,
        address: form.address || null,
        city: form.city || null,
        description: form.description || null,
        description_te: form.description_te || null,
        language: form.language,
        max_guests: form.max_guests ? parseInt(form.max_guests) : null,
        cover_image: form.cover_image,
        theme: { primary: "#8B1A1A", accent: "#D4A574", background: "#FFF8F0" },
        settings: form.settings,
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else if (data) {
      toast.success("Event created! You can now customize it further.");
      router.push(`/dashboard/events/${data.id}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-2">Create New Event</h1>
      <p className="text-charcoal-light mb-8">Set up your beautiful invitation in just a few steps.</p>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                i === step
                  ? "bg-burgundy text-white"
                  : i < step
                  ? "bg-burgundy/10 text-burgundy cursor-pointer"
                  : "bg-cream text-charcoal-muted"
              }`}
            >
              {i < step ? <CheckIcon size={14} /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-gold/20" />}
          </div>
        ))}
      </div>

      {/* Step 0 – Event Type */}
      {step === 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold text-charcoal mb-4">What are you celebrating?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EVENT_TYPES.map((et) => (
              <button
                key={et.value}
                onClick={() => updateForm({ type: et.value })}
                className={`card p-4 text-center transition-all ${
                  form.type === et.value
                    ? "ring-2 ring-burgundy bg-burgundy/5"
                    : "hover:bg-cream"
                }`}
              >
                <span className="text-2xl mb-2 block">{et.emoji}</span>
                <span className="text-sm font-medium text-charcoal">{et.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 – Details */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Event Details</h2>
          <Input
            label="Event Title"
            name="title"
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            placeholder="e.g. Aadhya's Cradle Ceremony"
            required
          />
          <Input
            label="Subtitle (optional)"
            name="subtitle"
            value={form.subtitle}
            onChange={(e) => updateForm({ subtitle: e.target.value })}
            placeholder="e.g. & Housewarming"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              name="date"
              value={form.date}
              onChange={(e) => updateForm({ date: e.target.value })}
              required
            />
            <Input
              label="Start Time"
              type="time"
              name="time"
              value={form.time}
              onChange={(e) => updateForm({ time: e.target.value })}
              required
            />
          </div>
          <Input
            label="End Time (optional)"
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={(e) => updateForm({ end_time: e.target.value })}
          />
          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="Tell your guests about the event..."
            rows={4}
          />
          <Select
            label="Primary Language"
            name="language"
            value={form.language}
            onChange={(e) => updateForm({ language: e.target.value })}
            options={[
              { value: "en", label: "English" },
              { value: "te", label: "Telugu" },
              { value: "hi", label: "Hindi" },
              { value: "ta", label: "Tamil" },
            ]}
          />
        </div>
      )}

      {/* Step 2 – Venue */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Venue Details</h2>
          <Input
            label="Venue Name"
            name="venue"
            value={form.venue}
            onChange={(e) => updateForm({ venue: e.target.value })}
            placeholder="e.g. Sri Lakshmi Function Hall"
          />
          <Input
            label="Full Address"
            name="address"
            value={form.address}
            onChange={(e) => updateForm({ address: e.target.value })}
            placeholder="Street address"
          />
          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={(e) => updateForm({ city: e.target.value })}
            placeholder="e.g. Hyderabad"
          />
          <Input
            label="Max Guests (optional)"
            type="number"
            name="max_guests"
            value={form.max_guests}
            onChange={(e) => updateForm({ max_guests: e.target.value })}
            placeholder="Leave empty for unlimited"
          />
        </div>
      )}

      {/* Step 3 – Settings */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Event Settings</h2>
          <div className="card p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal-light uppercase tracking-wider mb-2">Display Options</p>
            <Toggle checked={form.settings.showCountdown} onChange={(v) => updateSettings({ showCountdown: v })} label="Countdown Timer" description="Show a countdown to the event" />
            <Toggle checked={form.settings.showTimeline} onChange={(v) => updateSettings({ showTimeline: v })} label="Event Timeline" description="Show schedule of ceremonies" />
            <Toggle checked={form.settings.showGallery} onChange={(v) => updateSettings({ showGallery: v })} label="Photo Gallery" description="Display event photos" />
            <Toggle checked={form.settings.showWishes} onChange={(v) => updateSettings({ showWishes: v })} label="Wishes Wall" description="Let guests leave messages" />
            <Toggle checked={form.settings.showDirections} onChange={(v) => updateSettings({ showDirections: v })} label="Directions" description="Show map and navigation" />
            <Toggle checked={form.settings.showRegistry} onChange={(v) => updateSettings({ showRegistry: v })} label="Gift Registry" description="Share your gift preferences" />
          </div>
          <div className="card p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal-light uppercase tracking-wider mb-2">Guest Options</p>
            <Toggle checked={form.settings.allowPlusOnes} onChange={(v) => updateSettings({ allowPlusOnes: v })} label="Allow Plus-Ones" description="Guests can bring additional people" />
            <Toggle checked={form.settings.collectDietary} onChange={(v) => updateSettings({ collectDietary: v })} label="Collect Dietary Preferences" description="Ask about food requirements" />
            <Toggle checked={form.settings.guestCanSeeGuestList} onChange={(v) => updateSettings({ guestCanSeeGuestList: v })} label="Public Guest List" description="Guests can see who else is attending" />
          </div>
          <div className="card p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal-light uppercase tracking-wider mb-2">Animations</p>
            <Toggle checked={form.settings.envelopeAnimation} onChange={(v) => updateSettings({ envelopeAnimation: v })} label="Envelope Opening" description="Animate the invitation opening" />
            <Toggle checked={form.settings.confettiOnRsvp} onChange={(v) => updateSettings({ confettiOnRsvp: v })} label="Confetti on RSVP" description="Celebrate when guests confirm" />
          </div>
        </div>
      )}

      {/* Step 4 – Review */}
      {step === 4 && (
        <div className="space-y-5">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Review Your Event</h2>
          <div className="card p-6 space-y-4">
            <div className="text-center pb-4 border-b border-gold/10">
              <p className="text-sm text-gold-muted uppercase tracking-wider mb-1">
                {EVENT_TYPES.find((t) => t.value === form.type)?.emoji}{" "}
                {EVENT_TYPES.find((t) => t.value === form.type)?.label}
              </p>
              <h3 className="font-display text-2xl font-bold text-burgundy">{form.title}</h3>
              {form.subtitle && <p className="text-gold-muted">{form.subtitle}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-charcoal-muted">Date</p>
                <p className="font-medium text-charcoal">{form.date || "Not set"}</p>
              </div>
              <div>
                <p className="text-charcoal-muted">Time</p>
                <p className="font-medium text-charcoal">{form.time || "Not set"}</p>
              </div>
              <div>
                <p className="text-charcoal-muted">Venue</p>
                <p className="font-medium text-charcoal">{form.venue || "Not set"}</p>
              </div>
              <div>
                <p className="text-charcoal-muted">City</p>
                <p className="font-medium text-charcoal">{form.city || "Not set"}</p>
              </div>
            </div>
            {form.description && (
              <div className="pt-4 border-t border-gold/10">
                <p className="text-charcoal-muted text-sm mb-1">Description</p>
                <p className="text-charcoal text-sm">{form.description}</p>
              </div>
            )}
          </div>
          <p className="text-sm text-charcoal-muted">
            Your event will be created as a draft. You can add timeline items, photos, and more after creating it.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gold/10">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          icon={<ChevronLeftIcon size={18} />}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            icon={<ChevronRightIcon size={18} />}
          >
            Continue
          </Button>
        ) : (
          <Button onClick={handleCreate} loading={loading} icon={<SparklesIcon size={18} />}>
            Create Event
          </Button>
        )}
      </div>
    </div>
  );
}
