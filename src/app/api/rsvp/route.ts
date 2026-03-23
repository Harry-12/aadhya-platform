import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const rsvpSchema = z.object({
  event_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  status: z.enum(["yes", "no", "maybe"]),
  adults: z.number().int().min(1).max(20).default(1),
  kids: z.number().int().min(0).max(20).default(0),
  dietary: z.string().max(200).default(""),
  message: z.string().max(500).nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = rsvpSchema.parse(body);

    const supabase = createClient();

    // Check event exists and is published
    const { data: event } = await supabase
      .from("events")
      .select("id, status, max_guests")
      .eq("id", parsed.event_id)
      .single();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "published") {
      return NextResponse.json({ error: "Event is not accepting RSVPs" }, { status: 400 });
    }

    // Check guest limit
    if (event.max_guests && parsed.status === "yes") {
      const { count } = await supabase
        .from("rsvps")
        .select("*", { count: "exact", head: true })
        .eq("event_id", parsed.event_id)
        .eq("status", "yes");

      if (count && count >= event.max_guests) {
        return NextResponse.json({ error: "Event is at full capacity" }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from("rsvps")
      .insert({
        event_id: parsed.event_id,
        name: parsed.name,
        email: parsed.email || null,
        phone: parsed.phone || null,
        status: parsed.status,
        adults: parsed.adults,
        kids: parsed.kids,
        dietary: parsed.dietary,
        message: parsed.message || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
