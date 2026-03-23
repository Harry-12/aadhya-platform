"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, CalendarIcon, ChevronRightIcon, EyeIcon, EditIcon, TrashIcon } from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/lib/types";

export default function EventsListPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setEvents(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-charcoal">My Events</h1>
        <Link href="/dashboard/events/new">
          <Button icon={<PlusIcon size={18} />}>New Event</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-charcoal-muted">Loading...</div>
      ) : events.length === 0 ? (
        <div className="card p-12 text-center">
          <CalendarIcon size={32} className="text-burgundy mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-charcoal mb-2">No events yet</h3>
          <p className="text-charcoal-light mb-6">Get started by creating your first event.</p>
          <Link href="/dashboard/events/new">
            <Button icon={<PlusIcon size={18} />}>Create Event</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Link key={event.id} href={`/dashboard/events/${event.id}`} className="block">
              <div className="card-hover p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-charcoal truncate">{event.title}</h3>
                    <Badge variant={event.status === "published" ? "success" : event.status === "draft" ? "warning" : "default"}>
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-charcoal-light">
                    {formatDate(event.date)} &middot; {event.venue || "No venue set"}
                  </p>
                </div>
                <ChevronRightIcon size={20} className="text-charcoal-muted shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
