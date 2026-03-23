import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";
import EventPageClient from "./client";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, subtitle, description, date, venue, cover_image, og_image")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!event) return { title: "Event Not Found" };

  return {
    title: `${event.title}${event.subtitle ? ` ${event.subtitle}` : ""}`,
    description: event.description || `Join us for ${event.title} on ${formatDate(event.date)}`,
    openGraph: {
      title: event.title,
      description: event.description || `You're invited to ${event.title}`,
      images: event.og_image || event.cover_image ? [event.og_image || event.cover_image] : [],
    },
  };
}

export default async function EventPage({ params }: Props) {
  const supabase = createClient();

  const { data: event } = await supabase
    .from("events")
    .select(`
      *,
      timeline_items(*),
      comments(*),
      photos(*),
      registry_items(*),
      rsvps(id, name, status, message, rsvp_date)
    `)
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!event) notFound();

  // Type assertion since Supabase generic types don't infer nested selects well
  return <EventPageClient event={event as any} />;
}
