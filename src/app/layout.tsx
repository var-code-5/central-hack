import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { ToastProvider } from "@/components/ui/Toast";

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
  title: "Yantra",
  description: "Central Hack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetBrainsMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <DashboardProvider>
          <ToastProvider>
            <Navbar />
            {children}
          </ToastProvider>
        </DashboardProvider>
      </body>
    </html>
  );
}
