import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { ToastProvider } from "@/components/ui/Toast";
import { GoogleAnalytics } from '@next/third-parties/google';

const jetBrainsMono = localFont({
  src: "./fonts/JetBrainsMono-2.304/fonts/variable/JetBrainsMono[wght].ttf",
  variable: "--font-jetbrains-mono",
  preload: true,
});

const spaceGrotesk = localFont({
  src: "./fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-space-grotesk",
  preload: true,
});

export const metadata: Metadata = {
  // REPLACE with your actual production URL
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://central-hack.vit.ac.in'),
  title: {
    default: "Yantra | A Week of Innovation",
    template: "%s | Central Hack", // This automatically appends "| Central Hack" to your event titles
  },
  description: "Central Hack: Where Innovation Meets boundries.",
  openGraph: {
    type: "website",
    siteName: "Yantra",
    images: [
      {
        url: "https://i.postimg.cc/L8h6z2DS/og-main-compressed.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetBrainsMono.variable} ${spaceGrotesk.variable} antialiased max-w-screen overflow-x-hidden`}
      >
        <DashboardProvider>
          <ToastProvider>
            <Navbar />
            {children}
          </ToastProvider>
        </DashboardProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-M7M5DR9DC0"} />

      </body>
    </html>
  );
}
