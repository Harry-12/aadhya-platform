import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getCountdown(targetDate: string, targetTime: string = "10:00 AM") {
  const [timePart, ampm] = targetTime.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const target = new Date(`${targetDate}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
  const diff = Math.max(0, target.getTime() - Date.now());

  return {
    days: Math.floor(diff / 864e5),
    hours: Math.floor((diff % 864e5) / 36e5),
    minutes: Math.floor((diff % 36e5) / 6e4),
    seconds: Math.floor((diff % 6e4) / 1e3),
    isPast: diff === 0,
  };
}

export function formatDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getWhatsAppShareUrl(eventUrl: string, title: string, date: string): string {
  const text = encodeURIComponent(
    `You're invited to ${title}!\n\n${formatDate(date)}\n\nRSVP here: ${eventUrl}`
  );
  return `https://wa.me/?text=${text}`;
}

export function getSmsShareUrl(eventUrl: string, title: string): string {
  const body = encodeURIComponent(`You're invited to ${title}! RSVP: ${eventUrl}`);
  return `sms:?body=${body}`;
}

export function getEmailShareUrl(eventUrl: string, title: string, date: string): string {
  const subject = encodeURIComponent(`You're Invited: ${title}`);
  const body = encodeURIComponent(
    `You're cordially invited to ${title} on ${formatDate(date)}.\n\nPlease RSVP: ${eventUrl}`
  );
  return `mailto:?subject=${subject}&body=${body}`;
}

export function formatTime(time: string): string {
  if (!time) return "";
  // Handle "HH:mm" 24h format
  const parts = time.match(/^(\d{1,2}):(\d{2})/);
  if (!parts) return time;
  let hours = parseInt(parts[1], 10);
  const minutes = parts[2];
  const ampm = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return `${hours}:${minutes} ${ampm}`;
}

export const AVATAR_COLORS = ["#8B1A1A", "#D4A574", "#7D8C6E", "#C49A6C", "#A52A2A", "#6B4423"];
