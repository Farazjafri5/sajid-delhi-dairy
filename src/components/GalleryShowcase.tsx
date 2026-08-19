"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { getOptimizedVideoUrl } from "@/lib/media";

interface GalleryShowcaseProps {
  gallery: string[];
  reels: string[];
  client: string;
}

export default function GalleryShowcase({ gallery = [], reels = [], client }: GalleryShowcaseProps) {
  const [activeMedia, setActiveMedia] = useState<{ type: "video" | "image"; src: string } | null>(null);

  const handleClose = () => setActiveMedia(null);

  const cleanReels = (reels || []).filter(Boolean);
  const cleanGallery = (gallery || []).filter(Boolean);

  return (
    <div className="space-y-12">
      {/* 🎬 VERTICAL REEL VIDEOS SECTION (All active reels rendered dynamically) */}
      {cleanReels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
              Campaign Reels ({cleanReels.length})
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cleanReels.map((reelSrc, idx) => (
              <div
                key={idx}
                onClick={() => setActiveMedia({ type: "video", src: getOptimizedVideoUrl(reelSrc) })}
                className="relative aspect-[9/16] bg-studio-accent overflow-hidden group cursor-pointer shadow-md rounded-2xl border border-primary/10"
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
                <div className="absolute inset-0 bg-primary/15 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-studio-bg text-primary shadow-xl scale-95 group-hover:scale-110 transition-transform duration-300">
                    <Play fill="currentColor" size={18} className="ml-0.5" />
                  </div>
                </div>
                {/* Badge Indicator */}
                <div className="absolute bottom-4 left-4 bg-[#C5A880] text-[#1A1715] text-[9px] tracking-widest uppercase py-1.5 px-3.5 rounded-full font-bold select-none shadow-sm">
                  Watch Reel #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📸 HIGH-RES PHOTO GALLERY (All active gallery images rendered dynamically) */}
      {cleanGallery.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
              Production Photography ({cleanGallery.length})
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cleanGallery.map((imgSrc, idx) => (
              <div
                key={idx}
                onClick={() => setActiveMedia({ type: "image", src: imgSrc })}
                className="relative aspect-[4/5] bg-studio-accent overflow-hidden cursor-pointer group shadow-sm rounded-xl border border-primary/10"
              >
                <img
                  src={imgSrc}
                  alt={`${client} Gallery Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Overlay */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1A1715]/95 p-4 md:p-6 backdrop-blur-md cursor-pointer select-none"
          onClick={handleClose}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-studio-bg hover:text-[#C5A880] transition-colors p-2 z-[10000] cursor-pointer"
            aria-label="Close"
          >
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Media Frame */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeMedia.type === "video" ? (
              /* Mobile/Reel Vertical Frame (9:16 layout) */
              <div className="relative max-w-sm w-full max-h-[85vh] aspect-[9/16] overflow-hidden rounded-xl bg-black shadow-2xl border border-white/5">
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
              /* Standard high-res image modal */
              <img
                src={activeMedia.src}
                alt="Showcase Zoomed"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/5 cursor-default"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
