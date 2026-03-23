"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { TemplatePicker } from "@/components/event/template-picker";
import { ImageUpload } from "@/components/event/image-upload";
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
import { type InvitationTemplate } from "@/lib/templates";
import { toast } from "sonner";

const STEPS = ["Event Type", "Template", "Cover Photo", "Details", "Venue", "Settings", "Review"];

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
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate | null>(null);

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
      case 1: return selectedTemplate !== null;
      case 2: return true; // cover photo is optional
      case 3: return form.title !== "" && form.date !== "" && form.time !== "";
      case 4: return true;
      default: return true;
    }
  }

  async function handleCreate() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please log in"); setLoading(false); return; }

    const slug = slugify(form.title) + "-" + Date.now().toString(36);
    const theme = selectedTemplate
      ? { primary: selectedTemplate.theme.primary, accent: selectedTemplate.theme.accent, background: selectedTemplate.theme.background }
      : { primary: "#8B1A1A", accent: "#D4A574", background: "#FFF8F0" };

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
        theme,
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

  // Get theme colors for preview
  const previewTheme = selectedTemplate?.theme || {
    primary: '#8B1A1A',
    accent: '#D4A574',
    background: '#FFF8F0',
    gradientFrom: '#8B1A1A',
    gradientTo: '#6B1414',
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-2">Create New Event</h1>
      <p className="text-charcoal-light mb-8">Set up your beautiful invitation in just a few steps.</p>

      {/* Stepper */}
      <div className="flex items-center gap-1.5 mb-10 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                i === step
                  ? "bg-burgundy text-white"
                  : i < step
                  ? "bg-burgundy/10 text-burgundy cursor-pointer"
                  : "bg-cream text-charcoal-muted"
              }`}
            >
              {i < step ? <CheckIcon size={12} /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-gold/20" />}
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

      {/* Step 1 – Template Selection */}
      {step === 1 && (
        <TemplatePicker
          eventType={form.type}
          selectedTemplate={selectedTemplate?.id || null}
          onSelect={(template) => setSelectedTemplate(template)}
        />
      )}

      {/* Step 2 – Cover Photo */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-2">Add a Cover Photo</h2>
          <p className="text-sm text-charcoal-light mb-4">
            Upload a personal photo to make your invitation extra special. This is optional — your template looks great on its own too!
          </p>
          <ImageUpload
            currentImage={form.cover_image}
            onImageChange={(url) => updateForm({ cover_image: url })}
            label=""
            hint="Drag & drop or click to upload. JPG, PNG up to 5MB."
          />
          {form.cover_image && selectedTemplate && (
            <div className="mt-6">
              <p className="text-sm font-medium text-charcoal mb-3">Preview with your template:</p>
              <div
                className="rounded-2xl overflow-hidden shadow-lg"
                style={{ background: selectedTemplate.preview.gradient }}
              >
                <div className="relative" style={{ aspectRatio: "16/9" }}>
                  <img
                    src={form.cover_image}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: selectedTemplate.coverOverlay }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <p
                      className="text-xs uppercase tracking-[0.2em] opacity-80 mb-2"
                      style={{ color: selectedTemplate.preview.textColor }}
                    >
                      You are invited to
                    </p>
                    <p
                      className="font-display text-2xl font-bold"
                      style={{ color: selectedTemplate.preview.textColor }}
                    >
                      {form.title || "Your Event Name"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!form.cover_image && (
            <button
              onClick={() => setStep(step + 1)}
              className="text-sm text-charcoal-muted hover:text-charcoal transition-colors underline"
            >
              Skip for now
            </button>
          )}
        </div>
      )}

      {/* Step 3 – Details */}
      {step === 3 && (
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

      {/* Step 4 – Venue */}
      {step === 4 && (
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

      {/* Step 5 – Settings */}
      {step === 5 && (
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

      {/* Step 6 – Review */}
      {step === 6 && (
        <div className="space-y-5">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Review Your Event</h2>

          {/* Live preview card */}
          <div
            className="rounded-2xl overflow-hidden shadow-xl"
            style={{ background: selectedTemplate?.preview.gradient || 'linear-gradient(135deg, #8B1A1A 0%, #D4A574 50%, #8B1A1A 100%)' }}
          >
            {form.cover_image ? (
              <div className="relative" style={{ aspectRatio: "16/9" }}>
                <img src={form.cover_image} alt="" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: selectedTemplate?.coverOverlay || 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(255,248,240,0.9))' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-80 mb-2 text-white">
                    {EVENT_TYPES.find((t) => t.value === form.type)?.emoji} You are cordially invited
                  </p>
                  <h3 className="font-display text-3xl font-bold text-white drop-shadow-lg">{form.title}</h3>
                  {form.subtitle && <p className="text-white/80 mt-1">{form.subtitle}</p>}
                </div>
              </div>
            ) : (
              <div className="p-8 sm:p-12 text-center">
                <p
                  className="text-xs uppercase tracking-[0.2em] opacity-70 mb-2"
                  style={{ color: selectedTemplate?.preview.textColor || '#FFF8F0' }}
                >
                  {EVENT_TYPES.find((t) => t.value === form.type)?.emoji} You are cordially invited
                </p>
                <h3
                  className="font-display text-3xl font-bold"
                  style={{ color: selectedTemplate?.preview.textColor || '#FFF8F0' }}
                >
                  {form.title}
                </h3>
                {form.subtitle && (
                  <p
                    className="opacity-70 mt-1"
                    style={{ color: selectedTemplate?.preview.textColor || '#FFF8F0' }}
                  >
                    {form.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Details card */}
          <div className="card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-charcoal-muted">Template</p>
                <p className="font-medium text-charcoal">{selectedTemplate?.name || "Default"}</p>
              </div>
              <div>
                <p className="text-charcoal-muted">Type</p>
                <p className="font-medium text-charcoal">
                  {EVENT_TYPES.find((t) => t.value === form.type)?.label || "Not set"}
                </p>
              </div>
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
