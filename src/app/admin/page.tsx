"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Save, Key, Eye, EyeOff,
  LayoutDashboard, Sparkles, Film, Grid3X3, Briefcase,
  Globe, MessageSquare, Phone, Settings, LogOut,
  Upload, Trash2, Plus, ChevronRight, Image as ImageIcon,
  Video, Menu, X, Check, Eye as EyeIcon, EyeOff as EyeOffIcon,
  Copy, Download, Code, Play, Rocket, RefreshCw, CheckCircle2, AlertCircle
} from "lucide-react";
import { projects as initialProjects, Project } from "@/data/projects";
import { defaultSiteContent, SiteContent } from "@/data/siteContent";
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
            <video src={src} className="w-full h-full object-cover" muted loop playsInline />
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
  // Auth state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  // Navigation
  const [activePage, setActivePage] = useState<SidebarPage>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // GitHub Auto-Deploy State (Loaded safely from .env.local / localStorage)
  const [ghToken, setGhToken] = useState(process.env.NEXT_PUBLIC_GITHUB_PAT || "");
  const [ghRepo, setGhRepo] = useState(process.env.NEXT_PUBLIC_GITHUB_REPO || "Farazjafri5/sajid-delhi-dairy");
  const [ghBranch, setGhBranch] = useState(process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Load custom token from localStorage if saved in UI
  useEffect(() => {
    const savedToken = localStorage.getItem("dd_gh_token");
    if (savedToken) setGhToken(savedToken);
    const savedRepo = localStorage.getItem("dd_gh_repo");
    if (savedRepo) setGhRepo(savedRepo);
  }, []);

  // 1-Click Direct Commit & Deploy to GitHub
  const handleGitHubDeploy = async () => {
    if (!ghToken) {
      alert("Please enter a GitHub Personal Access Token.");
      return;
    }
    setIsDeploying(true);
    setDeployStatus(null);

    try {
      // 1. Prepare file content with clean type imports
      const newFileContent = `// Auto-generated from Delhi Diaries Admin Panel
import { SiteContent } from "@/types/siteContent";
export * from "@/types/siteContent";

export const defaultSiteContent: SiteContent = ${JSON.stringify(siteContent, null, 2)};
`;

      // 2. Call Server-side Secure Deploy API (Bypasses Browser CORS / Adblockers)
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: ghToken,
          repo: ghRepo,
          branch: ghBranch,
          content: newFileContent,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        const msg = "🎉 Success! Changes committed to GitHub. Vercel is now building and deploying your live site (takes ~20 seconds)!";
        setDeployStatus({
          success: true,
          message: msg,
        });
        try {
          saveAll();
        } catch (e) {}
        alert(msg);
      } else {
        const msg = `⚠️ GitHub Deploy Failed: ${data.error || "Please check your GitHub Token permissions in the '1-Click GitHub Deploy' tab."}`;
        setDeployStatus({
          success: false,
          message: msg,
        });
        alert(msg);
      }
    } catch (err: any) {
      const msg = `⚠️ Deploy Error: ${err.message || "Failed to connect to GitHub API."}`;
      setDeployStatus({
        success: false,
        message: msg,
      });
      alert(msg);
    } finally {
      setIsDeploying(false);
    }
  };

  // Project editor
  const [editingProjectSlug, setEditingProjectSlug] = useState<string | null>(null);

  // Check login session
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("dd_admin_auth");
    if (isLoggedIn === "true") setIsAuthenticated(true);
  }, []);

  // Load data
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load projects
    let loadedProjects = [...initialProjects];
    const localProjects = localStorage.getItem("dd_projects");
    if (localProjects) {
      try { loadedProjects = JSON.parse(localProjects); } catch {}
    }
    setProjects(loadedProjects);

    // Load site content
    const localContent = localStorage.getItem("dd_site_content");
    if (localContent) {
      try { setSiteContent(JSON.parse(localContent)); } catch {}
    }
  }, [isAuthenticated]);

  // Auth handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === "sajid123") {
      sessionStorage.setItem("dd_admin_auth", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Wrong password. Contact admin for access.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dd_admin_auth");
    setIsAuthenticated(false);
  };

  // Save all data safely (guarded against localStorage quota limits)
  const saveAll = () => {
    try {
      localStorage.setItem("dd_projects", JSON.stringify(projects));
    } catch (e) {
      console.warn("Could not cache projects in localStorage (quota exceeded)", e);
    }
    try {
      localStorage.setItem("dd_site_content", JSON.stringify(siteContent));
    } catch (e) {
      console.warn("Could not cache siteContent in localStorage (quota exceeded)", e);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Update site content helper
  const updateContent = (updater: (prev: SiteContent) => SiteContent) => {
    setSiteContent((prev) => updater(prev));
  };

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

  // ─── Stats for Dashboard ──────────────────────────────────────
  const totalImages = (siteContent.industries?.length || 0) + (siteContent.instagramFeed?.length || 0) + (siteContent.showreel?.leftImages?.length || 0) + (siteContent.showreel?.rightImages?.length || 0);
  const totalVideos = (siteContent.showreel?.centerVideos?.length || 0) + (siteContent.hero?.mockReels?.length || 0);
  const activeProjects = projects.filter(p => !p.slug.startsWith("inactive:")).length;

  // ─── Editing project helper ───────────────────────────────────
  const editingProject = editingProjectSlug ? projects.find(p => p.slug === editingProjectSlug) : null;
  const updateProject = (slug: string, updater: (p: Project) => Project) => {
    setProjects(prev => prev.map(p => p.slug === slug ? updater(p) : p));
  };

  // Generate code string for permanent git commit
  const generatedCode = `// Generated from Delhi Diaries Admin Panel
import { SiteContent } from "@/data/siteContent";

export const siteContent: SiteContent = ${JSON.stringify(siteContent, null, 2)};
`;

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
              onClick={() => { setActivePage(item.id); setMobileSidebarOpen(false); setEditingProjectSlug(null); }}
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
        <header className="bg-white border-b border-[#0A1628]/5 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden text-[#0A1628] cursor-pointer">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-[#0A1628] capitalize">{activePage === "dashboard" ? "Dashboard Overview" : sidebarItems.find(s => s.id === activePage)?.label}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isDeploying}
              onClick={handleGitHubDeploy}
              className="flex items-center gap-2 bg-[#0A1628] text-[#C5A880] border border-[#C5A880]/30 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
              title="1-Click commit and auto-deploy to GitHub & Vercel live for all visitors"
            >
              {isDeploying ? <RefreshCw size={14} className="animate-spin" /> : <Rocket size={14} />}
              {isDeploying ? "Deploying Live..." : "🚀 Deploy to Live Site"}
            </button>
            <button
              onClick={saveAll}
              className="flex items-center gap-2 bg-[#C5A880] text-[#0A1628] px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#BCA078] transition-colors cursor-pointer shadow-sm"
            >
              {isSaved ? <Check size={14} /> : <Save size={14} />}
              {isSaved ? "Saved to Site!" : "Save Changes"}
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
              <h3 className="text-sm font-bold text-[#0A1628]/60 uppercase tracking-wider mb-4">Manage Content Sections</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sidebarItems.filter(s => s.id !== "dashboard").map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className="flex items-center justify-between bg-white rounded-xl border border-[#0A1628]/5 p-4 hover:border-[#C5A880]/50 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-[#0A1628]/40 group-hover:text-[#C5A880] transition-colors">{item.icon}</div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-[#0A1628]/20 group-hover:text-[#C5A880] transition-colors" />
                  </button>
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
                          poster: "/images/project_restaurant.png",
                          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42207-large.mp4",
                          caption: "New viral reel content by Delhi Diaries",
                          likes: "15.2k",
                          comments: "240",
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
                        leftImages: [...c.showreel.leftImages, { src: "/images/project_cafe.png", label: "New Photo", active: true }]
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
                            src: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42207-large.mp4",
                            poster: "/images/project_restaurant.png",
                            label: "Watch New Showcase",
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
                      <div key={idx} className={`p-4 border rounded-xl ${isActive ? "border-[#0A1628]/5 bg-white" : "border-red-200 bg-red-50/20"}`}>
                        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
                          <MediaBox
                            src={vid.src || vid.poster}
                            label={vid.label}
                            isActive={isActive}
                            onToggleActive={() => updateContent(c => {
                              const vids = [...c.showreel.centerVideos];
                              vids[idx] = { ...vids[idx], active: !isActive };
                              return { ...c, showreel: { ...c.showreel, centerVideos: vids } };
                            })}
                            onUpload={(b64) => updateContent(c => {
                              const vids = [...c.showreel.centerVideos];
                              if (b64.startsWith("data:video")) {
                                vids[idx] = { ...vids[idx], src: b64 };
                              } else {
                                vids[idx] = { ...vids[idx], poster: b64 };
                              }
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
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">Video Reel #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => updateContent(c => {
                                  const vids = [...c.showreel.centerVideos];
                                  vids[idx] = { ...vids[idx], active: !isActive };
                                  return { ...c, showreel: { ...c.showreel, centerVideos: vids } };
                                })}
                                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full cursor-pointer ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                              >
                                {isActive ? "● Active" : "○ Inactive"}
                              </button>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-wider text-[#0A1628]/40 mb-1 block">Label / Button Text</label>
                              <input value={vid.label} onChange={(e) => updateContent(c => {
                                const vids = [...c.showreel.centerVideos];
                                vids[idx] = { ...vids[idx], label: e.target.value };
                                return { ...c, showreel: { ...c.showreel, centerVideos: vids } };
                              })} className="w-full border border-[#0A1628]/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A880]" />
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
                        rightImages: [...c.showreel.rightImages, { src: "/images/project_lifestyle.png", label: "New Photo", active: true }]
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
                        name: "New Industry",
                        statement: "Transform your industry presence.",
                        image: "/images/project_restaurant.png",
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
                      client: "New Brand",
                      title: "Brand Campaign: Title Here",
                      subtitle: "A short memorable subtitle about the project.",
                      industry: "Restaurant & Hospitality",
                      services: ["Social Media Management", "Reels Production"],
                      description: "Detailed description of the client engagement and creative execution.",
                      image: "/images/project_restaurant.png",
                      video: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42207-large.mp4",
                      brief: "The core challenge and brief provided by the brand.",
                      idea: "Our custom visual strategy and creative idea for the campaign.",
                      execution: "How we produced, filmed, and published the content.",
                      results: ["+100% Growth", "1M+ Impressions", "+20K Followers", "15% Engagement Rate"],
                      gallery: ["/images/restaurant_1.png", "/images/restaurant_2.png", "/images/restaurant_3.png"],
                      reels: ["https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-pouring-milk-into-a-cup-of-coffee-41875-large.mp4"]
                    };
                    setProjects(prev => [...prev, newProj]);
                    setEditingProjectSlug(newSlug);
                  }}
                  className="flex items-center gap-2 bg-[#0A1628] text-[#C5A880] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus size={14} /> Add New Project
                </button>
              </div>

              <div className="bg-white rounded-xl border border-[#0A1628]/5 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-[#0A1628]/[0.02] border-b border-[#0A1628]/5">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#0A1628]/40">Cover</th>
                      <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#0A1628]/40">Project</th>
                      <th className="px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-[#0A1628]/40 hidden md:table-cell">Industry</th>
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
                          <td className="px-6 py-3 hidden md:table-cell text-xs text-[#0A1628]/60">{proj.industry}</td>
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
                      gallery: [...p.gallery, "/images/restaurant_1.png"]
                    }))}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#C5A880] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] cursor-pointer"
                  >
                    <Plus size={12} /> Add Photo
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editingProject.gallery.map((img, idx) => {
                    const isActive = !img.startsWith("inactive:");
                    const cleanSrc = img.replace("inactive:", "");
                    return (
                      <div key={idx}>
                        <MediaBox
                          src={cleanSrc}
                          label={`Gallery Photo ${idx + 1}`}
                          isActive={isActive}
                          onToggleActive={() => updateProject(editingProject.slug, p => {
                            const g = [...p.gallery];
                            g[idx] = isActive ? `inactive:${cleanSrc}` : cleanSrc;
                            return { ...p, gallery: g };
                          })}
                          onUpload={(b64) => updateProject(editingProject.slug, p => {
                            const g = [...p.gallery];
                            g[idx] = isActive ? b64 : `inactive:${b64}`;
                            return { ...p, gallery: g };
                          })}
                          onRemove={() => updateProject(editingProject.slug, p => ({
                            ...p,
                            gallery: p.gallery.filter((_, i) => i !== idx)
                          }))}
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
                      reels: [...p.reels, "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42207-large.mp4"]
                    }))}
                    className="flex items-center gap-1.5 bg-[#0A1628] text-[#C5A880] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#111D30] cursor-pointer"
                  >
                    <Plus size={12} /> Add Reel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editingProject.reels.map((reelUrl, idx) => {
                    const isActive = !reelUrl.startsWith("inactive:");
                    const cleanUrl = reelUrl.replace("inactive:", "");
                    return (
                      <div key={idx}>
                        <MediaBox
                          src={cleanUrl}
                          label={`Reel Video ${idx + 1}`}
                          isActive={isActive}
                          onToggleActive={() => updateProject(editingProject.slug, p => {
                            const r = [...p.reels];
                            r[idx] = isActive ? `inactive:${cleanUrl}` : cleanUrl;
                            return { ...p, reels: r };
                          })}
                          onUpload={(b64) => updateProject(editingProject.slug, p => {
                            const r = [...p.reels];
                            r[idx] = isActive ? b64 : `inactive:${b64}`;
                            return { ...p, reels: r };
                          })}
                          onRemove={() => updateProject(editingProject.slug, p => ({
                            ...p,
                            reels: p.reels.filter((_, i) => i !== idx)
                          }))}
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
                        client: "New Client",
                        campaign: "Campaign Name",
                        image: "/images/restaurant_1.png",
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
                        quote: "Delhi Diaries delivered phenomenal content that transformed our engagement and sales.",
                        author: "Founder Name",
                        company: "Brand Name",
                        industry: "Industry Type",
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
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A1628]">Or Copy Code Manually (Optional Backup)</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="flex items-center gap-2 bg-[#C5A880] text-[#0A1628] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#BCA078] cursor-pointer"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied ? "Copied!" : "Copy Code to Clipboard"}
                  </button>
                </div>
                <pre className="bg-[#0A1628] text-white/80 p-4 rounded-lg text-xs font-mono max-h-[300px] overflow-auto select-all">
                  {generatedCode}
                </pre>
              </div>
            </div>
          )}

          {/* ═══ SETTINGS ═══ */}
          {activePage === "settings" && (
            <div>
              <SectionHeader title="Dashboard Settings" subtitle="Storage configuration and defaults control" />

              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-2">Instant Local Mode</h3>
                <p className="text-sm text-[#0A1628]/70 leading-relaxed">
                  All changes and uploads you make in this dashboard are saved to your browser’s LocalStorage immediately when you click <strong>Save Changes</strong>.
                  They will be displayed on the live website instantly without waiting for builds.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#0A1628]/5 p-6 mb-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1628]/40 mb-2">Reset to Original Defaults</h3>
                <p className="text-xs text-[#0A1628]/40 mb-4">If you want to clear all your uploads and return to initial default content, click below:</p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to reset all content to factory defaults?")) {
                      localStorage.removeItem("dd_projects");
                      localStorage.removeItem("dd_site_content");
                      setProjects([...initialProjects]);
                      setSiteContent(defaultSiteContent);
                    }
                  }}
                  className="bg-red-500 text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Reset Everything to Defaults
                </button>
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
