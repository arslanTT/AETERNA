import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ModelLoader from "@/components/3d/ModelLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AETERNA — Luxury Watch Showcase",
  description: "A cinematic 3D experience showcasing a luxury watch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-bg-base text-text-primary font-sans antialiased">
        <LoadingScreen />
        <ModelLoader />
        {children}
      </body>
    </html>
  );
}
