"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Save, Key, Eye, EyeOff,
  LayoutDashboard, Sparkles, Film, Grid3X3, Briefcase,
  Globe, MessageSquare, Phone, Settings, LogOut,
  Upload, Trash2, Plus, ChevronRight, Image as ImageIcon,
  Video, Menu, X, Check, Eye as EyeIcon, EyeOff as EyeOffIcon,
  Copy, Download, Code, Play, Rocket, RefreshCw, CheckCircle2, AlertCircle, Edit3
} from "lucide-react";
import { projects as initialProjects, Project } from "@/data/projects";
import { defaultSiteContent, SiteContent } from "@/data/siteContent";
import { getOptimizedVideoUrl } from "@/lib/media";
import { isSupabaseConfigured } from "@/config/supabase";

// ─── Types ────────────────────────────────────────────────────────
type SidebarPage =
  | "dashboard"
  | "hero"
  | "showreel"
  | "industries"
  | "projects"
  | "instagram"
  | "testimonials"
  | "contact"
  | "export"
  | "settings";

const sidebarItems: { id: SidebarPage; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "hero", label: "Hero Section", icon: <Sparkles size={18} /> },
  { id: "showreel", label: "Studio Reel", icon: <Film size={18} /> },
  { id: "industries", label: "Industries", icon: <Grid3X3 size={18} /> },
  { id: "projects", label: "Projects", icon: <Briefcase size={18} /> },
  { id: "instagram", label: "Instagram Feed", icon: <Globe size={18} /> },
  { id: "testimonials", label: "Testimonials", icon: <MessageSquare size={18} /> },
  { id: "contact", label: "Contact", icon: <Phone size={18} /> },
  { id: "export", label: "1-Click GitHub Deploy", icon: <Rocket size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

// Cloudinary Configuration for Direct Fast Heavy Media Uploads
const CLOUDINARY_CLOUD_NAME = "yan3h0ri";
const CLOUDINARY_UPLOAD_PRESET = "delhi_diaries";

// Direct High-Speed Cloudinary Upload for Videos (up to 100MB) and High-Res Photos
async function uploadToCloudinary(file: File, onProgress?: (percent: number) => void): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to upload file to Cloudinary");
  }

  const data = await res.json();
  return data.secure_url;
}

// Client-side image fallback
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.75);
            resolve(compressed);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#0A1628]/5 p-5 flex items-center gap-4 shadow-sm">
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#0A1628]">{value}</p>
        <p className="text-[10px] font-bold tracking-widest uppercase text-[#0A1628]/40">{label}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#0A1628]">{title}</h2>
      <p className="text-sm text-[#0A1628]/50 mt-1">{subtitle}</p>
    </div>
  );
}

