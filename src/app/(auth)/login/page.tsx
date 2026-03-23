"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleIcon, MailIcon } from "@/components/ui/icons";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");
  const router = useRouter();
  const supabase = createClient();

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for the login link!");
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
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
          <h2 className="font-display text-3xl font-bold text-white mb-4">Welcome Back</h2>
          <p className="text-white/70 text-lg">
            Continue creating beautiful invitations for your special celebrations.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">A</span>
            </div>
            <span className="font-display text-xl font-bold text-charcoal">FirstPower RSVP</span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-charcoal">Sign In</h1>
          <p className="mt-2 text-charcoal-light">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-burgundy font-medium hover:underline">
              Create one
            </Link>
          </p>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="mt-8 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gold/20 bg-white hover:bg-cream transition-colors font-medium text-charcoal"
          >
            <GoogleIcon size={20} />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gold/20" />
            <span className="text-xs text-charcoal-muted uppercase">or</span>
            <div className="flex-1 h-px bg-gold/20" />
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-xl bg-cream p-1 mb-6">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === "password" ? "bg-white shadow-sm text-charcoal" : "text-charcoal-muted"
              }`}
              onClick={() => setMode("password")}
            >
              Password
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === "magic" ? "bg-white shadow-sm text-charcoal" : "text-charcoal-muted"
              }`}
              onClick={() => setMode("magic")}
            >
              Magic Link
            </button>
          </div>

          <form onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {mode === "password" && (
              <Input
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            )}
            <Button type="submit" loading={loading} className="w-full" icon={<MailIcon size={18} />}>
              {mode === "password" ? "Sign In" : "Send Magic Link"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
