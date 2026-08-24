"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import GalleryShowcase from "@/components/GalleryShowcase";
import { Project } from "@/data/projects";

interface CaseStudyClientProps {
  initialProject: Project;
  initialNextProject: Project;
  slug: string;
}

export default function CaseStudyClient({
  initialProject,
  initialNextProject,
}: CaseStudyClientProps) {
  const project: Project = initialProject;
  const nextProject: Project = initialNextProject;

  // Helper to filter out inactive items and convert to string URL array
  const activeGallery: string[] = (project.gallery || [])
    .filter((item) => (typeof item === "string" ? !item.startsWith("inactive:") : item.active !== false))
    .map((item) => (typeof item === "string" ? item : item.src));

  const activeReels: string[] = (project.reels || [])
    .filter((item) => (typeof item === "string" ? !item.startsWith("inactive:") : item.active !== false))
    .map((item) => (typeof item === "string" ? item : item.src));

  return (
    <article className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 relative z-10">
      {/* Subtle Ambient Gold Spotlight */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#C5A880]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#DD2A7B]/8 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. Header (Brief Statement) */}
      <header className="max-w-4xl mb-14 max-sm:mb-10 text-left">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#0A1628]/70 hover:text-[#0A1628] bg-white/80 border border-[#C5A880]/35 hover:border-[#C5A880] px-4 py-2 rounded-full mb-6 transition-all duration-300 shadow-sm hover:shadow group w-fit cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft size={14} className="text-[#C5A880] transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Work</span>
        </Link>
        <div>
          <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/40 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md shadow-sm">
            <span className="text-[#C5A880] text-xs">✦</span>
            <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0A1628]">
              Case Study • {project.client}
            </span>
          </div>
        </div>
        <h1 className="heading-serif-hero text-[#0A1628] uppercase tracking-tight">
          {project.title}
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl font-medium leading-relaxed text-[#0A1628]/70 max-w-2xl">
          {project.subtitle}
        </p>
      </header>

      {/* Hero Banner (Cinematic scale with rounded luxury frame) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-[#C5A880]/35 bg-[#0A1628] shadow-2xl mb-16 max-sm:mb-10 group">
        <Image
          src={project.image}
          alt={`${project.client} Case Study Hero`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent pointer-events-none" />
        
        {/* Floating Brand Badge */}
        <div className="absolute bottom-6 left-6 z-20">
          <span className="bg-[#0A1628]/85 text-[#C5A880] border border-[#C5A880]/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-md">
            ✦ {project.client}
          </span>
        </div>
      </div>

      {/* Campaign Metadata Grid (Luxury Frosted Ribbon) */}
      <div className="rounded-3xl border border-[#C5A880]/30 bg-white/80 p-6 md:p-8 backdrop-blur-md shadow-sm mb-20 max-sm:mb-5 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest uppercase text-[#C5A880] mb-2">
            <span>✦</span>
            <span>Client Partner</span>
          </div>
          <p className="text-[#0A1628] font-bold text-base">{project.client}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest uppercase text-[#C5A880] mb-2">
            <span>✦</span>
            <span>Industry Sector</span>
          </div>
          <p className="text-[#0A1628] font-bold text-base">{project.industry}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest uppercase text-[#C5A880] mb-2">
            <span>✦</span>
            <span>Scope of Work</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.services.map((service, idx) => (
              <span
                key={idx}
                className="inline-block bg-[#0A1628]/5 border border-[#C5A880]/35 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-[#0A1628]"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* The Brief & The Idea Sections (2 Luxury Editorial Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 max-sm:mb-5 text-left">
        {/* Card 1: Challenge / Brief */}
        <div className="group relative rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F1] to-[#F3ECE1] p-8 md:p-10 shadow-sm hover:shadow-[0_20px_45px_rgba(197,168,128,0.22)] transition-all duration-500 overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A880] via-[#F3E5D0] to-[#C5A880]" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#0A1628] via-[#91724B] to-[#C5A880] leading-none">
                01
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#C5A880] bg-white/80 border border-[#C5A880]/30 px-3 py-1 rounded-full">✦ The Challenge</span>
            </div>
            <h2 className="heading-serif-section text-[#0A1628] uppercase tracking-tight">The Brief</h2>
            <p className="text-sm md:text-base text-[#0A1628]/70 leading-relaxed font-normal mt-4">
              {project.brief}
            </p>
          </div>
        </div>

        {/* Card 2: Strategy / Idea */}
        <div className="group relative rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F1] to-[#F3ECE1] p-8 md:p-10 shadow-sm hover:shadow-[0_20px_45px_rgba(197,168,128,0.22)] transition-all duration-500 overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A880] via-[#F3E5D0] to-[#C5A880]" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#0A1628] via-[#91724B] to-[#C5A880] leading-none">
                02
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#C5A880] bg-white/80 border border-[#C5A880]/30 px-3 py-1 rounded-full">✦ The Strategy</span>
            </div>
            <h2 className="heading-serif-section text-[#0A1628] uppercase tracking-tight">Creative Direction</h2>
            <p className="text-sm md:text-base text-[#0A1628]/70 leading-relaxed font-normal mt-4">
              {project.idea}
            </p>
          </div>
        </div>
      </div>

      {/* The Execution (Full Width Statement & Gallery) */}
      <div className="border-t border-[#C5A880]/20 pt-16 mb-24 max-sm:pt-5 max-sm:mb-5 text-left">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/40 px-4 py-1.5 rounded-full mb-3 backdrop-blur-md shadow-sm">
            <span className="text-[#C5A880] text-xs">✦</span>
            <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0A1628]">03 / On-Ground Production</span>
          </div>
          <h2 className="mt-2 heading-serif-section text-[#0A1628] uppercase tracking-tight">
            The <span className="bg-gradient-to-r from-[#0A1628] via-[#91724B] to-[#C5A880] bg-clip-text text-transparent">Execution.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#0A1628]/70 leading-relaxed font-normal mt-4">
            {project.execution}
          </p>
        </div>

        {/* Gallery Showcase Client component with looped video preview and mobile-aspect lightbox */}
        <GalleryShowcase
          gallery={activeGallery}
          reels={activeReels}
          client={project.client}
        />
      </div>

      {/* Results Panel (Midnight Obsidian Luxury Metrics Card) */}
      <div className="rounded-3xl border border-[#C5A880]/35 bg-gradient-to-b from-[#070F1B] via-[#0A1628] to-[#070F1B] text-white p-8 md:p-14 shadow-2xl relative overflow-hidden mb-24 max-sm:mb-5 text-left">
        {/* Ambient Cinema Spotlight */}
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[#C5A880]/12 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md">
            <span className="text-[#C5A880] text-xs">✦</span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A880]">04 / Verified Impact</span>
          </div>
          <h2 className="mt-2 heading-serif-section uppercase text-white tracking-tight mb-12">
            Impact that <br />
            <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F5E6D3] to-[#C5A880] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(197,168,128,0.25)]">
              moves numbers.
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {project.results.map((result, idx) => {
              const parts = result.split(" ");
              const metric = parts[0];
              const label = parts.slice(1).join(" ");
              return (
                <div key={idx} className="flex flex-col border-l-2 border-[#C5A880]/40 pl-6">
                  <span className="font-serif text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#F5E6D3] to-[#C5A880]">
                    <AnimatedCounter value={metric} />
                  </span>
                  <span className="text-xs tracking-wider uppercase text-[#C5A880] mt-3 font-semibold">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call to Action segment */}
      <div className="rounded-3xl border border-[#C5A880]/30 bg-white/90 p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 mb-24 max-sm:mb-5 text-left backdrop-blur-md">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/40 px-3.5 py-1 rounded-full mb-3">
            <span className="text-[#C5A880] text-xs">✦</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#0A1628]">Scale Your Brand</span>
          </div>
          <h3 className="font-serif text-2xl font-bold uppercase text-[#0A1628]">
            Want similar attention for your brand?
          </h3>
          <p className="text-sm text-[#0A1628]/70 mt-2 font-normal">
            Let's craft your unique Instagram visual language and drive actual customer desire and reservations.
          </p>
        </div>
        <Link 
          href="/contact" 
          className="group flex items-center gap-3 rounded-full bg-[#0A1628] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0A1628] px-8 py-4 text-xs font-bold tracking-widest uppercase shadow-[0_10px_25px_rgba(10,22,40,0.18)] transition-all duration-300 cursor-pointer shrink-0"
        >
          <span>Start a Project</span>
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Next Case Study Slider Capsule */}
      <footer className="border-t border-[#C5A880]/20 pt-10 pb-6 flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest uppercase text-[#0A1628]/60">Next Case Study</span>
        <Link
          href={`/work/${nextProject.slug}`}
          className="group flex items-center gap-4 text-right hover:text-[#91724B] transition-colors"
        >
          <div>
            <span className="block text-[10px] tracking-widest uppercase text-[#C5A880] font-bold">Explore Next</span>
            <span className="block font-serif text-lg font-bold text-[#0A1628] mt-0.5 group-hover:text-[#91724B] transition-colors">
              {nextProject.client} 
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A880]/40 bg-white group-hover:bg-[#0A1628] group-hover:text-[#C5A880] group-hover:border-[#0A1628] transition-all duration-300 shadow-sm">
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </footer>
    </article>
  );
}
