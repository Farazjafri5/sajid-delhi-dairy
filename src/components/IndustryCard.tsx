"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface IndustryCardProps {
  name: string;
  statement: string;
  image: string;
}

function getCategoryUrl(name: string): string {
  const lower = (name || "").toLowerCase();
  if (lower.includes("restaurant") || lower.includes("hospitality")) {
    return "/work?category=restaurant";
  }
  if (lower.includes("cafe") || lower.includes("bakery")) {
    return "/work?category=cafe";
  }
  if (lower.includes("fashion") || lower.includes("lifestyle")) {
    return "/work?category=lifestyle";
  }
  if (lower.includes("beauty") || lower.includes("d2c")) {
    return "/work?category=beauty";
  }
  return "/work";
}

export default function IndustryCard({ name, statement, image }: IndustryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const targetUrl = getCategoryUrl(name);

  return (
    <Link href={targetUrl} className="block w-full">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] bg-[#0A1628] group cursor-pointer shadow-lg hover:shadow-[0_25px_55px_rgba(197,168,128,0.25)] transition-all duration-500 hover:-translate-y-2 text-left"
      >
        {/* Background Image with Cinematic Zoom */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover opacity-75 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-50"
          sizes="(max-width: 768px) 100vw, 25vw"
        />

        {/* Multi-layered Cinema Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070F1B] via-[#0A1628]/40 to-[#0A1628]/25 opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

        {/* Top Floating Badges */}
        <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
          <span className="bg-[#0A1628]/85 text-[#C5A880] border border-[#C5A880]/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">
            ✦ Sector
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A1628]/80 group-hover:bg-[#C5A880] text-white group-hover:text-[#0A1628] border border-white/20 group-hover:border-[#C5A880] backdrop-blur-md transition-all duration-300 shadow-md">
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Content Bottom Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 z-20 flex flex-col justify-end">
          <h3 className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-[#F3E5D0] transition-colors leading-tight">
            {name}
          </h3>

          {/* Statement with Golden Italic Styling */}
          <p className="mt-2 text-xs sm:text-sm italic font-medium text-[#C5A880] leading-snug line-clamp-2 drop-shadow-sm">
            "{statement}"
          </p>

          {/* Subtle Bottom Gold Accent Bar */}
          <div className="mt-4 pt-3 border-t border-[#C5A880]/20 flex items-center justify-between text-[10px] font-bold tracking-wider text-white/60 uppercase group-hover:text-white transition-colors">
            <span>Social Diaries</span>
            <span className="text-[#C5A880]">Explore ➔</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
