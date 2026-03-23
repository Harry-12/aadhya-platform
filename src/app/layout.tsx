import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FirstPower RSVP — Beautiful Event Invitations",
    template: "%s | FirstPower RSVP",
  },
  description:
    "Create stunning digital invitations for weddings, cradle ceremonies, housewarmings, and more. Share via WhatsApp, track RSVPs, and celebrate beautifully.",
  keywords: [
    "RSVP",
    "invitations",
    "wedding",
    "cradle ceremony",
    "housewarming",
    "Telugu events",
    "Indian events",
    "digital invitation",
  ],
  openGraph: {
    title: "FirstPower RSVP — Beautiful Event Invitations",
    description: "Create stunning digital invitations and track RSVPs effortlessly.",
    type: "website",
    siteName: "FirstPower RSVP",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-cream">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
