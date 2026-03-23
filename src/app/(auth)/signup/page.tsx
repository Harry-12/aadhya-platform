"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon, SparklesIcon } from "@/components/ui/icons";
import { toast } from "sonner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Check your email to confirm your account!");
      router.push("/login");
    }
  }

  async function handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-burgundy to-burgundy-dark items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <span className="text-white font-display font-bold text-2xl">A</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-4">Join Aadhya</h2>
          <p className="text-white/70 text-lg">
            Create stunning invitations for your celebrations in minutes.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            {["Beautiful templates", "WhatsApp sharing", "RSVP tracking", "Multi-language"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-white/80 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">A</span>
            </div>
            <span className="font-display text-xl font-bold text-charcoal">Aadhya</span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-charcoal">Create Your Account</h1>
          <p className="mt-2 text-charcoal-light">
            Already have an account?{" "}
            <Link href="/login" className="text-burgundy font-medium hover:underline">
              Sign in
            </Link>
          </p>

          {/* Google */}
          <button
            onClick={handleGoogleSignup}
            className="mt-8 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gold/20 bg-white hover:bg-cream transition-colors font-medium text-charcoal"
          >
            <GoogleIcon size={20} />
            Sign up with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gold/20" />
            <span className="text-xs text-charcoal-muted uppercase">or</span>
            <div className="flex-1 h-px bg-gold/20" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              hint="Must be at least 6 characters"
            />
            <Button type="submit" loading={loading} className="w-full" icon={<SparklesIcon size={18} />}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-xs text-charcoal-muted text-center">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
