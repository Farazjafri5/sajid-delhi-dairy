"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Button from "@/components/Button";
import AnimatedCounter from "@/components/AnimatedCounter";
import GalleryShowcase from "@/components/GalleryShowcase";
import { Project } from "@/data/projects";
import { isSupabaseConfigured, supabase } from "@/config/supabase";

interface CaseStudyClientProps {
  initialProject: Project;
  initialNextProject: Project;
  slug: string;
}

export default function CaseStudyClient({
  initialProject,
  initialNextProject,
  slug,
}: CaseStudyClientProps) {
  const [project, setProject] = useState<Project>(initialProject);
  const [nextProject, setNextProject] = useState<Project>(initialNextProject);

  useEffect(() => {
    const loadDynamicData = async () => {
      let activeProjects: Project[] = [];

      // Check Supabase if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("projects").select("*");
          if (data && data.length > 0 && !error) {
            activeProjects = data as Project[];
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Check localStorage
      const local = localStorage.getItem("dd_projects");
      if (local) {
        try {
          activeProjects = JSON.parse(local);
        } catch (e) {
          console.error(e);
        }
      }

      if (activeProjects.length > 0) {
        const pIndex = activeProjects.findIndex((p: Project) => p.slug === slug);
        if (pIndex !== -1) {
          setProject(activeProjects[pIndex]);
          const nextIndex = (pIndex + 1) % activeProjects.length;
          setNextProject(activeProjects[nextIndex]);
        }
      }
    };

    loadDynamicData();
  }, [slug]);

  // Helper to filter out inactive items (prefixed with "inactive:")
  const activeGallery = project.gallery.filter((url) => !url.startsWith("inactive:"));
  const activeReels = project.reels.filter((url) => !url.startsWith("inactive:"));

  return (
    <article className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
      {/* 1. Header (Brief Statement) */}
      <header className="max-w-4xl mb-16">
        <Link
          href="/work"
          className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-studio-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Work
        </Link>
        <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
          Case Study — {project.client}
        </span>
        <h1 className="mt-4 heading-serif-hero text-primary uppercase">
          {project.title}
        </h1>

        <p className="mt-6 text-xl font-normal leading-relaxed text-studio-muted">
          {project.subtitle}
        </p>
      </header>

      {/* Hero Banner (Cinematic scale) */}
      <div className="relative aspect-video w-full overflow-hidden bg-studio-accent mb-20">
        <Image
          src={project.image}
          alt={`${project.client} Case Study Hero`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
      </div>

      {/* Campaign Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-primary/10 pb-16 mb-20 text-sm">
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-studio-muted mb-3">Client</h4>
          <p className="text-primary font-medium">{project.client}</p>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-studio-muted mb-3">Industry</h4>
          <p className="text-primary font-medium">{project.industry}</p>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-studio-muted mb-3">Services</h4>
          <div className="flex flex-wrap gap-2">
            {project.services.map((service, idx) => (
              <span
                key={idx}
                className="inline-block border border-primary/15 px-3 py-1 text-xs tracking-wide text-studio-muted"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* The Brief & The Idea Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">01 / THE BRIEF</span>
          <h2 className="heading-serif-section text-primary uppercase">The Challenge</h2>
          <p className="text-base text-studio-muted leading-relaxed font-normal">
            {project.brief}
          </p>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">02 / THE IDEA</span>
          <h2 className="heading-serif-section text-primary uppercase italic font-normal">The Creative Strategy</h2>
          <p className="text-base text-studio-muted leading-relaxed font-normal">
            {project.idea}
          </p>
        </div>
      </div>

      {/* The Execution (Full Width Statement & Gallery) */}
      <div className="border-t border-primary/10 pt-16 mb-24">
        <div className="max-w-3xl mb-12">
          <span className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">03 / THE EXECUTION</span>
          <h2 className="mt-4 heading-serif-section text-primary uppercase mb-6">On-Ground Production</h2>
          <p className="text-base text-studio-muted leading-relaxed font-normal">
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

      {/* Results Panel (Metrics) */}
      <div className="bg-primary text-studio-bg p-8 md:p-16 mb-24">
        <span className="text-[10px] font-bold tracking-widest uppercase text-studio-accent/60">04 / THE RESULTS</span>
        <h2 className="mt-4 heading-serif-section text-studio-bg uppercase mb-12">
          Impact That Matters
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {project.results.map((result, idx) => {
            const parts = result.split(" ");
            const metric = parts[0];
            const label = parts.slice(1).join(" ");
            return (
              <div key={idx} className="flex flex-col border-l border-studio-accent/20 pl-6">
                <span className="font-serif text-4xl md:text-5xl font-bold text-studio-accent">
                  <AnimatedCounter value={metric} />
                </span>
                <span className="text-xs tracking-wider uppercase text-studio-accent/60 mt-3 font-normal">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action segment */}
      <div className="border-t border-primary/10 pt-16 flex flex-col md:flex-row items-center justify-between gap-8 mb-32">
        <div className="max-w-xl">
          <h3 className="font-serif text-2xl font-bold uppercase text-primary">
            Want similar attention for your brand?
          </h3>
          <p className="text-sm text-studio-muted mt-2 font-normal">
            Let's craft your unique Instagram visual language and drive actual table bookings or e-commerce orders.
          </p>
        </div>
        <Link href="/contact">
          <Button variant="primary">Start a Project →</Button>
        </Link>
      </div>

      {/* Next Case Study Slider */}
      <footer className="border-t border-primary/10 pt-12 flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest uppercase text-studio-muted">Next Case Study</span>
        <Link
          href={`/work/${nextProject.slug}`}
          className="group flex items-center gap-4 text-right hover:text-studio-muted transition-colors"
        >
          <div>
            <span className="block text-[10px] tracking-widest uppercase text-studio-muted">Next Project</span>
            <span className="block font-serif text-lg font-bold text-primary mt-1 group-hover:text-studio-muted transition-colors">
              {nextProject.client}
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/10 group-hover:bg-primary group-hover:text-studio-bg transition-colors duration-300">
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </footer>
    </article>
  );
}
