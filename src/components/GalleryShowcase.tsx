"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";
import { getOptimizedVideoUrl } from "@/lib/media";

interface GalleryShowcaseProps {
  gallery: string[];
  reels: string[];
  client: string;
}

export default function GalleryShowcase({ gallery = [], reels = [], client }: GalleryShowcaseProps) {
  const [activeMedia, setActiveMedia] = useState<{ type: "video" | "image"; src: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => setActiveMedia(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    if (activeMedia) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeMedia]);

  const cleanReels: string[] = (reels || [])
    .filter((r: any) => {
      if (!r) return false;
      if (typeof r === "object") return r.active !== false && !!r.src;
      return typeof r === "string" && r.trim().length > 0;
    })
    .map((r: any) => (typeof r === "object" ? r.src : r));

  const cleanGallery: string[] = (gallery || [])
    .filter((g: any) => {
      if (!g) return false;
      if (typeof g === "object") return g.active !== false && !!g.src;
      return typeof g === "string" && g.trim().length > 0;
    })
    .map((g: any) => (typeof g === "object" ? g.src : g));

  return (
    <div className="space-y-12">
      {/* 🎬 VERTICAL REEL VIDEOS SECTION */}
      {cleanReels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A880]">
              ✦ Campaign Reels ({cleanReels.length})
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cleanReels.map((reelSrc, idx) => (
              <div
                key={idx}
                onClick={() => setActiveMedia({ type: "video", src: getOptimizedVideoUrl(reelSrc) })}
                className="relative aspect-[9/16] bg-[#0A1628] overflow-hidden group cursor-pointer shadow-lg rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] transition-all duration-500 hover:-translate-y-1"
              >
                <video
                  src={getOptimizedVideoUrl(reelSrc)}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-[#0A1628]/30 flex items-center justify-center group-hover:bg-[#0A1628]/15 transition-colors">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#C5A880] via-[#F5E6D3] to-[#C5A880] text-[#0A1628] shadow-[0_0_30px_rgba(197,168,128,0.5)] scale-95 group-hover:scale-110 transition-transform duration-300">
                    <Play fill="currentColor" size={20} className="ml-0.5 text-[#0A1628]" />
                  </div>
                </div>
                {/* Badge Indicator */}
                <div className="absolute bottom-4 left-4 bg-[#0A1628]/85 text-[#C5A880] border border-[#C5A880]/30 text-[9px] tracking-widest uppercase py-1.5 px-3.5 rounded-full font-bold select-none shadow-md backdrop-blur-md">
                  Watch Reel #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📸 HIGH-RES PHOTO GALLERY */}
      {cleanGallery.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A880]">
              ✦ Production Photography ({cleanGallery.length})
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cleanGallery.map((imgSrc, idx) => (
              <div
                key={idx}
                onClick={() => setActiveMedia({ type: "image", src: imgSrc })}
                className="relative aspect-[4/5] bg-[#0A1628] overflow-hidden cursor-pointer group shadow-lg rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] transition-all duration-500 hover:-translate-y-1"
              >
                <img
                  src={imgSrc}
                  alt={`${client} Gallery Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#0A1628]/0 group-hover:bg-[#0A1628]/20 transition-colors duration-500 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-[#0A1628]/85 text-[#C5A880] border border-[#C5A880]/40 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-opacity duration-300 shadow-xl">
                    ✦ Click to Enlarge
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Overlay - Portaled directly into document.body to stay above Navbar (z-[999999]) */}
      {mounted && activeMedia && createPortal(
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#070F1B]/95 p-4 md:p-8 backdrop-blur-2xl cursor-pointer select-none"
          onClick={handleClose}
        >
          {/* Prominent High-Visibility Luxury Close Button (Top-Right) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="fixed top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 bg-[#0A1628] hover:bg-[#C5A880] text-[#C5A880] hover:text-[#0A1628] border border-[#C5A880]/40 hover:border-[#C5A880] px-5 py-2.5 rounded-full z-[1000000] cursor-pointer backdrop-blur-md shadow-2xl transition-all duration-300 group"
            aria-label="Close modal"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Close</span>
            <X size={18} className="transition-transform group-hover:rotate-90" />
          </button>

          {/* Media Frame */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeMedia.type === "video" ? (
              /* Mobile/Reel Vertical Frame (9:16 layout) */
              <div className="relative max-w-sm w-full max-h-[85vh] aspect-[9/16] overflow-hidden rounded-3xl bg-black shadow-2xl border border-[#C5A880]/30">
                <video
                  src={getOptimizedVideoUrl(activeMedia.src)}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              /* Standard high-res image modal with rounded luxury frame */
              <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-[#C5A880]/35 shadow-[0_30px_90px_rgba(0,0,0,0.9)] bg-[#0A1628]">
                <img
                  src={activeMedia.src}
                  alt={`${client} Zoomed Visual`}
                  className="max-h-[82vh] max-w-full w-auto h-auto object-contain cursor-default"
                />
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
