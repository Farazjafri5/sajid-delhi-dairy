import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "DELHI DIARIES OFFICIAL | Social-First Creative Studio",
  description: "We make brands worth stopping for. Reels, content, social media and creative campaigns built for restaurants, cafes, luxury hospitality, and D2C brands.",
  keywords: ["creative agency delhi", "social media marketing delhi", "instagram reels shoot delhi", "restaurant branding", "cafe marketing", "content creation", "delhi diaries official"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-studio-bg text-primary">
        <Preloader />
        <WhatsAppWidget />
        <CustomCursor />
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
