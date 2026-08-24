"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects, Project } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import { motion } from "framer-motion";
import { isSupabaseConfigured, supabase } from "@/config/supabase";

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [projectsList, setProjectsList] = useState<Project[]>(projects || []);

  useEffect(() => {
    // 1. Sync from LocalStorage cache
    try {
      const cached = localStorage.getItem("dd_projects");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjectsList(parsed);
        }
      }
    } catch (e) {
      console.error("Local storage load error:", e);
    }

    // 2. Sync from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("site_content")
        .select("content")
        .eq("id", "projects")
        .single()
        .then(({ data, error }) => {
          if (data && data.content && Array.isArray(data.content)) {
            setProjectsList(data.content);
            try {
              localStorage.setItem("dd_projects", JSON.stringify(data.content));
            } catch (e) {}
          }
        });
    }

    // 3. Read category from URL query parameters (e.g. /work?category=restaurant)
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get("category")?.toLowerCase();
        if (cat) {
          if (cat.includes("restaurant") || cat.includes("hospitality")) {
            setActiveFilter("RESTAURANT & HOSPITALITY");
          } else if (cat.includes("cafe") || cat.includes("bakery")) {
            setActiveFilter("CAFÉ & BAKERY");
          } else if (cat.includes("lifestyle") || cat.includes("fashion")) {
            setActiveFilter("FASHION & LIFESTYLE");
          } else if (cat.includes("beauty") || cat.includes("d2c")) {
            setActiveFilter("D2C BEAUTY");
          }
        }
      }
    } catch (e) {}
  }, []);

  const activeProjects: Project[] = (projectsList || []).filter(
    (p) => p && p.active !== false && !p.slug.startsWith("inactive:")
  );

  const filters = ["ALL", "RESTAURANT & HOSPITALITY", "CAFÉ & BAKERY", "FASHION & LIFESTYLE", "D2C BEAUTY"];

  const filteredProjects = activeProjects.filter((project) => {
    if (activeFilter === "ALL") return true;
    const ind = (project.industry || "").toUpperCase();
    if (activeFilter === "RESTAURANT & HOSPITALITY" && (ind.includes("RESTAURANT") || ind.includes("HOSPITALITY") || ind.includes("DINING") || ind.includes("FOOD"))) return true;
    if (activeFilter === "CAFÉ & BAKERY" && (ind.includes("CAF") || ind.includes("BAKERY") || ind.includes("COFFEE"))) return true;
    if (activeFilter === "FASHION & LIFESTYLE" && (ind.includes("FASHION") || ind.includes("LIFESTYLE") || ind.includes("APPAREL") || ind.includes("LUXURY"))) return true;
    if (activeFilter === "D2C BEAUTY" && (ind.includes("BEAUTY") || ind.includes("D2C") || ind.includes("SKINCARE") || ind.includes("COSMETIC"))) return true;
    return ind === activeFilter;
  });

  return (
    <main className="flex-1 bg-gradient-to-b from-[#FAF8F5] via-[#FFFFFF] to-[#FAF8F5] max-sm:pb-10 pt-25 pb-24 md:pt-30 md:pb-32 relative overflow-hidden">
      {/* Subtle Ambient Gold Spotlight */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#C5A880]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#DD2A7B]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-8 md:px-16 lg:px-24 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16 max-sm:mb-10 text-left">
          {/* Back Navigation Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#0A1628]/70 hover:text-[#0A1628] bg-white/80 border border-[#C5A880]/35 hover:border-[#C5A880] px-4 py-2 rounded-full mb-6 transition-all duration-300 shadow-sm hover:shadow group w-fit cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft size={14} className="text-[#C5A880] transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/40 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md shadow-sm">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0A1628]">Our Portfolio</span>
            </div>
          </div>
          <h1 className="heading-serif-hero text-[#0A1628] uppercase tracking-tight">
            Work that does the <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#91724B] via-[#C5A880] to-[#91724B] drop-shadow-[0_2px_15px_rgba(197,168,128,0.25)]">
              talking.
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-[#0A1628]/70 font-medium max-w-2xl leading-relaxed">
            A curated selection of social-first campaigns, professional video production, and visual storytelling for brands people remember.
          </p>
        </div>

        {/* Interactive Luxury Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pb-6 mb-16 max-sm:mb-10 border-b border-[#C5A880]/20">
          {filters.map((filter) => {
            const isSelected = activeFilter === filter;
            const label = filter === "ALL"
              ? "All Projects"
              : filter
                  .replace("& HOSPITALITY", "")
                  .replace("& BAKERY", "")
                  .replace("FASHION & ", "")
                  .replace("D2C ", "");

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-[#0A1628] text-[#C5A880] shadow-[0_4px_20px_rgba(10,22,40,0.18)] scale-105"
                    : "bg-white/80 border border-[#C5A880]/30 text-[#0A1628]/70 hover:text-[#0A1628] hover:border-[#C5A880] hover:bg-white shadow-sm"
                }`}
              >
                <span className="flex items-center gap-2">
                  {isSelected && <span className="text-[#C5A880] text-xs">✦</span>}
                  <span>{label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 max-sm:gap-y-5 ">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} asymmetric={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-studio-muted">No projects found for this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
