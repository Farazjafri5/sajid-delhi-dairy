import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteContent, projects, shouldGitPush } = body;

    // 1. Write siteContent.ts directly to local disk if running locally
    if (siteContent) {
      const siteContentFilePath = path.join(process.cwd(), "src", "data", "siteContent.ts");
      const fileCode = `// Auto-generated from Delhi Diaries Admin Panel
import { SiteContent } from "@/types/siteContent";
export * from "@/types/siteContent";

export const defaultSiteContent: SiteContent = ${JSON.stringify(siteContent, null, 2)};
`;
      try {
        fs.writeFileSync(siteContentFilePath, fileCode, "utf-8");
      } catch (err: any) {
        console.warn("Could not write to local filesystem (e.g. serverless read-only environment):", err.message);
      }
    }

    // 2. Write projects.ts directly to local disk if projects provided
    if (projects && Array.isArray(projects)) {
      const projectsFilePath = path.join(process.cwd(), "src", "data", "projects.ts");
      const projectsCode = `// Auto-generated from Delhi Diaries Admin Panel
export interface Project {
  slug: string;
  client: string;
  title: string;
  subtitle: string;
  industry: string;
  services: string[];
  description: string;
  image: string;
  video: string;
  brief: string;
  idea: string;
  execution: string;
  results: string[];
  gallery: (string | { id?: string; src: string; caption?: string; type?: "image" | "video"; active?: boolean })[];
  reels: (string | { id?: string; src: string; caption?: string; active?: boolean })[];
  active?: boolean;
}

export const projects: Project[] = ${JSON.stringify(projects, null, 2)};
`;
      try {
        fs.writeFileSync(projectsFilePath, projectsCode, "utf-8");
      } catch (err: any) {
        console.warn("Could not write projects to local filesystem:", err.message);
      }
    }

    // 3. If git push requested and running locally, execute git commit & git push directly using system git credentials
    let gitPushResult = null;
    if (shouldGitPush) {
      try {
        const { stdout: commitOut } = await execAsync(
          'git add src/data/siteContent.ts src/data/projects.ts && git commit -m "feat(cms): update content from admin panel" || true',
          { cwd: process.cwd() }
        );
        const { stdout: pushOut } = await execAsync('git push origin main', {
          cwd: process.cwd(),
        });
        gitPushResult = { success: true, message: pushOut || commitOut || "Pushed to GitHub successfully!" };
      } catch (gitErr: any) {
        console.warn("Local git push error:", gitErr.message);
        gitPushResult = { success: false, error: gitErr.message };
      }
    }

    return NextResponse.json({
      success: true,
      message: "Changes saved to codebase successfully!",
      gitPush: gitPushResult,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save changes" },
      { status: 500 }
    );
  }
}
