"use client";

import { useState, useEffect } from "react";
import { projects, Project } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import { motion } from "framer-motion";
import { isSupabaseConfigured, supabase } from "@/config/supabase";

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [projectsList, setProjectsList] = useState<Project[]>(projects);

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
        setProjectsList(activeProjects);
      }
    };

    loadDynamicData();
  }, []);

  const filters = ["ALL", "RESTAURANT & HOSPITALITY", "CAFÉ & BAKERY", "FASHION & LIFESTYLE", "D2C BEAUTY"];

  const filteredProjects = projectsList.filter((project) => {
    if (activeFilter === "ALL") return true;
    return project.industry.toUpperCase() === activeFilter;
  });

  return (
    <main className="flex-1 bg-studio-bg pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
            Our Portfolio
          </span>
          <h1 className="mt-4 heading-serif-hero text-primary uppercase">
            Work that does the talking.
          </h1>
          <p className="mt-6 text-base md:text-lg text-studio-muted font-normal max-w-xl">
            A curated selection of social-first campaigns, professional video production, and visual storytelling for brands people remember.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-primary/10 pb-8 mb-16 text-xs font-semibold tracking-widest uppercase text-studio-muted">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`hover:text-primary transition-colors cursor-pointer relative py-2 ${
                activeFilter === filter ? "text-primary" : ""
              }`}
            >
              {filter === "ALL"
                ? "ALL"
                : filter
                    .replace("& HOSPITALITY", "")
                    .replace("& BAKERY", "")
                    .replace("FASHION & ", "")
                    .replace("D2C ", "")}
              {activeFilter === filter && (
                <motion.div
                  layoutId="filter-underline"
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
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
