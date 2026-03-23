"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "./icons";
import { Button } from "./button";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">A</span>
            </div>
            <span className="font-display text-xl font-bold text-charcoal">Aadhya</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm text-charcoal-light hover:text-burgundy transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm text-charcoal-light hover:text-burgundy transition-colors">
              How It Works
            </Link>
            <Link href="/#pricing" className="text-sm text-charcoal-light hover:text-burgundy transition-colors">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gold/10 bg-white px-4 py-4 space-y-3">
          <Link href="/#features" className="block py-2 text-charcoal-light" onClick={() => setOpen(false)}>
            Features
          </Link>
          <Link href="/#how-it-works" className="block py-2 text-charcoal-light" onClick={() => setOpen(false)}>
            How It Works
          </Link>
          <Link href="/#pricing" className="block py-2 text-charcoal-light" onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">Log In</Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button size="sm" className="w-full">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
