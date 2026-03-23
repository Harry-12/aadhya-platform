"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  CalendarIcon,
  UsersIcon,
  EyeIcon,
  ChevronRightIcon,
  BarChartIcon,
} from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import type { Event, Rsvp } from "@/lib/types";

interface EventWithStats extends Event {
  rsvps?: Rsvp[];
  yesCount: number;
  totalGuests: number;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: evts } = await supabase
        .from("events")
        .select("*, rsvps(*)")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (evts) {
        setEvents(
          evts.map((e: any) => ({
            ...e,
            yesCount: e.rsvps?.filter((r: Rsvp) => r.status === "yes").length || 0,
            totalGuests: e.rsvps?.length || 0,
          }))
        );
      }
      setLoading(false);
    }
    loadEvents();
  }, []);

  const totalYes = events.reduce((a, e) => a + e.yesCount, 0);
  const totalGuests = events.reduce((a, e) => a + e.totalGuests, 0);
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date());

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-charcoal-light mt-1">Manage your events and track RSVPs</p>
        </div>
        <Link href="/dashboard/events/new">
          <Button icon={<PlusIcon size={18} />}>Create Event</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Events", value: events.length, icon: CalendarIcon, color: "text-burgundy bg-burgundy/5" },
          { label: "Upcoming", value: upcomingEvents.length, icon: CalendarIcon, color: "text-blue-600 bg-blue-50" },
          { label: "Attending", value: totalYes, icon: UsersIcon, color: "text-green-600 bg-green-50" },
          { label: "Total RSVPs", value: totalGuests, icon: BarChartIcon, color: "text-gold-muted bg-gold/10" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-display font-bold text-charcoal">{stat.value}</p>
            <p className="text-sm text-charcoal-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Events list */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-charcoal">Your Events</h2>
        {loading ? (
          <div className="card p-8 text-center text-charcoal-muted">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-burgundy/5 flex items-center justify-center mx-auto mb-4">
              <CalendarIcon size={28} className="text-burgundy" />
            </div>
            <h3 className="font-display text-lg font-semibold text-charcoal mb-2">No events yet</h3>
            <p className="text-charcoal-light mb-6">Create your first event and start collecting RSVPs!</p>
            <Link href="/dashboard/events/new">
              <Button icon={<PlusIcon size={18} />}>Create Your First Event</Button>
            </Link>
          </div>
        ) : (
          events.map((event) => (
            <Link key={event.id} href={`/dashboard/events/${event.id}`} className="block">
              <div className="card-hover p-4 sm:p-5 flex items-center gap-4">
                {/* Event type emoji */}
                <div className="w-12 h-12 rounded-xl bg-burgundy/5 flex items-center justify-center text-xl shrink-0">
                  {EVENT_TYPE_EMOJI[event.type] || "✨"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-charcoal truncate">{event.title}</h3>
                    <Badge variant={event.status === "published" ? "success" : event.status === "draft" ? "warning" : "default"}>
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-charcoal-light">{formatDate(event.date)} &middot; {event.venue || "Venue TBD"}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-display font-bold text-burgundy">{event.yesCount}</p>
                    <p className="text-xs text-charcoal-muted">attending</p>
                  </div>
                  <ChevronRightIcon size={20} className="text-charcoal-muted" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

const EVENT_TYPE_EMOJI: Record<string, string> = {
  cradle_ceremony: "👶",
  housewarming: "🏠",
  birthday: "🎂",
  wedding: "💍",
  engagement: "💝",
  baby_shower: "🍼",
  anniversary: "🎉",
  graduation: "🎓",
  corporate: "🏢",
  festival: "🪔",
  other: "✨",
};
