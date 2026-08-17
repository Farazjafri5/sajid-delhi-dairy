import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import CaseStudyClient from "@/components/CaseStudyClient";

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  
  if (projectIndex === -1) {
    notFound();
  }

  const project = projects[projectIndex];
  
  // Find next project for the bottom slider
  const nextProjectIndex = (projectIndex + 1) % projects.length;
  const nextProject = projects[nextProjectIndex];

  return (
    <main className="flex-1 bg-studio-bg pt-32 pb-24 md:pt-40 md:pb-32">
      <CaseStudyClient
        initialProject={project}
        initialNextProject={nextProject}
        slug={slug}
      />
    </main>
  );
}
