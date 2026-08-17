"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface GalleryShowcaseProps {
  gallery: string[];
  reels: string[];
  client: string;
}

export default function GalleryShowcase({ gallery, reels, client }: GalleryShowcaseProps) {
  const [activeMedia, setActiveMedia] = useState<{ type: "video" | "image"; src: string } | null>(null);

  const handleClose = () => setActiveMedia(null);

  const videoSrc = reels && reels.length > 0 ? reels[0] : null;

  return (
    <div className="space-y-6">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Video Preview (Reel) */}
        {videoSrc ? (
          <div
            onClick={() => setActiveMedia({ type: "video", src: videoSrc })}
            className="relative aspect-[4/5] bg-studio-accent overflow-hidden group cursor-pointer shadow-sm rounded-sm"
          >
            <video
              src={videoSrc}
              muted
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover hover:scale-103 transition-transform duration-700 pointer-events-none"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-studio-bg text-primary shadow-xl scale-95 group-hover:scale-100 transition-transform duration-300">
                <Play fill="currentColor" size={16} className="ml-0.5" />
              </div>
            </div>
            {/* Badge Indicator */}
            <div className="absolute bottom-4 left-4 bg-[#C5A880] text-[#1A1715] text-[8px] tracking-widest uppercase py-1 px-3 rounded-full font-bold select-none shadow-sm">
              Watch Reel
            </div>
          </div>
        ) : (
          /* Fallback to first image if no video reel is present */
          <div
            onClick={() => setActiveMedia({ type: "image", src: gallery[0] })}
            className="relative aspect-[4/5] bg-studio-accent overflow-hidden cursor-pointer group shadow-sm rounded-sm"
          >
            <Image
              src={gallery[0]}
              alt={`${client} Showcase 1`}
              fill
              className="object-cover hover:scale-103 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}

        {/* Column 2: Showcase Image 2 */}
        {gallery.length > 1 && (
          <div
            onClick={() => setActiveMedia({ type: "image", src: gallery[1] })}
            className="relative aspect-[4/5] bg-studio-accent overflow-hidden cursor-pointer group shadow-sm rounded-sm"
          >
            <Image
              src={gallery[1]}
              alt={`${client} Showcase 2`}
              fill
              className="object-cover hover:scale-103 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
          </div>
        )}

        {/* Column 3: Showcase Image 3 */}
        {gallery.length > 2 && (
          <div
            onClick={() => setActiveMedia({ type: "image", src: gallery[2] })}
            className="relative aspect-[4/5] bg-studio-accent overflow-hidden cursor-pointer group shadow-sm rounded-sm"
          >
            <Image
              src={gallery[2]}
              alt={`${client} Showcase 3`}
              fill
              className="object-cover hover:scale-103 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
          </div>
        )}
      </div>

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
                  src={activeMedia.src}
                  controls
                  autoPlay
                  playsInline
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
