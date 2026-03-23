"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import {
  HomeIcon,
  CalendarIcon,
  PlusIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  BarChartIcon,
} from "@/components/ui/icons";
import type { Profile } from "@/lib/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: HomeIcon },
  { href: "/dashboard/events", label: "My Events", icon: CalendarIcon },
  { href: "/dashboard/events/new", label: "Create Event", icon: PlusIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);
    }
    loadProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gold/10 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-gold/10">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">A</span>
              </div>
              <span className="font-display text-lg font-bold text-charcoal">FirstPower RSVP</span>
            </Link>
            <button className="lg:hidden p-1" onClick={() => setSidebarOpen(false)}>
              <XIcon size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-burgundy/5 text-burgundy"
                      : "text-charcoal-light hover:bg-cream hover:text-charcoal"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Profile */}
          <div className="px-3 py-4 border-t border-gold/10">
            {profile && (
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar name={profile.full_name || profile.email} src={profile.avatar_url} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {profile.full_name || "User"}
                  </p>
                  <p className="text-xs text-charcoal-muted truncate">{profile.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal-light hover:bg-cream hover:text-red-600 transition-colors w-full mt-1"
            >
              <LogOutIcon size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-cream/80 backdrop-blur-md border-b border-gold/10 h-16 flex items-center px-4 sm:px-6 lg:px-8">
          <button className="lg:hidden p-2 mr-3" onClick={() => setSidebarOpen(true)}>
            <MenuIcon size={20} />
          </button>
          <div className="flex-1" />
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