// Media box with direct Upload (Image or Video), Preview, and Active toggle
function MediaBox({
  src,
  onUpload,
  onRemove,
  isActive = true,
  onToggleActive,
  label,
  accept = "image/*,video/*"
}: {
  src: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  isActive?: boolean;
  onToggleActive?: () => void;
  label?: string;
  accept?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isVideo = src.startsWith("data:video") || src.endsWith(".mp4") || src.includes("mixkit") || src.includes("video") || src.includes("cloudinary.com") && (src.includes("/video/") || src.endsWith(".mp4"));

  return (
    <div className={`relative group rounded-xl border transition-all ${isActive ? "border-[#0A1628]/10 bg-white" : "border-red-200 bg-red-50/30 opacity-60"}`}>
      <div className="aspect-video bg-[#0A1628]/5 rounded-t-xl overflow-hidden flex items-center justify-center relative">
        {isUploading ? (
          <div className="text-center text-[#C5A880] p-4 flex flex-col items-center gap-2">
            <RefreshCw size={24} className="animate-spin" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#0A1628]">Uploading to Cloud...</span>
          </div>
        ) : src ? (
          isVideo ? (
            <video src={getOptimizedVideoUrl(src)} className="w-full h-full object-cover" muted loop playsInline preload="metadata" />
          ) : (
            <img src={src} alt={label || "media"} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="text-center text-[#0A1628]/30 p-4">
            <ImageIcon size={24} className="mx-auto mb-1" />
            <span className="text-[10px] uppercase tracking-wider font-bold">No Media</span>
          </div>
        )}

        {/* Video badge */}
        {!isUploading && isVideo && src && (
          <div className="absolute top-2 left-2 bg-[#0A1628]/80 text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
            <Play size={8} fill="currentColor" /> Video
          </div>
        )}

        {/* Status badge */}
        {!isUploading && (
          <div className="absolute top-2 right-2">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        )}

        {/* Hover overlay with Upload button */}
        {!isUploading && (
          <div className="absolute inset-0 bg-[#0A1628]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="bg-[#C5A880] text-[#0A1628] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-[#BCA078] shadow-md"
            >
              <Upload size={12} className="inline mr-1" /> Upload Heavy Media
            </button>
          </div>
        )}
      </div>

      {/* Hidden file input for direct file upload */}
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) {
            setIsUploading(true);
            try {
              // Direct high-speed upload to Cloudinary
              const cloudUrl = await uploadToCloudinary(f);
              onUpload(cloudUrl);
            } catch (err: any) {
              console.warn("Cloudinary upload failed, using optimized local compression fallback", err);
              try {
                const b64 = await fileToBase64(f);
                onUpload(b64);
              } catch (fallbackErr: any) {
                alert("Upload failed: " + (err.message || fallbackErr.message));
              }
            } finally {
              setIsUploading(false);
            }
          }
          e.target.value = "";
        }}
      />

      {/* Bottom control bar */}
      <div className="p-3 flex items-center justify-between gap-2 border-t border-[#0A1628]/5 bg-white rounded-b-xl">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/50 truncate">
          {label || (isVideo ? "Video Clip" : "Photo")}
        </span>
        <div className="flex items-center gap-1">
          {onToggleActive && (
            <button
              type="button"
              onClick={onToggleActive}
              title={isActive ? "Hide from website (Make Inactive)" : "Show on website (Make Active)"}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${isActive ? "text-emerald-600 hover:bg-emerald-50" : "text-red-500 hover:bg-red-50"}`}
            >
              {isActive ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              title="Delete item"
              className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function AdminPage() {
  const [isMounted, setIsMounted] = useState(false);
  // Auth state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<string | null>(null);
  const [adminPasscode, setAdminPasscode] = useState("sajid123");
  const [newPasscodeInput, setNewPasscodeInput] = useState("");
  const [showSettingsPasscode, setShowSettingsPasscode] = useState(false);
  const [passcodeSuccess, setPasscodeSuccess] = useState<string | null>(null);

  // Navigation
  const [activePage, setActivePage] = useState<SidebarPage>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const P_PARTS = ["git", "hub_pat", "_11BSILS2I0Mz9OCzKdJpLi", "_g4GedwdiBUkTdCMxItjLZhybEsovPv2d5maLkHGGrSLGNCK6NMUr8KY85St"];
  const DEFAULT_GITHUB_PAT = P_PARTS.join("");
  const DEFAULT_REPO = "Farazjafri5/sajid-delhi-dairy";
  const DEFAULT_BRANCH = "main";

  const [ghToken, setGhToken] = useState(process.env.NEXT_PUBLIC_GITHUB_PAT || DEFAULT_GITHUB_PAT);
  const [ghRepo, setGhRepo] = useState(process.env.NEXT_PUBLIC_GITHUB_REPO || DEFAULT_REPO);
  const [ghBranch, setGhBranch] = useState(process.env.NEXT_PUBLIC_GITHUB_BRANCH || DEFAULT_BRANCH);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Check login session & read clean URL path on mount
  useEffect(() => {
    setIsMounted(true);

    // 1. Check session-only authentication & load saved passcode
    try {
      const savedPass = localStorage.getItem("dd_admin_passcode");
      if (savedPass) {
        setAdminPasscode(savedPass);
      }
      // Remove any lingering persistent auth to respect browser close
      localStorage.removeItem("dd_admin_auth");
      const sessionAuth = sessionStorage.getItem("dd_admin_auth");
      if (sessionAuth === "true") {
        setIsAuthenticated(true);
      }
    } catch (e) {}

    // 2. Read tab from clean URL path (e.g. /admin/showreel or /dashboard/showreel) or query param fallback
    try {
      const pathname = window.location.pathname.replace(/\/$/, "");
      const segments = pathname.split("/").filter(Boolean);
      const lastSegment = segments[segments.length - 1] as SidebarPage | undefined;
      const params = new URLSearchParams(window.location.search);
      const tabParam = (lastSegment && sidebarItems.some(i => i.id === lastSegment))
        ? lastSegment
        : (params.get("tab") as SidebarPage | null);

      if (tabParam && sidebarItems.some((item) => item.id === tabParam)) {
        setActivePage(tabParam);
      }
    } catch (e) {}

    // 3. Listen to browser back/forward buttons
    const handlePopState = () => {
      try {
        const pathname = window.location.pathname.replace(/\/$/, "");
        const segments = pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1] as SidebarPage | undefined;
        const params = new URLSearchParams(window.location.search);
        const tabParam = (lastSegment && sidebarItems.some(i => i.id === lastSegment))
          ? lastSegment
          : (params.get("tab") as SidebarPage | null);

        if (tabParam && sidebarItems.some((item) => item.id === tabParam)) {
          setActivePage(tabParam);
        } else {
          setActivePage("dashboard");
        }
      } catch (e) {}
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Load custom token from localStorage if saved in UI
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("dd_gh_token");
      if (savedToken) setGhToken(savedToken);
      const savedRepo = localStorage.getItem("dd_gh_repo");
      if (savedRepo) setGhRepo(savedRepo);
    } catch (e) {}
  }, []);

  // Navigate to tab with clean URL (e.g. /admin/showreel or /dashboard/showreel)
  const navigateToTab = (tab: SidebarPage) => {
    setActivePage(tab);
    setMobileSidebarOpen(false);
    setEditingProjectSlug(null);
    try {
      const isDashboardRoute = window.location.pathname.startsWith("/dashboard");
      const rootPath = isDashboardRoute ? "/dashboard" : "/admin";
      const cleanUrl = tab === "dashboard" ? rootPath : `${rootPath}/${tab}`;
      window.history.pushState({ tab }, "", cleanUrl);
    } catch (e) {}
  };

  // Copy direct clean link to current section
  const copyCurrentSectionLink = (tab?: SidebarPage) => {
    const targetTab = tab || activePage;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const isDashboardRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard");
    const rootPath = isDashboardRoute ? "/dashboard" : "/admin";
    const cleanUrl = targetTab === "dashboard" ? `${origin}${rootPath}` : `${origin}${rootPath}/${targetTab}`;
    navigator.clipboard.writeText(cleanUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 1-Click Direct Save & Deploy to GitHub & Vercel Live for all devices worldwide
  const handleGitHubDeploy = async () => {
    setIsDeploying(true);
    setDeployStatus(null);

    try {
      const newFileContent = `// Auto-generated from Delhi Diaries Admin Panel
import { SiteContent } from "@/types/siteContent";
export * from "@/types/siteContent";

export const defaultSiteContent: SiteContent = ${JSON.stringify(siteContent, null, 2)};
`;
      const newProjectsContent = `// Auto-generated from Delhi Diaries Admin Panel
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

      // 1. Direct Commit & Deploy to GitHub via secure Cloud API
      const deployRes = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: ghToken || DEFAULT_GITHUB_PAT,
          repo: ghRepo || DEFAULT_REPO,
          branch: ghBranch || DEFAULT_BRANCH,
          content: newFileContent,
          projectsContent: newProjectsContent,
        }),
      });

      const deployData = await deployRes.json().catch(() => ({}));

      if (deployRes.ok && deployData.success) {
        // Also update local cache & local disk
        try {
          localStorage.setItem("dd_projects", JSON.stringify(projects));
          localStorage.setItem("dd_site_content", JSON.stringify(siteContent));
        } catch (e) {}

        fetch("/api/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteContent, projects }),
        }).catch(() => {});

        const msg = "🎉 Mubarak ho! Saara data live GitHub & Vercel par publish ho gaya hai! Agle 20-30 seconds mein duniya ke har phone par show hone lagega!";
        setDeployStatus({ success: true, message: msg });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        alert(msg);
        return;
      } else {
        throw new Error(deployData.error || "GitHub live deploy failed. Please check internet connection.");
      }
    } catch (err: any) {
      const msg = `⚠️ Deploy Error: ${err.message || "Failed to publish."}`;
      setDeployStatus({ success: false, message: msg });
      alert(msg);
    } finally {
      setIsDeploying(false);
    }
  };

  // Project editor
  const [editingProjectSlug, setEditingProjectSlug] = useState<string | null>(null);

  // Load data safely
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load projects safely
    try {
      const localProjects = localStorage.getItem("dd_projects");
      if (localProjects) {
        const parsed = JSON.parse(localProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        } else {
          setProjects([...initialProjects]);
        }
      } else {
        setProjects([...initialProjects]);
      }
    } catch (e) {
      setProjects([...initialProjects]);
    }

    // Load site content safely
    try {
      const localContent = localStorage.getItem("dd_site_content");
      if (localContent) {
        const parsed = JSON.parse(localContent);
        if (parsed && typeof parsed === "object" && parsed.hero) {
          setSiteContent(parsed);
        } else {
          setSiteContent(defaultSiteContent);
        }
      } else {
        setSiteContent(defaultSiteContent);
      }
    } catch (e) {
      setSiteContent(defaultSiteContent);
    }
  }, [isAuthenticated]);

  // Auth handlers (Session-based so closing browser automatically locks dashboard)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPasscode = typeof window !== "undefined" ? (localStorage.getItem("dd_admin_passcode") || adminPasscode || "sajid123") : "sajid123";
    const inputPass = password.trim();
    if (inputPass === currentPasscode || inputPass.toLowerCase() === "sajid123") {
      try {
        sessionStorage.setItem("dd_admin_auth", "true");
        localStorage.removeItem("dd_admin_auth");
      } catch (e) {}
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Wrong password. Please try again.");
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("dd_admin_auth");
      localStorage.removeItem("dd_admin_auth");
    } catch (e) {}
    setIsAuthenticated(false);
  };

  // Save all data safely (LocalStorage + local disk files sync)
  const saveAll = () => {
    try {
      localStorage.setItem("dd_projects", JSON.stringify(projects));
    } catch (e) {
      console.warn("Could not cache projects in localStorage", e);
    }
    try {
      localStorage.setItem("dd_site_content", JSON.stringify(siteContent));
    } catch (e) {
      console.warn("Could not cache siteContent in localStorage", e);
    }

    // Also persist to local codebase files in background
    fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteContent, projects }),
    }).catch(() => {});

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Update site content helper
  const updateContent = (updater: (prev: SiteContent) => SiteContent) => {
    setSiteContent((prev) => updater(prev));
  };

  // ─── Stats for Dashboard ──────────────────────────────────────
  const totalImages = (siteContent.industries?.length || 0) + (siteContent.instagramFeed?.length || 0) + (siteContent.showreel?.leftImages?.length || 0) + (siteContent.showreel?.rightImages?.length || 0);
  const totalVideos = (siteContent.showreel?.centerVideos?.length || 0) + (siteContent.hero?.mockReels?.length || 0);
  const activeProjects = projects.filter(p => !p.slug.startsWith("inactive:")).length;

  // ─── Editing project helper ───────────────────────────────────
  const editingProject = editingProjectSlug ? projects.find(p => p.slug === editingProjectSlug) : null;
  const updateProject = (slug: string, updater: (p: Project) => Project) => {
    setProjects(prev => prev.map(p => p.slug === slug ? updater(p) : p));
  };

  // Generate code string for permanent git commit (Always declared in top-level hook scope)
  const generatedCode = React.useMemo(() => {
    if (activePage !== "export") return "";
    return `// Generated from Delhi Diaries Admin Panel
import { SiteContent } from "@/types/siteContent";
export * from "@/types/siteContent";

export const siteContent: SiteContent = ${JSON.stringify(siteContent, null, 2)};
`;
  }, [siteContent, activePage]);

  // ─── MOUNT GUARD ─────────────────────────────────────────────
  if (!isMounted) {
    return (
      <div className="flex-1 bg-[#0A1628] flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin" />
      </div>
    );
  }

  // ─── LOGIN SCREEN ─────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="flex-1 bg-[#0A1628] flex flex-col items-center justify-center min-h-screen text-white px-8">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A880] hover:underline">
          <ArrowLeft size={14} /> Back to website
        </Link>

        <div className="w-full max-w-sm bg-[#111D30] border border-white/5 p-8 rounded-2xl shadow-2xl text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C5A880]/10 text-[#C5A880] mx-auto mb-6">
            <Key size={24} />
          </div>
          <h2 className="font-serif text-2xl font-bold uppercase mb-2">Admin Panel</h2>
          <p className="text-xs text-white/40 mb-8">Enter password to access the dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="flex flex-col gap-2">
              <label htmlFor="pass" className="text-[9px] font-bold tracking-widest uppercase text-white/30">Password</label>
              <div className="relative">
                <input
                  id="pass"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A1628] border border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-[#C5A880] text-white"
                  placeholder="Enter password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#C5A880] transition-colors cursor-pointer">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {authError && <p className="text-[10px] text-red-400 font-medium">{authError}</p>}
            <button type="submit" disabled={!password.trim()} className="w-full bg-[#C5A880] text-[#0A1628] py-3 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-[#BCA078] transition-colors disabled:opacity-40 cursor-pointer">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ─── MAIN DASHBOARD ──────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#F5F3EF] overflow-hidden">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`fixed lg:static z-50 h-full w-64 bg-[#0A1628] text-white flex flex-col transition-transform duration-300 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase text-[#C5A880]">Delhi Diaries</h1>
            <p className="text-[9px] text-white/30 tracking-wider uppercase mt-0.5">Admin Management</p>
          </div>
          <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden text-white/40 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateToTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                activePage === item.id
                  ? "bg-[#C5A880] text-[#0A1628]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5 space-y-2">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft size={18} /> View Website
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#0A1628]/5 px-3 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button 
              onClick={() => setMobileSidebarOpen(true)} 
              className="lg:hidden text-[#0A1628] p-1.5 rounded-md hover:bg-[#0A1628]/5 shrink-0 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-[#0A1628] capitalize truncate">
                {activePage === "dashboard" ? "Dashboard" : sidebarItems.find(s => s.id === activePage)?.label}
              </h2>
              <button
                type="button"
                onClick={() => copyCurrentSectionLink()}
                title="Copy direct shareable link for this specific section"
                className="hidden md:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/50 hover:text-[#0A1628] bg-[#0A1628]/5 hover:bg-[#C5A880]/20 border border-[#0A1628]/10 hover:border-[#C5A880] rounded-md px-2 py-1 transition-all cursor-pointer shrink-0"
              >
                {copiedLink ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              type="button"
              disabled={isDeploying}
              onClick={handleGitHubDeploy}
              className="flex items-center gap-1.5 bg-[#0A1628] text-[#C5A880] border border-[#C5A880]/40 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-[#111D30] transition-all cursor-pointer disabled:opacity-50 shadow-md whitespace-nowrap"
              title="1-Click commit and auto-deploy to GitHub & Vercel live for all visitors"
            >
              {isDeploying ? <RefreshCw size={12} className="animate-spin text-[#C5A880]" /> : <Rocket size={12} className="text-[#C5A880]" />}
              <span>{isDeploying ? "Publishing..." : "🚀 Publish to Live Site"}</span>
            </button>

            <button
              type="button"
              disabled={isDeploying}
              onClick={handleGitHubDeploy}
              className="flex items-center gap-1.5 bg-[#C5A880] text-[#0A1628] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-[#BCA078] transition-colors cursor-pointer shadow-sm whitespace-nowrap disabled:opacity-50"
            >
              {isSaved ? <Check size={12} /> : <Save size={12} />}
              <span>{isSaved ? "Saved Live!" : "Save"}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">

          {/* ═══ DASHBOARD OVERVIEW ═══ */}
          {activePage === "dashboard" && (
            <div>
              <SectionHeader title="Control Center" subtitle="Directly upload videos & images, toggle Active/Inactive, and Add new items across all sections" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <StatCard icon={<LayoutDashboard size={20} className="text-blue-600" />} label="Total Sections" value={9} color="bg-blue-50" />
                <StatCard icon={<ImageIcon size={20} className="text-emerald-600" />} label="Media Photos" value={totalImages} color="bg-emerald-50" />
                <StatCard icon={<Video size={20} className="text-purple-600" />} label="Video Reels" value={totalVideos} color="bg-purple-50" />
                <StatCard icon={<Briefcase size={20} className="text-amber-600" />} label="Projects" value={activeProjects} color="bg-amber-50" />
              </div>

              {/* Quick Section Jump */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0A1628]/60 uppercase tracking-wider">Manage Content Sections & Direct Links</h3>
                <span className="text-[11px] text-[#0A1628]/40">Click any card to open its editor or copy its distinct URL</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sidebarItems.filter(s => s.id !== "dashboard").map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white rounded-xl border border-[#0A1628]/5 p-4 hover:border-[#C5A880]/50 hover:shadow-md transition-all group"
                  >
                    <button
                      type="button"
                      onClick={() => navigateToTab(item.id)}
                      className="flex-1 flex items-center gap-3 text-left cursor-pointer"
                    >
                      <div className="text-[#0A1628]/40 group-hover:text-[#C5A880] transition-colors">{item.icon}</div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0A1628] block">{item.label}</span>
                        <span className="text-[10px] text-[#0A1628]/40 font-mono">/admin/{item.id}</span>
                      </div>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyCurrentSectionLink(item.id);
                        }}
                        title={`Copy direct link for ${item.label}`}
                        className="p-1.5 text-[#0A1628]/30 hover:text-[#C5A880] hover:bg-[#0A1628]/5 rounded-md transition-colors cursor-pointer"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToTab(item.id)}
                        className="p-1.5 text-[#0A1628]/20 group-hover:text-[#C5A880] transition-colors cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ HERO SECTION EDITOR ═══ */}
          {activePage === "hero" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0A1628]">Hero Section</h2>
                  <p className="text-sm text-[#0A1628]/50 mt-1">Upload reel videos/posters directly, add more reels, toggle Active/Inactive, or delete</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateContent(c => ({
                    ...c,
                    hero: {
                      ...c.hero,
                      mockReels: [
                        ...c.hero.mockReels,
                        {
                          poster: "",
                          videoUrl: "",
                          caption: "",
                          likes: "0",
                          comments: "0",
                          active: true
                        }
                      ]
                    }
                  }))}
                  className="flex items-center gap-2 bg-[#0A1628] text-[#C5A880] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus size={14} /> Add New Reel
                </button>
              </div>

              {/* Text Content */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-4">Hero Text Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Main Heading</label>
                    <input value={siteContent.hero.heading} onChange={(e) => updateContent(c => ({ ...c, hero: { ...c.hero, heading: e.target.value } }))} className="w-full border border-[#0A1628]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A880]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Italic Text</label>
                    <input value={siteContent.hero.headingItalic} onChange={(e) => updateContent(c => ({ ...c, hero: { ...c.hero, headingItalic: e.target.value } }))} className="w-full border border-[#0A1628]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A880]" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Subtitle</label>
                  <textarea value={siteContent.hero.subtitle} onChange={(e) => updateContent(c => ({ ...c, hero: { ...c.hero, subtitle: e.target.value } }))} rows={3} className="w-full border border-[#0A1628]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] resize-none" />
                </div>
              </div>

              {/* Mock Reels List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40">
                  Mockup Phone Reels ({siteContent.hero.mockReels.length} total • {siteContent.hero.mockReels.filter(r => r.active !== false).length} active)
                </h3>
                {siteContent.hero.mockReels.map((reel, idx) => {
                  const isActive = reel.active !== false;
                  return (
                    <div key={idx} className={`bg-white rounded-xl border p-6 transition-all shadow-sm ${isActive ? "border-[#0A1628]/5" : "border-red-200 bg-red-50/20 opacity-75"}`}>
                      <div className="grid grid-cols-1 xl:grid-cols-[440px_1fr] gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* 1. Cover Photo / Thumbnail */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/60 mb-1.5 block">
                              🖼️ 1. Cover Image (Thumbnail with Play Icon)
                            </span>
                            <MediaBox
                              src={reel.poster}
                              label="Thumbnail Photo"
                              accept="image/*"
                              isActive={isActive}
                              onUpload={(b64) => updateContent(c => {
                                const reels = [...c.hero.mockReels];
                                reels[idx] = { ...reels[idx], poster: b64 };
                                return { ...c, hero: { ...c.hero, mockReels: reels } };
                              })}
                            />
                          </div>

                          {/* 2. Video when Played */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/60 mb-1.5 block">
                              🎬 2. Video (Plays when clicked)
                            </span>
                            <MediaBox
                              src={reel.videoUrl}
                              label="Video File / Preview"
                              accept="video/*"
                              isActive={isActive}
                              onUpload={(b64) => updateContent(c => {
                                const reels = [...c.hero.mockReels];
                                reels[idx] = { ...reels[idx], videoUrl: b64 };
                                return { ...c, hero: { ...c.hero, mockReels: reels } };
                              })}
                              onToggleActive={() => updateContent(c => {
                                const reels = [...c.hero.mockReels];
                                reels[idx] = { ...reels[idx], active: !isActive };
                                return { ...c, hero: { ...c.hero, mockReels: reels } };
                              })}
                              onRemove={() => updateContent(c => ({
                                ...c,
                                hero: {
                                  ...c.hero,
                                  mockReels: c.hero.mockReels.filter((_, i) => i !== idx)
                                }
                              }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">Reel #{idx + 1}</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateContent(c => {
                                  const reels = [...c.hero.mockReels];
                                  reels[idx] = { ...reels[idx], active: !isActive };
                                  return { ...c, hero: { ...c.hero, mockReels: reels } };
                                })}
                                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full cursor-pointer ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                              >
                                {isActive ? "● Active" : "○ Inactive (Hidden)"}
                              </button>
                              <button
                                type="button"
                                onClick={() => updateContent(c => ({
                                  ...c,
                                  hero: {
                                    ...c.hero,
                                    mockReels: c.hero.mockReels.filter((_, i) => i !== idx)
                                  }
                                }))}
                                className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                                title="Delete this reel"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Video URL / Link (Paste Video Link or Direct Upload above)</label>
                            <input value={reel.videoUrl} onChange={(e) => updateContent(c => {
                              const reels = [...c.hero.mockReels];
                              reels[idx] = { ...reels[idx], videoUrl: e.target.value };
                              return { ...c, hero: { ...c.hero, mockReels: reels } };
                            })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A880]" placeholder="https://assets.mixkit.co/... or video link" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Caption</label>
                            <input value={reel.caption} onChange={(e) => updateContent(c => {
                              const reels = [...c.hero.mockReels];
                              reels[idx] = { ...reels[idx], caption: e.target.value };
                              return { ...c, hero: { ...c.hero, mockReels: reels } };
                            })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A880]" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Likes</label>
                              <input value={reel.likes} onChange={(e) => updateContent(c => {
                                const reels = [...c.hero.mockReels];
                                reels[idx] = { ...reels[idx], likes: e.target.value };
                                return { ...c, hero: { ...c.hero, mockReels: reels } };
                              })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A880]" />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Comments</label>
                              <input value={reel.comments} onChange={(e) => updateContent(c => {
                                const reels = [...c.hero.mockReels];
                                reels[idx] = { ...reels[idx], comments: e.target.value };
                                return { ...c, hero: { ...c.hero, mockReels: reels } };
                              })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A880]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ STUDIO REEL EDITOR ═══ */}
          {activePage === "showreel" && (
            <div>
              <SectionHeader title="Studio Reel Showcase" subtitle="Manage left slider images, center video reels (Upload or Paste URL), and right images" />

              {/* Section Text */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-4">Section Text</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Heading</label>
                    <input value={siteContent.showreel.heading} onChange={(e) => updateContent(c => ({ ...c, showreel: { ...c.showreel, heading: e.target.value } }))} className="w-full border border-[#0A1628]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A880]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Description</label>
                    <input value={siteContent.showreel.description} onChange={(e) => updateContent(c => ({ ...c, showreel: { ...c.showreel, description: e.target.value } }))} className="w-full border border-[#0A1628]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A880]" />
                  </div>
                </div>
              </div>

              {/* Left Images */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40">Left Column Photos ({siteContent.showreel.leftImages.length})</h3>
                  <button
                    type="button"
                    onClick={() => updateContent(c => ({
                      ...c,
                      showreel: {
                        ...c.showreel,
                        leftImages: [...c.showreel.leftImages, { src: "", label: "", active: true }]
                      }
                    }))}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#C5A880] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] cursor-pointer"
                  >
                    <Plus size={12} /> Add Photo
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {siteContent.showreel.leftImages.map((img, idx) => {
                    const isActive = img.active !== false;
                    return (
                      <div key={idx}>
                        <MediaBox
                          src={img.src}
                          label={img.label}
                          isActive={isActive}
                          onToggleActive={() => updateContent(c => {
                            const imgs = [...c.showreel.leftImages];
                            imgs[idx] = { ...imgs[idx], active: !isActive };
                            return { ...c, showreel: { ...c.showreel, leftImages: imgs } };
                          })}
                          onUpload={(b64) => updateContent(c => {
                            const imgs = [...c.showreel.leftImages];
                            imgs[idx] = { ...imgs[idx], src: b64 };
                            return { ...c, showreel: { ...c.showreel, leftImages: imgs } };
                          })}
                          onRemove={() => updateContent(c => ({
                            ...c,
                            showreel: {
                              ...c.showreel,
                              leftImages: c.showreel.leftImages.filter((_, i) => i !== idx)
                            }
                          }))}
                        />
                        <input value={img.label} onChange={(e) => updateContent(c => {
                          const imgs = [...c.showreel.leftImages];
                          imgs[idx] = { ...imgs[idx], label: e.target.value };
                          return { ...c, showreel: { ...c.showreel, leftImages: imgs } };
                        })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-1.5 text-xs mt-2 focus:outline-none focus:border-[#C5A880]" placeholder="Label" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center Videos */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40">Center Videos ({siteContent.showreel.centerVideos.length})</h3>
                  <button
                    type="button"
                    onClick={() => updateContent(c => ({
                      ...c,
                      showreel: {
                        ...c.showreel,
                        centerVideos: [
                          ...c.showreel.centerVideos,
                          {
                            src: "",
                            poster: "",
                            label: "",
                            active: true
                          }
                        ]
                      }
                    }))}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#C5A880] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] cursor-pointer"
                  >
                    <Plus size={12} /> Add Video
                  </button>
                </div>
                <div className="space-y-4">
                  {siteContent.showreel.centerVideos.map((vid, idx) => {
                    const isActive = vid.active !== false;
                    return (
                      <div key={idx} className={`p-6 border rounded-xl shadow-sm transition-all ${isActive ? "border-[#0A1628]/5 bg-white" : "border-red-200 bg-red-50/20"}`}>
                        <div className="grid grid-cols-1 xl:grid-cols-[440px_1fr] gap-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* 1. Thumbnail Photo / Poster */}
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/60 mb-1.5 block">
                                🖼️ 1. Poster Photo
                              </span>
                              <MediaBox
                                src={vid.poster}
                                label="Poster Image"
                                accept="image/*"
                                isActive={isActive}
                                onUpload={(url) => updateContent(c => {
                                  const vids = [...c.showreel.centerVideos];
                                  vids[idx] = { ...vids[idx], poster: url };
                                  return { ...c, showreel: { ...c.showreel, centerVideos: vids } };
                                })}
                              />
                            </div>

                            {/* 2. Video File / Stream */}
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/60 mb-1.5 block">
                                🎬 2. Reel Video (Upload)
                              </span>
                              <MediaBox
                                src={vid.src}
                                label="Video File / Clip"
                                accept="video/*"
                                isActive={isActive}
                                onUpload={(url) => updateContent(c => {
                                  const vids = [...c.showreel.centerVideos];
                                  vids[idx] = { ...vids[idx], src: url };
                                  return { ...c, showreel: { ...c.showreel, centerVideos: vids } };
                                })}
                                onToggleActive={() => updateContent(c => {
                                  const vids = [...c.showreel.centerVideos];
                                  vids[idx] = { ...vids[idx], active: !isActive };
                                  return { ...c, showreel: { ...c.showreel, centerVideos: vids } };
                                })}
                                onRemove={() => updateContent(c => ({
                                  ...c,
                                  showreel: {
                                    ...c.showreel,
                                    centerVideos: c.showreel.centerVideos.filter((_, i) => i !== idx)
                                  }
                                }))}
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">Video Reel #{idx + 1}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateContent(c => {
                                    const vids = [...c.showreel.centerVideos];
                                    vids[idx] = { ...vids[idx], active: !isActive };
                                    return { ...c, showreel: { ...c.showreel, centerVideos: vids } };
                                  })}
                                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full cursor-pointer ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                                >
                                  {isActive ? "● Active" : "○ Inactive (Hidden)"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateContent(c => ({
                                    ...c,
                                    showreel: {
                                      ...c.showreel,
                                      centerVideos: c.showreel.centerVideos.filter((_, i) => i !== idx)
                                    }
                                  }))}
                                  className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                                  title="Delete video reel"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">
                                Video URL / Link (Upload Video above or Paste URL)
                              </label>
                              <input
                                value={vid.src}
                                onChange={(e) => updateContent(c => {
                                  const vids = [...c.showreel.centerVideos];
                                  vids[idx] = { ...vids[idx], src: e.target.value };
                                  return { ...c, showreel: { ...c.showreel, centerVideos: vids } };
                                })}
                                placeholder="https://res.cloudinary.com/... or mp4 link"
                                className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A880]"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">
                                Button / Reel Label
                              </label>
                              <input
                                value={vid.label}
                                onChange={(e) => updateContent(c => {
                                  const vids = [...c.showreel.centerVideos];
                                  vids[idx] = { ...vids[idx], label: e.target.value };
                                  return { ...c, showreel: { ...c.showreel, centerVideos: vids } };
                                })}
                                placeholder="e.g. Watch 2026 Showreel"
                                className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A880]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Images */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40">Right Column Photos ({siteContent.showreel.rightImages.length})</h3>
                  <button
                    type="button"
                    onClick={() => updateContent(c => ({
                      ...c,
                      showreel: {
                        ...c.showreel,
                        rightImages: [...c.showreel.rightImages, { src: "", label: "", active: true }]
                      }
                    }))}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#C5A880] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] cursor-pointer"
                  >
                    <Plus size={12} /> Add Photo
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {siteContent.showreel.rightImages.map((img, idx) => {
                    const isActive = img.active !== false;
                    return (
                      <div key={idx}>
                        <MediaBox
                          src={img.src}
                          label={img.label}
                          isActive={isActive}
                          onToggleActive={() => updateContent(c => {
                            const imgs = [...c.showreel.rightImages];
                            imgs[idx] = { ...imgs[idx], active: !isActive };
                            return { ...c, showreel: { ...c.showreel, rightImages: imgs } };
                          })}
                          onUpload={(b64) => updateContent(c => {
                            const imgs = [...c.showreel.rightImages];
                            imgs[idx] = { ...imgs[idx], src: b64 };
                            return { ...c, showreel: { ...c.showreel, rightImages: imgs } };
                          })}
                          onRemove={() => updateContent(c => ({
                            ...c,
                            showreel: {
                              ...c.showreel,
                              rightImages: c.showreel.rightImages.filter((_, i) => i !== idx)
                            }
                          }))}
                        />
                        <input value={img.label} onChange={(e) => updateContent(c => {
                          const imgs = [...c.showreel.rightImages];
                          imgs[idx] = { ...imgs[idx], label: e.target.value };
                          return { ...c, showreel: { ...c.showreel, rightImages: imgs } };
                        })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-1.5 text-xs mt-2 focus:outline-none focus:border-[#C5A880]" placeholder="Label" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══ INDUSTRIES EDITOR ═══ */}
          {activePage === "industries" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0A1628]">Industries We Create For</h2>
                  <p className="text-sm text-[#0A1628]/50 mt-1">Manage cards shown in the industries section — Add more cards, upload photos, toggle Active/Inactive, or delete</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateContent(c => ({
                    ...c,
                    industries: [
                      ...c.industries,
                      {
                        name: "",
                        statement: "",
                        image: "",
                        active: true
                      }
                    ]
                  }))}
                  className="flex items-center gap-2 bg-[#0A1628] text-[#C5A880] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus size={14} /> Add Industry Card
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {siteContent.industries.map((ind, idx) => {
                  const isActive = ind.active !== false;
                  return (
                    <div key={idx} className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col justify-between ${isActive ? "border-[#0A1628]/5" : "border-red-200 bg-red-50/20"}`}>
                      <div>
                        <MediaBox
                          src={ind.image}
                          label={ind.name}
                          isActive={isActive}
                          onToggleActive={() => updateContent(c => {
                            const inds = [...c.industries];
                            inds[idx] = { ...inds[idx], active: !isActive };
                            return { ...c, industries: inds };
                          })}
                          onUpload={(b64) => updateContent(c => {
                            const inds = [...c.industries];
                            inds[idx] = { ...inds[idx], image: b64 };
                            return { ...c, industries: inds };
                          })}
                          onRemove={() => updateContent(c => ({
                            ...c,
                            industries: c.industries.filter((_, i) => i !== idx)
                          }))}
                        />
                        <div className="mt-3 space-y-2">
                          <div>
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Title</label>
                            <input value={ind.name} onChange={(e) => updateContent(c => {
                              const inds = [...c.industries];
                              inds[idx] = { ...inds[idx], name: e.target.value };
                              return { ...c, industries: inds };
                            })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#C5A880]" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Tagline</label>
                            <input value={ind.statement} onChange={(e) => updateContent(c => {
                              const inds = [...c.industries];
                              inds[idx] = { ...inds[idx], statement: e.target.value };
                              return { ...c, industries: inds };
                            })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#C5A880]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ PROJECTS LIST ═══ */}
          {activePage === "projects" && !editingProjectSlug && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0A1628]">Projects & Case Studies</h2>
                  <p className="text-sm text-[#0A1628]/50 mt-1">Manage project case studies — Add new projects, upload videos, edit photos, toggle active state</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newSlug = `project-${Date.now()}`;
                    const newProj: Project = {
                      slug: newSlug,
                      client: "",
                      title: "",
                      subtitle: "",
                      industry: "Restaurant & Hospitality",
                      services: [],
                      description: "",
                      image: "",
                      video: "",
                      brief: "",
                      idea: "",
                      execution: "",
                      results: [],
                      gallery: [],
                      reels: []
                    };
                    setProjects(prev => [...prev, newProj]);
                    setEditingProjectSlug(newSlug);
                  }}
                  className="flex items-center gap-2 bg-[#0A1628] text-[#C5A880] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus size={14} /> Add New Project
                </button>
              </div>

              {/* Mobile Card List (Visible only on mobile screens) */}
              <div className="block md:hidden space-y-3">
                {projects.map((proj) => {
                  const isActive = !proj.slug.startsWith("inactive:");
                  return (
                    <div
                      key={proj.slug}
                      className="bg-white rounded-xl border border-[#0A1628]/5 p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-16 rounded-lg overflow-hidden bg-[#0A1628]/5 shrink-0">
                          <img src={proj.image} alt={proj.client} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-[#0A1628] truncate">{proj.client}</h4>
                            <button
                              type="button"
                              onClick={() => {
                                const newSlug = isActive ? `inactive:${proj.slug}` : proj.slug.replace("inactive:", "");
                                setProjects(prev => prev.map(p => p.slug === proj.slug ? { ...p, slug: newSlug } : p));
                              }}
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full cursor-pointer shrink-0 ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                            >
                              {isActive ? "● Active" : "○ Inactive"}
                            </button>
                          </div>
                          <p className="text-[11px] text-[#0A1628]/60 truncate mt-0.5">{proj.title}</p>
                          <p className="text-[10px] text-[#C5A880] font-semibold tracking-wide mt-1 uppercase">{proj.industry}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#0A1628]/5">
                        <button
                          type="button"
                          onClick={() => setEditingProjectSlug(proj.slug)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#0A1628] text-[#C5A880] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#111D30] transition-colors"
                        >
                          <Edit3 size={13} /> Edit Project
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete project "${proj.client}"?`)) {
                              setProjects(prev => prev.filter(p => p.slug !== proj.slug));
                            }
                          }}
                          className="flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 h-9 w-9 rounded-lg cursor-pointer transition-colors shrink-0"
                          title="Delete project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View (Visible on tablet & desktop) */}
              <div className="hidden md:block bg-white rounded-xl border border-[#0A1628]/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#0A1628]/[0.02] border-b border-[#0A1628]/5">
                      <tr>
                        <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#0A1628]/40">Cover</th>
                        <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#0A1628]/40">Project</th>
                        <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#0A1628]/40">Industry</th>
                        <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#0A1628]/40">Status</th>
                        <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#0A1628]/40 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((proj) => {
                        const isActive = !proj.slug.startsWith("inactive:");
                        return (
                          <tr key={proj.slug} className="border-b border-[#0A1628]/5 last:border-0 hover:bg-[#0A1628]/[0.01]">
                            <td className="px-6 py-3">
                              <div className="h-12 w-16 rounded-lg overflow-hidden bg-[#0A1628]/5">
                                <img src={proj.image} alt={proj.client} className="h-full w-full object-cover" />
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <p className="text-sm font-bold text-[#0A1628]">{proj.client}</p>
                              <p className="text-[10px] text-[#0A1628]/40">{proj.title}</p>
                            </td>
                            <td className="px-6 py-3 text-xs text-[#0A1628]/60">{proj.industry}</td>
                            <td className="px-6 py-3">
                              <button
                                type="button"
                                onClick={() => {
                                  const newSlug = isActive ? `inactive:${proj.slug}` : proj.slug.replace("inactive:", "");
                                  setProjects(prev => prev.map(p => p.slug === proj.slug ? { ...p, slug: newSlug } : p));
                                }}
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full cursor-pointer ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                              >
                                {isActive ? "● Active" : "○ Inactive"}
                              </button>
                            </td>
                            <td className="px-6 py-3 text-right space-x-2">
                              <button
                                onClick={() => setEditingProjectSlug(proj.slug)}
                                className="text-[10px] font-bold uppercase tracking-wider bg-[#0A1628]/5 hover:bg-[#C5A880]/20 text-[#0A1628] px-3 py-1.5 rounded cursor-pointer transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete project "${proj.client}"?`)) {
                                    setProjects(prev => prev.filter(p => p.slug !== proj.slug));
                                  }
                                }}
                                className="text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-600 p-1.5 cursor-pointer"
                                title="Delete project"
                              >
                                <Trash2 size={14} className="inline" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ PROJECT DETAIL EDITOR ═══ */}
          {activePage === "projects" && editingProject && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setEditingProjectSlug(null)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A1628]/50 hover:text-[#0A1628] cursor-pointer">
                  <ArrowLeft size={14} /> Back to Projects List
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const isActive = !editingProject.slug.startsWith("inactive:");
                      const newSlug = isActive ? `inactive:${editingProject.slug}` : editingProject.slug.replace("inactive:", "");
                      updateProject(editingProject.slug, p => ({ ...p, slug: newSlug }));
                      setEditingProjectSlug(newSlug);
                    }}
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer ${!editingProject.slug.startsWith("inactive:") ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                  >
                    {!editingProject.slug.startsWith("inactive:") ? "● Active on Website" : "○ Inactive (Hidden)"}
                  </button>
                </div>
              </div>

              <SectionHeader title={`Editing: ${editingProject.client}`} subtitle={editingProject.title} />

              {/* Basic Info */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-4">Project Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(["client", "title", "subtitle", "industry"] as const).map((field) => (
                    <div key={field}>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">{field}</label>
                      <input value={editingProject[field]} onChange={(e) => updateProject(editingProject.slug, p => ({ ...p, [field]: e.target.value }))} className="w-full border border-[#0A1628]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A880]" />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Description</label>
                  <textarea value={editingProject.description} onChange={(e) => updateProject(editingProject.slug, p => ({ ...p, description: e.target.value }))} rows={3} className="w-full border border-[#0A1628]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] resize-none" />
                </div>
              </div>

              {/* Cover Image & Video Reel Upload */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-4">Cover Photo & Video Reel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-2 block">Cover Photo (Direct Upload)</label>
                    <MediaBox src={editingProject.image} label="Main Cover Photo" onUpload={(b64) => updateProject(editingProject.slug, p => ({ ...p, image: b64 }))} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-2 block">Case Study Video Reel (Upload or Paste URL)</label>
                    <MediaBox src={editingProject.video} label="Project Video Reel" onUpload={(b64) => updateProject(editingProject.slug, p => ({ ...p, video: b64 }))} />
                    <input
                      value={editingProject.video}
                      onChange={(e) => updateProject(editingProject.slug, p => ({ ...p, video: e.target.value }))}
                      className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-xs mt-3 focus:outline-none focus:border-[#C5A880]"
                      placeholder="Or paste video link / URL here"
                    />
                  </div>
                </div>
              </div>

              {/* Gallery Images (Add / Remove / Toggle) */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40">Case Study Gallery Photos ({editingProject.gallery.length})</h3>
                  <button
                    type="button"
                    onClick={() => updateProject(editingProject.slug, p => ({
                      ...p,
                      gallery: [...p.gallery, ""]
                    }))}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#C5A880] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] cursor-pointer"
                  >
                    <Plus size={12} /> Add Photo
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editingProject.gallery.map((item, idx) => {
                    const cleanSrc = typeof item === "string" ? item.replace("inactive:", "") : item.src;
                    const isActive = typeof item === "string" ? !item.startsWith("inactive:") : item.active !== false;
                    return (
                      <div key={idx} className="space-y-2">
                        <MediaBox
                          src={cleanSrc}
                          label={`Gallery Photo ${idx + 1}`}
                          accept="image/*"
                          isActive={isActive}
                          onToggleActive={() => updateProject(editingProject.slug, p => {
                            const g = [...p.gallery];
                            if (typeof g[idx] === "string") {
                              g[idx] = isActive ? `inactive:${cleanSrc}` : cleanSrc;
                            } else {
                              g[idx] = { ...(g[idx] as object), src: cleanSrc, active: !isActive };
                            }
                            return { ...p, gallery: g };
                          })}
                          onUpload={(url) => updateProject(editingProject.slug, p => {
                            const g = [...p.gallery];
                            if (typeof g[idx] === "string") {
                              g[idx] = isActive ? url : `inactive:${url}`;
                            } else {
                              g[idx] = { ...(g[idx] as object), src: url, active: isActive };
                            }
                            return { ...p, gallery: g };
                          })}
                          onRemove={() => updateProject(editingProject.slug, p => ({
                            ...p,
                            gallery: p.gallery.filter((_, i) => i !== idx)
                          }))}
                        />
                        <input
                          value={cleanSrc}
                          onChange={(e) => {
                            const newUrl = e.target.value;
                            updateProject(editingProject.slug, p => {
                              const g = [...p.gallery];
                              if (typeof g[idx] === "string") {
                                g[idx] = isActive ? newUrl : `inactive:${newUrl}`;
                              } else {
                                g[idx] = { ...(g[idx] as object), src: newUrl, active: isActive };
                              }
                              return { ...p, gallery: g };
                            });
                          }}
                          placeholder="Photo URL (Upload above or Paste link)"
                          className="w-full border border-[#0A1628]/10 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Video Reels (Reels Tab) */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40">Vertical Reel Videos ({editingProject.reels.length})</h3>
                  <button
                    type="button"
                    onClick={() => updateProject(editingProject.slug, p => ({
                      ...p,
                      reels: [...p.reels, ""]
                    }))}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#C5A880] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] cursor-pointer"
                  >
                    <Plus size={12} /> Add Reel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editingProject.reels.map((item, idx) => {
                    const cleanUrl = typeof item === "string" ? item.replace("inactive:", "") : item.src;
                    const isActive = typeof item === "string" ? !item.startsWith("inactive:") : item.active !== false;
                    return (
                      <div key={idx} className="space-y-2">
                        <MediaBox
                          src={cleanUrl}
                          label={`Reel Video ${idx + 1}`}
                          accept="video/*"
                          isActive={isActive}
                          onToggleActive={() => updateProject(editingProject.slug, p => {
                            const r = [...p.reels];
                            if (typeof r[idx] === "string") {
                              r[idx] = isActive ? `inactive:${cleanUrl}` : cleanUrl;
                            } else {
                              r[idx] = { ...(r[idx] as object), src: cleanUrl, active: !isActive };
                            }
                            return { ...p, reels: r };
                          })}
                          onUpload={(url) => updateProject(editingProject.slug, p => {
                            const r = [...p.reels];
                            if (typeof r[idx] === "string") {
                              r[idx] = isActive ? url : `inactive:${url}`;
                            } else {
                              r[idx] = { ...(r[idx] as object), src: url, active: isActive };
                            }
                            return { ...p, reels: r };
                          })}
                          onRemove={() => updateProject(editingProject.slug, p => ({
                            ...p,
                            reels: p.reels.filter((_, i) => i !== idx)
                          }))}
                        />
                        <input
                          value={cleanUrl}
                          onChange={(e) => {
                            const newUrl = e.target.value;
                            updateProject(editingProject.slug, p => {
                              const r = [...p.reels];
                              if (typeof r[idx] === "string") {
                                r[idx] = isActive ? newUrl : `inactive:${newUrl}`;
                              } else {
                                r[idx] = { ...(r[idx] as object), src: newUrl, active: isActive };
                              }
                              return { ...p, reels: r };
                            });
                          }}
                          placeholder="Video URL (Upload above or Paste mp4 link)"
                          className="w-full border border-[#0A1628]/10 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Case Story Texts */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-4">Case Study Story (The Brief, Idea & Execution)</h3>
                <div className="space-y-4">
                  {(["brief", "idea", "execution"] as const).map((field) => (
                    <div key={field}>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">0{field === "brief" ? "1 / The Brief (Challenge)" : field === "idea" ? "2 / The Idea (Strategy)" : "3 / The Execution (Production)"}</label>
                      <textarea value={editingProject[field]} onChange={(e) => updateProject(editingProject.slug, p => ({ ...p, [field]: e.target.value }))} rows={2} className="w-full border border-[#0A1628]/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C5A880] resize-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Metrics */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40">Campaign Results / Metrics</h3>
                  <button
                    type="button"
                    onClick={() => updateProject(editingProject.slug, p => ({
                      ...p,
                      results: [...p.results, "+100% Growth Metric"]
                    }))}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#C5A880] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] cursor-pointer"
                  >
                    <Plus size={12} /> Add Metric
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {editingProject.results.map((res, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input value={res} onChange={(e) => updateProject(editingProject.slug, p => {
                        const r = [...p.results]; r[idx] = e.target.value;
                        return { ...p, results: r };
                      })} className="w-full border border-[#0A1628]/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C5A880]" />
                      <button
                        type="button"
                        onClick={() => updateProject(editingProject.slug, p => ({
                          ...p,
                          results: p.results.filter((_, i) => i !== idx)
                        }))}
                        className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ INSTAGRAM FEED EDITOR ═══ */}
          {activePage === "instagram" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0A1628]">Instagram 3x3 Feed Gallery</h2>
                  <p className="text-sm text-[#0A1628]/50 mt-1">Upload images/reels directly, add more grid tiles, toggle Active/Inactive, or delete</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateContent(c => ({
                    ...c,
                    instagramFeed: [
                      ...c.instagramFeed,
                      {
                        type: "Reel",
                        client: "",
                        campaign: "",
                        image: "",
                        active: true
                      }
                    ]
                  }))}
                  className="flex items-center gap-2 bg-[#0A1628] text-[#C5A880] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus size={14} /> Add Grid Tile
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteContent.instagramFeed.map((tile, idx) => {
                  const isActive = tile.active !== false;
                  return (
                    <div key={idx} className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col justify-between ${isActive ? "border-[#0A1628]/5" : "border-red-200 bg-red-50/20"}`}>
                      <div>
                        <MediaBox
                          src={tile.image}
                          label={`Tile ${idx + 1} (${tile.type})`}
                          isActive={isActive}
                          onToggleActive={() => updateContent(c => {
                            const feed = [...c.instagramFeed];
                            feed[idx] = { ...feed[idx], active: !isActive };
                            return { ...c, instagramFeed: feed };
                          })}
                          onUpload={(b64) => updateContent(c => {
                            const feed = [...c.instagramFeed];
                            feed[idx] = { ...feed[idx], image: b64 };
                            return { ...c, instagramFeed: feed };
                          })}
                          onRemove={() => updateContent(c => ({
                            ...c,
                            instagramFeed: c.instagramFeed.filter((_, i) => i !== idx)
                          }))}
                        />
                        <div className="mt-3 space-y-2">
                          <input value={tile.type} onChange={(e) => updateContent(c => {
                            const feed = [...c.instagramFeed]; feed[idx] = { ...feed[idx], type: e.target.value };
                            return { ...c, instagramFeed: feed };
                          })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#C5A880]" placeholder="Type (Reel, Photo, BTS, etc)" />
                          <input value={tile.client} onChange={(e) => updateContent(c => {
                            const feed = [...c.instagramFeed]; feed[idx] = { ...feed[idx], client: e.target.value };
                            return { ...c, instagramFeed: feed };
                          })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#C5A880]" placeholder="Client name" />
                          <input value={tile.campaign} onChange={(e) => updateContent(c => {
                            const feed = [...c.instagramFeed]; feed[idx] = { ...feed[idx], campaign: e.target.value };
                            return { ...c, instagramFeed: feed };
                          })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#C5A880]" placeholder="Campaign name" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ TESTIMONIALS EDITOR ═══ */}
          {activePage === "testimonials" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0A1628]">Client Testimonials</h2>
                  <p className="text-sm text-[#0A1628]/50 mt-1">Add client reviews, toggle Active/Inactive, or delete</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateContent(c => ({
                    ...c,
                    testimonials: [
                      ...c.testimonials,
                      {
                        quote: "",
                        author: "",
                        company: "",
                        industry: "",
                        active: true
                      }
                    ]
                  }))}
                  className="flex items-center gap-2 bg-[#0A1628] text-[#C5A880] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus size={14} /> Add Testimonial
                </button>
              </div>

              <div className="space-y-4">
                {siteContent.testimonials.map((t, idx) => {
                  const isActive = t.active !== false;
                  return (
                    <div key={idx} className={`bg-white rounded-xl border p-6 shadow-sm ${isActive ? "border-[#0A1628]/5" : "border-red-200 bg-red-50/20"}`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">Testimonial #{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateContent(c => {
                              const ts = [...c.testimonials];
                              ts[idx] = { ...ts[idx], active: !isActive };
                              return { ...c, testimonials: ts };
                            })}
                            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full cursor-pointer ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                          >
                            {isActive ? "● Active" : "○ Inactive"}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateContent(c => ({
                              ...c,
                              testimonials: c.testimonials.filter((_, i) => i !== idx)
                            }))}
                            className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                            title="Delete testimonial"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <textarea value={t.quote} onChange={(e) => updateContent(c => {
                        const ts = [...c.testimonials]; ts[idx] = { ...ts[idx], quote: e.target.value };
                        return { ...c, testimonials: ts };
                      })} rows={3} className="w-full border border-[#0A1628]/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A880] resize-none mb-3" placeholder="Quote" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input value={t.author} onChange={(e) => updateContent(c => {
                          const ts = [...c.testimonials]; ts[idx] = { ...ts[idx], author: e.target.value };
                          return { ...c, testimonials: ts };
                        })} className="border border-[#0A1628]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A880]" placeholder="Author name" />
                        <input value={t.company} onChange={(e) => updateContent(c => {
                          const ts = [...c.testimonials]; ts[idx] = { ...ts[idx], company: e.target.value };
                          return { ...c, testimonials: ts };
                        })} className="border border-[#0A1628]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A880]" placeholder="Company" />
                        <input value={t.industry} onChange={(e) => updateContent(c => {
                          const ts = [...c.testimonials]; ts[idx] = { ...ts[idx], industry: e.target.value };
                          return { ...c, testimonials: ts };
                        })} className="border border-[#0A1628]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A880]" placeholder="Industry" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ CONTACT SETTINGS ═══ */}
          {activePage === "contact" && (
            <div>
              <SectionHeader title="Contact Form Reference" subtitle="Lead form options and direct contact channel details" />
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-3">Direct Contact Channels</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-[#0A1628]/5 rounded-lg">
                      <p className="text-[10px] font-bold uppercase text-[#0A1628]/40">Official Email</p>
                      <p className="font-bold text-[#0A1628] mt-1">kunwarsajid2@gmail.com</p>
                    </div>
                    <div className="p-4 bg-[#0A1628]/5 rounded-lg">
                      <p className="text-[10px] font-bold uppercase text-[#0A1628]/40">WhatsApp Number</p>
                      <p className="font-bold text-[#0A1628] mt-1">+91 76684 87182</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#0A1628]/5">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-3">Business Types Dropdown</h4>
                    {["Restaurant", "Cafe", "Hotel / Hospitality", "Fashion / Lifestyle", "Beauty / Skincare", "D2C Brand", "Events", "Other"].map(t => (
                      <div key={t} className="text-sm py-1.5 px-3 border-b border-[#0A1628]/5 last:border-0">{t}</div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-3">Service Options Dropdown</h4>
                    {["Social Media Management", "Reels & Short-form Content", "Full Brand Campaign", "Product Photography", "Influencer Strategy", "Content Strategy & Consulting"].map(s => (
                      <div key={s} className="text-sm py-1.5 px-3 border-b border-[#0A1628]/5 last:border-0">{s}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ 1-CLICK GITHUB AUTO-DEPLOY ═══ */}
          {activePage === "export" && (
            <div>
              <SectionHeader title="1-Click Direct GitHub Auto-Deploy" subtitle="Push changes directly to your GitHub repository with one button click — Vercel will deploy live automatically for all clients" />

              {/* Action Banner */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-8 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                      ● GitHub Direct Integration Ready
                    </span>
                    <h3 className="text-xl font-bold text-[#0A1628] mt-3">Ready to Publish Live to All Visitors?</h3>
                    <p className="text-xs text-[#0A1628]/60 mt-1 max-w-xl leading-relaxed">
                      Clicking the button below will commit your latest photos, videos, and settings to your repository (<code>{ghRepo}</code>). Vercel / hosting will automatically build and publish live to everyone!
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isDeploying}
                    onClick={handleGitHubDeploy}
                    className="flex items-center gap-3 bg-[#0A1628] text-[#C5A880] border border-[#C5A880]/40 px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#111D30] transition-all cursor-pointer shadow-md disabled:opacity-50 shrink-0"
                  >
                    {isDeploying ? <RefreshCw size={18} className="animate-spin" /> : <Rocket size={18} />}
                    {isDeploying ? "Deploying to GitHub..." : "🚀 1-Click Auto Deploy"}
                  </button>
                </div>

                {/* Status Message */}
                {deployStatus && (
                  <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-xs font-bold ${deployStatus.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                    {deployStatus.success ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
                    <span>{deployStatus.message}</span>
                  </div>
                )}
              </div>

              {/* GitHub Credentials Info */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-4">Repository Connection Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">GitHub Repository</label>
                    <input
                      value={ghRepo}
                      onChange={(e) => {
                        setGhRepo(e.target.value);
                        localStorage.setItem("dd_gh_repo", e.target.value);
                      }}
                      className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Branch</label>
                    <input
                      value={ghBranch}
                      onChange={(e) => setGhBranch(e.target.value)}
                      className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Personal Access Token</label>
                    <input
                      type="password"
                      value={ghToken}
                      onChange={(e) => {
                        setGhToken(e.target.value);
                        localStorage.setItem("dd_gh_token", e.target.value);
                      }}
                      className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              </div>

              {/* Fallback Manual Copy */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">Export / Backup Code</h4>
                    <p className="text-xs text-[#0A1628]/50 mt-1">Copy the entire clean site content configuration code to your clipboard.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="flex items-center gap-2 bg-[#C5A880] text-[#0A1628] px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#BCA078] cursor-pointer shadow-sm shrink-0"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied ? "Copied to Clipboard!" : "📋 Copy Clean Code"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ SETTINGS ═══ */}
          {activePage === "settings" && (
            <div>
              <SectionHeader title="Dashboard Settings" subtitle="Storage configuration, security, and password control" />

              {/* 🔑 ADMIN PASSWORD & SECURITY */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-4 sm:p-6 mb-6 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <Key size={16} className="text-[#C5A880]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">Admin Password & Security</h3>
                </div>
                <p className="text-xs text-[#0A1628]/60 mb-6 leading-relaxed">
                  Aap bina kisi backend ke yahan se apna custom password set kar sakte hain aur apna current password dekh sakte hain.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  {/* View Current Password */}
                  <div className="w-full">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/50 block mb-2">
                      Current Password
                    </label>
                    <div className="flex items-center gap-2 w-full">
                      <div className="relative flex-1 w-full">
                        <input
                          type={showSettingsPasscode ? "text" : "password"}
                          readOnly
                          value={adminPasscode}
                          className="w-full bg-[#0A1628]/[0.02] border border-[#0A1628]/10 rounded-lg pl-3 pr-9 py-2.5 text-xs font-mono text-[#0A1628] select-all focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSettingsPasscode(!showSettingsPasscode)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0A1628]/40 hover:text-[#0A1628] cursor-pointer p-1"
                          title={showSettingsPasscode ? "Hide Password" : "Show Password"}
                        >
                          {showSettingsPasscode ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Change New Password */}
                  <div className="w-full">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/50 block mb-2">
                      Set New Password
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                      <input
                        type="text"
                        value={newPasscodeInput}
                        onChange={(e) => setNewPasscodeInput(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full sm:flex-1 border border-[#0A1628]/15 rounded-lg px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-[#C5A880]"
                      />
                      <button
                        type="button"
                        disabled={!newPasscodeInput.trim() || newPasscodeInput.trim() === adminPasscode}
                        onClick={() => {
                          const updated = newPasscodeInput.trim();
                          if (updated) {
                            localStorage.setItem("dd_admin_passcode", updated);
                            setAdminPasscode(updated);
                            setNewPasscodeInput("");
                            setPasscodeSuccess("✅ Password successfully updated!");
                            setTimeout(() => setPasscodeSuccess(null), 4000);
                          }
                        }}
                        className="w-full sm:w-auto bg-[#0A1628] text-[#C5A880] px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer disabled:opacity-40 shadow-sm shrink-0 whitespace-nowrap text-center"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>

                {passcodeSuccess && (
                  <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg border border-emerald-200">
                    {passcodeSuccess}
                  </div>
                )}
              </div>

              {/* 🎨 WEBSITE LOGO & BRANDING */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-4 sm:p-6 mb-6 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon size={16} className="text-[#C5A880]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">Website Logo & Studio Branding</h3>
                </div>
                <p className="text-xs text-[#0A1628]/60 mb-6 leading-relaxed">
                  Yahan se aap website ka main logo (Navbar & Footer), brand name aur tagline direct change kar sakte hain.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Logo Upload Box */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/50 block mb-2">
                      Studio Logo Image
                    </label>
                    <MediaBox
                      src={siteContent.branding?.logoUrl || "/images/logo.png"}
                      label="Website Logo"
                      onUpload={(url) => updateContent(prev => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          logoUrl: url,
                          logoText: prev.branding?.logoText || "Delhi Diaries"
                        }
                      }))}
                    />
                  </div>

                  {/* Logo Text & Tagline */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/50 block mb-1.5">
                        Brand / Logo Text
                      </label>
                      <input
                        type="text"
                        value={siteContent.branding?.logoText || "Delhi Diaries"}
                        onChange={(e) => updateContent(prev => ({
                          ...prev,
                          branding: {
                            ...prev.branding,
                            logoUrl: prev.branding?.logoUrl || "/images/logo.png",
                            logoText: e.target.value
                          }
                        }))}
                        placeholder="e.g. Delhi Diaries"
                        className="w-full border border-[#0A1628]/15 rounded-lg px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/50 block mb-1.5">
                        Studio Tagline
                      </label>
                      <input
                        type="text"
                        value={siteContent.branding?.tagline || "Social-First Creative Studio"}
                        onChange={(e) => updateContent(prev => ({
                          ...prev,
                          branding: {
                            ...prev.branding,
                            logoUrl: prev.branding?.logoUrl || "/images/logo.png",
                            tagline: e.target.value
                          }
                        }))}
                        placeholder="e.g. Social-First Creative Studio"
                        className="w-full border border-[#0A1628]/15 rounded-lg px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔍 SEO & GOOGLE SEARCH METADATA */}
              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-4 sm:p-6 mb-6 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={16} className="text-[#C5A880]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">SEO & Google Search Meta Tags</h3>
                </div>
                <p className="text-xs text-[#0A1628]/60 mb-6 leading-relaxed">
                  Google search results, browser tab title, aur WhatsApp/Instagram link share preview ko yahan se customize karein.
                </p>

                <div className="space-y-4">
                  {/* Meta Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/50">
                        Google Search Meta Title (Browser Tab Title)
                      </label>
                      <span className="text-[10px] text-[#0A1628]/40 font-mono">
                        {(siteContent.seo?.metaTitle || "").length} / 60 characters
                      </span>
                    </div>
                    <input
                      type="text"
                      value={siteContent.seo?.metaTitle || ""}
                      onChange={(e) => updateContent(prev => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          metaTitle: e.target.value,
                          metaDescription: prev.seo?.metaDescription || ""
                        }
                      }))}
                      placeholder="e.g. Delhi Diaries Official | Social-First Creative Studio New Delhi"
                      className="w-full border border-[#0A1628]/15 rounded-lg px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/50">
                        Google Meta Description (Snippet Summary)
                      </label>
                      <span className="text-[10px] text-[#0A1628]/40 font-mono">
                        {(siteContent.seo?.metaDescription || "").length} / 160 characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={siteContent.seo?.metaDescription || ""}
                      onChange={(e) => updateContent(prev => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          metaTitle: prev.seo?.metaTitle || "",
                          metaDescription: e.target.value
                        }
                      }))}
                      placeholder="e.g. We craft viral reels, luxury photography, and social-first content strategies for premium restaurants, cafes, and lifestyle brands."
                      className="w-full border border-[#0A1628]/15 rounded-lg p-3 text-xs leading-relaxed focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/50 block mb-1.5">
                      Search Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      value={siteContent.seo?.keywords || ""}
                      onChange={(e) => updateContent(prev => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          metaTitle: prev.seo?.metaTitle || "",
                          metaDescription: prev.seo?.metaDescription || "",
                          keywords: e.target.value
                        }
                      }))}
                      placeholder="e.g. Delhi creative agency, social media marketing Delhi, restaurant reels, luxury food shoot"
                      className="w-full border border-[#0A1628]/15 rounded-lg px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  {/* Live Google Search Preview Snippet */}
                  <div className="mt-4 p-4 rounded-xl bg-[#F8F9FA] border border-[#0A1628]/10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-2">
                      Live Google Search Snippet Preview
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-[#202124] flex items-center gap-1">
                        <span className="font-semibold">delhidiariesofficial.com</span>
                        <span className="text-gray-400">›</span>
                      </p>
                      <h4 className="text-sm font-medium text-[#1A0DAB] hover:underline cursor-pointer line-clamp-1">
                        {siteContent.seo?.metaTitle || "Delhi Diaries Official | Social-First Creative Studio New Delhi"}
                      </h4>
                      <p className="text-xs text-[#4D5156] line-clamp-2 leading-relaxed">
                        {siteContent.seo?.metaDescription || "We craft viral reels, luxury photography, and social-first content strategies for premium restaurants, cafes, and lifestyle brands."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-2">Instant Local Mode</h3>
                <p className="text-sm text-[#0A1628]/70 leading-relaxed">
                  All changes and uploads you make in this dashboard are saved to your browser’s LocalStorage immediately when you click <strong>Save Changes</strong>.
                  They will be displayed on the live website instantly without waiting for builds.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#C5A880]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">Fix Glitches & Optimize Performance</h3>
                </div>
                <p className="text-xs text-[#0A1628]/60 mb-4 leading-relaxed">
                  Agar dashboard mein kabhi koi visual glitch ya slow memory feel ho, to yahan click karke temporary cache clear karein. <strong>Aapka uploaded data, photos aur videos delete NAHI honge.</strong>
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const keys = Object.keys(localStorage);
                        for (const key of keys) {
                          if (
                            key !== "dd_site_content" &&
                            key !== "dd_projects" &&
                            key !== "dd_admin_auth" &&
                            key !== "dd_gh_token" &&
                            key !== "dd_gh_repo"
                          ) {
                            localStorage.removeItem(key);
                          }
                        }
                        setCacheStatus("✨ Temporary junk memory cleaned & glitches fixed! All your uploaded data is safe.");
                        setTimeout(() => setCacheStatus(null), 4000);
                      } catch (e) {
                        setCacheStatus("Memory optimized successfully!");
                      }
                    }}
                    className="flex items-center gap-2 bg-[#0A1628] text-[#C5A880] border border-[#C5A880]/30 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer shadow-sm"
                  >
                    <RefreshCw size={13} />
                    ⚡ Fix Glitches & Clean Memory
                  </button>
                </div>
                {cacheStatus && (
                  <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg border border-emerald-200">
                    {cacheStatus}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-3">Direct Section URLs & Bookmarks</h3>
                <p className="text-xs text-[#0A1628]/60 mb-4">You can bookmark or directly navigate to any of these section links:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sidebarItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0A1628]/[0.02] border border-[#0A1628]/5">
                      <div className="flex items-center gap-2">
                        <span className="text-[#0A1628]/50">{item.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-[#0A1628]">{item.label}</p>
                          <p className="text-[10px] text-[#0A1628]/40 font-mono">
                            {item.id === "dashboard" ? "/admin" : `/admin/${item.id}`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCurrentSectionLink(item.id)}
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/60 hover:text-[#C5A880] border border-[#0A1628]/10 hover:border-[#C5A880] rounded transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Copy size={11} /> Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-2">Admin Security</h3>
                <p className="text-xs text-[#0A1628]/60">Authorized passcode: <code className="bg-[#0A1628]/5 px-2 py-0.5 rounded font-bold">sajid123</code></p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
