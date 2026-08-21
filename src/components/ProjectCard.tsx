"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/data/projects";
import { getOptimizedVideoUrl } from "@/lib/media";

interface ProjectCardProps {
  project: Project;
  asymmetric?: boolean;
}

export default function ProjectCard({ project, asymmetric = false }: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback for autoplay blocks
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group flex flex-col rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F1] to-[#F3ECE1] p-5 sm:p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_55px_rgba(197,168,128,0.22)] overflow-hidden text-left ${
        asymmetric ? "md:odd:translate-y-12" : ""
      }`}
    >
      <Link href={`/work/${project.slug}`} className="block overflow-hidden relative rounded-2xl bg-[#0A1628] shadow-md" data-cursor="view">
        {/* Visual Container */}
        <div className="aspect-[4/3] w-full overflow-hidden relative">
          {/* Main Image */}
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${
              isHovered ? "scale-105" : "scale-100"
            }`}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {/* Hover Video Overlay */}
          {project.video && (
            <video
              ref={videoRef}
              src={getOptimizedVideoUrl(project.video)}
              poster={project.image}
              loop
              muted
              playsInline
              preload="none"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#0A1628]/85 text-[#C5A880] border border-[#C5A880]/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">
              ✦ {project.industry}
            </span>
          </div>

          {/* Top-Right Arrow Action Button */}
          <div className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#0A1628]/80 group-hover:bg-[#C5A880] text-white group-hover:text-[#0A1628] border border-white/20 group-hover:border-[#C5A880] backdrop-blur-md shadow-md transition-all duration-300">
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          {/* Dark Gradient Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 via-transparent to-transparent transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </Link>

      {/* Project Info Panel */}
      <div className="mt-5 flex flex-col">
        <div className="flex items-center justify-between text-xs tracking-wider uppercase font-semibold text-[#C5A880]">
          <span>{project.services[0] || "Campaign"}</span>
          <span className="text-[#0A1628]/40 font-normal">Social Diaries Studio</span>
        </div>

        <Link href={`/work/${project.slug}`} className="mt-2.5 group-hover:text-[#91724B] transition-colors">
          <h3 className="font-serif text-xl font-bold tracking-tight text-[#0A1628] md:text-2xl leading-snug">
            {project.title}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-[#0A1628]/70 line-clamp-2 font-normal leading-relaxed">
          {project.description}
        </p>

        {/* Bottom Case Study Direct Link */}
        <div className="mt-5 pt-4 border-t border-[#C5A880]/20 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A1628]/60 group-hover:text-[#0A1628] transition-colors flex items-center gap-1.5">
            <span>Read Case Study</span>
            <ArrowUpRight size={13} className="text-[#C5A880]" />
          </span>
          <span className="text-[10px] text-[#C5A880] font-bold uppercase tracking-widest bg-[#C5A880]/15 px-2.5 py-0.5 rounded-full">
            Featured
          </span>
        </div>
      </div>
    </div>
  );
}
