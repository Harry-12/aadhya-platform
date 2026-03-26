export type EventType =
  | "cradle_ceremony" | "housewarming" | "birthday" | "wedding"
  | "engagement" | "baby_shower" | "anniversary" | "graduation"
  | "corporate" | "festival" | "other";

export type EventStatus = "draft" | "published" | "archived";
export type RsvpStatus = "yes" | "no" | "maybe";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  plan: "free" | "premium" | "pro";
  created_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  type: EventType;
  status: EventStatus;
  date: string;
  time: string;
  end_time: string | null;
  venue: string | null;
  address: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  description: string | null;
  description_te: string | null;
  cover_image: string | null;
  theme: { primary: string; accent: string; background: string };
  language: string;
  settings: EventSettings;
  custom_domain: string | null;
  og_image: string | null;
  max_guests: number | null;
  template_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventSettings {
  showCountdown: boolean;
  showTimeline: boolean;
  showGuestList: boolean;
  showWishes: boolean;
  showGallery: boolean;
  showDirections: boolean;
  showRegistry: boolean;
  showWeather: boolean;
  envelopeAnimation: boolean;
  confettiOnRsvp: boolean;
  allowPlusOnes: boolean;
  collectDietary: boolean;
  guestCanSeeGuestList: boolean;
}

export interface TimelineItem {
  id: string;
  event_id: string;
  time: string;
  title: string;
  description: string | null;
  icon: string;
  sort_order: number;
}

export interface Rsvp {
  id: string;
  event_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: RsvpStatus;
  adults: number;
  kids: number;
  dietary: string;
  message: string | null;
  rsvp_date: string;
}

export interface Comment {
  id: string;
  event_id: string;
  name: string;
  text: string;
  avatar: string | null;
  created_at: string;
}

export interface Photo {
  id: string;
  event_id: string;
  url: string;
  thumbnail_url: string | null;
  uploaded_by: string | null;
  caption: string | null;
  sort_order: number;
}

export interface RegistryItem {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  url: string | null;
  icon: string;
  sort_order: number;
}

export const EVENT_TYPES: { value: EventType; label: string; emoji: string }[] = [
  { value: "cradle_ceremony", label: "Cradle Ceremony", emoji: "👶" },
  { value: "housewarming", label: "Housewarming", emoji: "🏠" },
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "wedding", label: "Wedding", emoji: "💍" },
  { value: "engagement", label: "Engagement", emoji: "💝" },
  { value: "baby_shower", label: "Baby Shower", emoji: "🍼" },
  { value: "anniversary", label: "Anniversary", emoji: "🎉" },
  { value: "graduation", label: "Graduation", emoji: "🎓" },
  { value: "corporate", label: "Corporate Event", emoji: "🏢" },
  { value: "festival", label: "Festival Gathering", emoji: "🪔" },
  { value: "other", label: "Other", emoji: "✨" },
];
