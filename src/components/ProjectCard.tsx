"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
      className={`group flex flex-col ${asymmetric ? "md:odd:translate-y-12" : ""}`}
    >
      <Link href={`/work/${project.slug}`} className="block overflow-hidden relative bg-studio-accent" data-cursor="view">
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

          {/* Dark Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-primary/10 transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </Link>

      {/* Project Info Panel */}
      <div className="mt-6 flex flex-col">
        <div className="flex items-center justify-between text-xs tracking-wider uppercase text-studio-muted">
          <span>{project.industry}</span>
          <span>{project.services[0]}</span>
        </div>
        <Link href={`/work/${project.slug}`} className="mt-2 group-hover:text-studio-muted transition-colors">
          <h3 className="font-serif text-xl font-bold tracking-tight text-primary md:text-2xl">
            {project.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-studio-muted line-clamp-2 font-normal leading-relaxed">
          {project.description}
        </p>
      </div>
    </div>
  );
}
