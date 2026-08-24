"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Film, 
  Image as ImageIcon, 
  Play, 
  Heart, 
  MessageCircle, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Volume2, 
  VolumeX, 
  X,
  Sparkles,
  Grid
} from "lucide-react";
import { InstagramTile } from "@/types/siteContent";
import { getOptimizedImageUrl, getOptimizedVideoUrl } from "@/lib/media";

function Instagram({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface InstagramFeedShowcaseProps {
  initialTiles?: InstagramTile[];
  accountHandle?: string;
  accountUrl?: string;
  beholdFeedId?: string;
  curatorFeedId?: string;
  provider?: "curator" | "behold" | "hybrid";
  hiddenPostIds?: string[];
  hiddenPermalinks?: string[];
}

export default function InstagramFeedShowcase({
  initialTiles = [],
  accountHandle = "socialdiariesagency.co",
  accountUrl = "https://www.instagram.com/socialdiariesagency.co/",
  beholdFeedId,
  curatorFeedId = "94d8f687-7cf1-4d83-a2ee-334e1dbf323a",
  provider = "curator",
  hiddenPostIds = [],
  hiddenPermalinks = [],
}: InstagramFeedShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"all" | "reels" | "photos">("all");
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userLimit, setUserLimit] = useState<number | null>(null);
  const [feedList, setFeedList] = useState<InstagramTile[]>(initialTiles || []);
  const [hiddenIds, setHiddenIds] = useState<string[]>(hiddenPostIds || []);
  const [hiddenLinks, setHiddenLinks] = useState<string[]>(hiddenPermalinks || []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const syncHiddenFromStorage = () => {
      try {
        const directIds = localStorage.getItem("dd_hidden_instagram_ids");
        const directLinks = localStorage.getItem("dd_hidden_instagram_links");
        if (directIds) {
          setHiddenIds(JSON.parse(directIds));
        }
        if (directLinks) {
          setHiddenLinks(JSON.parse(directLinks));
        }

        const cached = localStorage.getItem("dd_site_content");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.instagramSettings?.hiddenPostIds) {
            setHiddenIds(parsed.instagramSettings.hiddenPostIds);
          }
          if (parsed?.instagramSettings?.hiddenPermalinks) {
            setHiddenLinks(parsed.instagramSettings.hiddenPermalinks);
          }
        }
      } catch (e) {}
    };

    syncHiddenFromStorage();
    window.addEventListener("instagram_hidden_changed", syncHiddenFromStorage);
    window.addEventListener("storage", syncHiddenFromStorage);
    return () => {
      window.removeEventListener("instagram_hidden_changed", syncHiddenFromStorage);
      window.removeEventListener("storage", syncHiddenFromStorage);
    };
  }, [hiddenPostIds, hiddenPermalinks]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const defaultLimit = isMobile ? 6 : 9;
  const stepCount = isMobile ? 6 : 9;

  const activeCuratorId = curatorFeedId || process.env.NEXT_PUBLIC_CURATOR_FEED_ID || "94d8f687-7cf1-4d83-a2ee-334e1dbf323a";
  const activeBeholdId = beholdFeedId || process.env.NEXT_PUBLIC_BEHOLD_FEED_ID || "jMYKX8SAVZtq7lMpJFRx";

  // Live Auto-fetch and merge from Curator.io + Behold Feed APIs
  React.useEffect(() => {
    let isMounted = true;
    const fetchAllFeeds = async () => {
      const mergedTiles: InstagramTile[] = [];
      const seenShortcodes = new Set<string>();

      // 1. Fetch Curator Feed
      if (activeCuratorId) {
        try {
          const cRes = await fetch(`https://api.curator.io/v1/feeds/${activeCuratorId}/posts`);
          if (cRes.ok) {
            const cJson = await cRes.json();
            const posts = cJson?.posts || cJson?.data || [];
            posts.forEach((item: any, i: number) => {
              const cleanUrl = item.url || item.user_url || "";
              const shortcode = cleanUrl.split("/").filter(Boolean).pop() || cleanUrl;
              if (shortcode) seenShortcodes.add(shortcode);

              const isVideo = item.has_video === 1 || !!item.video;
              const imgSrc = item.image_large || item.image_xlarge || item.image || item.thumbnail || item.user_image || "";
              mergedTiles.push({
                id: `curator-${item.id || item.source_identifier || i}`,
                type: isVideo ? "Reel" : "Photo",
                client: item.user_full_name || item.user_screen_name || "Social Diaries",
                campaign: item.text ? (item.text.slice(0, 35) + "...") : (isVideo ? "Instagram Reel" : "Instagram Photo"),
                caption: item.text || "Live from Instagram @socialdiariesagency.co",
                image: imgSrc,
                videoUrl: isVideo ? (item.video || undefined) : undefined,
                permalink: cleanUrl || accountUrl,
                likes: item.likes !== undefined ? item.likes.toString() : "0",
                comments: item.comments !== undefined ? item.comments.toString() : "0",
                active: true,
              });
            });
          }
        } catch (e) {}
      }

      // 2. Fetch Behold Feed & merge missing posts
      if (activeBeholdId) {
        try {
          const bRes = await fetch(`https://feeds.behold.so/${activeBeholdId}`);
          if (bRes.ok) {
            const bJson = await bRes.json();
            const bPosts = Array.isArray(bJson) ? bJson : (bJson?.posts || []);
            bPosts.forEach((item: any, i: number) => {
              const cleanUrl = item.permalink || "";
              const shortcode = cleanUrl.split("/").filter(Boolean).pop() || cleanUrl;
              if (!shortcode || !seenShortcodes.has(shortcode)) {
                if (shortcode) seenShortcodes.add(shortcode);

                const isVideo = item.mediaType === "VIDEO" || item.mediaType === "REEL" || !!item.videoUrl || (item.mediaUrl && typeof item.mediaUrl === "string" && item.mediaUrl.includes(".mp4"));
                const imgSrc = item.sizes?.large?.mediaUrl || item.sizes?.medium?.mediaUrl || item.thumbnailUrl || item.mediaUrl || "";
                mergedTiles.push({
                  id: item.id || `behold-${i}`,
                  type: isVideo ? "Reel" : "Photo",
                  client: "Social Diaries",
                  campaign: item.caption ? (item.caption.slice(0, 35) + "...") : (isVideo ? "Instagram Reel" : "Instagram Photo"),
                  caption: item.caption || "Live from Instagram @socialdiariesagency.co",
                  image: imgSrc,
                  videoUrl: isVideo ? (item.mediaUrl || item.videoUrl) : undefined,
                  permalink: cleanUrl || accountUrl,
                  likes: item.likeCount !== undefined ? `${item.likeCount}` : "0",
                  comments: item.commentsCount !== undefined ? `${item.commentsCount}` : "0",
                  active: true,
                });
              }
            });
          }
        } catch (e) {}
      }

      if (isMounted && mergedTiles.length > 0) {
        setFeedList(mergedTiles);
      }
    };

    fetchAllFeeds();
    return () => { isMounted = false; };
  }, [activeCuratorId, activeBeholdId, beholdFeedId, curatorFeedId, accountUrl]);

  // Modals
  const [activeReel, setActiveReel] = useState<InstagramTile | null>(null);
  const [isReelMuted, setIsReelMuted] = useState<boolean>(false);
  const [activePhoto, setActivePhoto] = useState<InstagramTile | null>(null);

  // Helper to extract Instagram shortcode (e.g. Dca8QVTE9eN)
  const extractCode = (url?: string) => {
    if (!url) return "";
    const m = url.match(/\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
    return m ? m[1] : "";
  };

  // Filter active and non-hidden items (100% reliable matching)
  const activeItems = useMemo(() => {
    return (feedList || []).filter((item) => {
      if (!item || item.active === false) return false;
      const itemId = String(item.id || "");
      if (itemId && hiddenIds.some(hId => String(hId) === itemId)) return false;

      const itemPermalink = item.permalink || (item as any).url || "";
      const itemCode = extractCode(itemPermalink);

      if (itemCode && hiddenLinks.some(link => extractCode(link) === itemCode)) return false;
      if (itemPermalink && hiddenLinks.some(link => link && (itemPermalink.includes(link) || link.includes(itemPermalink)))) return false;
      if (itemCode && hiddenIds.includes(itemCode)) return false;

      return true;
    });
  }, [feedList, hiddenIds, hiddenLinks]);

  // Tab counts
  const reelsCount = useMemo(() => {
    return activeItems.filter((i) => {
      const type = (i.type || "").toLowerCase();
      return type.includes("reel") || type.includes("video") || !!i.videoUrl;
    }).length;
  }, [activeItems]);

  const photosCount = useMemo(() => {
    return activeItems.filter((i) => {
      const type = (i.type || "").toLowerCase();
      return !type.includes("reel") && !type.includes("video") && !i.videoUrl;
    }).length;
  }, [activeItems]);

  // Filtered list based on active tab
  const filteredItems = useMemo(() => {
    if (activeTab === "reels") {
      return activeItems.filter((i) => {
        const type = (i.type || "").toLowerCase();
        return type.includes("reel") || type.includes("video") || !!i.videoUrl;
      });
    }
    if (activeTab === "photos") {
      return activeItems.filter((i) => {
        const type = (i.type || "").toLowerCase();
        return !type.includes("reel") && !type.includes("video") && !i.videoUrl;
      });
    }
    return activeItems;
  }, [activeItems, activeTab]);

  // Sliced items for display (Starts with 9 on laptop, 6 on mobile)
  const activeLimit = userLimit === null ? defaultLimit : userLimit;
  const displayedItems = filteredItems.slice(0, activeLimit);
  const hasMore = activeLimit < filteredItems.length;
  const isExpanded = activeLimit > defaultLimit;

  const handleLoadMore = () => {
    setUserLimit((prev) => (prev === null ? defaultLimit : prev) + stepCount);
  };

  const handleViewAll = () => {
    setUserLimit(filteredItems.length);
  };

  const handleViewLess = () => {
    setUserLimit(defaultLimit);
  };

  const isItemReel = (item: InstagramTile) => {
    const type = (item.type || "").toLowerCase();
    return type.includes("reel") || type.includes("video") || !!item.videoUrl;
  };

  return (
    <section className="relative py-15 bg-[#0D0D0D] text-studio-bg overflow-hidden border-b border-white/10">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#833AB4]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-8 md:px-12 lg:px-20 relative z-10">
        {/* ═══ 1. HEADER & INSTAGRAM BRANDING ═══ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div>
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#F58529]/15 via-[#DD2A7B]/15 to-[#8134AF]/15 border border-[#DD2A7B]/30 text-[10px] font-bold uppercase tracking-widest text-[#F58529] mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DD2A7B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DD2A7B]" />
              </span>
              <span>Live Social Stream</span>
              <Sparkles size={11} className="text-[#F58529]" />
            </div>

            <h2 className="heading-serif-section text-studio-bg uppercase">
              The Daily Reel Journal.
            </h2>
            <p className="mt-3 text-xs md:text-sm text-studio-bg/60 max-w-xl font-normal leading-relaxed">
              Real-time campaigns, viral reels, and behind-the-lens studio captures from our Delhi headquarters.
            </p>
          </div>

          {/* Instagram Profile Action Pill */}
          <a
            href={accountUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-2xl transition-all duration-300 shadow-lg cursor-pointer self-start md:self-auto"
          >
            {/* Instagram Gradient Ring Avatar */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[1.5px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0D0D0D]">
                <Instagram size={16} className="text-white" />
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">@{accountHandle}</span>
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#3897F0] text-[8px] font-bold text-white">✓</span>
              </div>
              <span className="text-[10px] text-white/50 group-hover:text-[#C5A880] transition-colors">Follow for daily drops</span>
            </div>
            <ExternalLink size={14} className="text-white/40 group-hover:text-white transition-colors ml-1" />
          </a>
        </div>

        {/* ═══ 2. FILTER TABS (All | Reels | Photos) ═══ */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:justify-start sm:gap-2.5 mb-8 w-full max-w-full">
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              setActiveTab("all");
              setUserLimit(null);
            }}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === "all"
                ? "bg-[#C5A880] text-[#0A1628] shadow-md scale-102"
                : "bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/5"
            }`}
          >
            <Grid size={13} className="shrink-0" />
            <span>All</span>
            <span suppressHydrationWarning className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${activeTab === "all" ? "bg-[#0A1628]/20 text-[#0A1628]" : "bg-white/10 text-white/70"}`}>
              {activeItems.length}
            </span>
          </button>

          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              setActiveTab("reels");
              setUserLimit(null);
            }}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === "reels"
                ? "bg-[#C5A880] text-[#0A1628] shadow-md scale-102"
                : "bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/5"
            }`}
          >
            <Film size={13} className="shrink-0" />
            <span>Reels</span>
            <span suppressHydrationWarning className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${activeTab === "reels" ? "bg-[#0A1628]/20 text-[#0A1628]" : "bg-white/10 text-white/70"}`}>
              {reelsCount}
            </span>
          </button>

          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              setActiveTab("photos");
              setUserLimit(null);
            }}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === "photos"
                ? "bg-[#C5A880] text-[#0A1628] shadow-md scale-102"
                : "bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/5"
            }`}
          >
            <ImageIcon size={13} className="shrink-0" />
            <span>Photos</span>
            <span suppressHydrationWarning className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${activeTab === "photos" ? "bg-[#0A1628]/20 text-[#0A1628]" : "bg-white/10 text-white/70"}`}>
              {photosCount}
            </span>
          </button>
        </div>

        {/* ═══ 3. INSTAGRAM 3x3 GRID (9 Items Default) ═══ */}
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item, idx) => {
              const isReel = isItemReel(item);
              return (
                <motion.div
                  layout
                  key={item.id || `${item.client}-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: idx * 0.03 }}
                  onClick={() => {
                    if (isReel) {
                      setActiveReel(item);
                      setIsReelMuted(false);
                    } else {
                      setActivePhoto(item);
                    }
                  }}
                  className="group relative aspect-square bg-white/[0.03] rounded-2xl overflow-hidden cursor-pointer border border-white/10 shadow-lg hover:border-[#C5A880]/50 hover:shadow-2xl transition-all duration-500"
                >
                  {/* Thumbnail Image */}
                  <Image
                    src={getOptimizedImageUrl(item.image)}
                    alt={item.campaign || item.caption || "Instagram post"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />

                  {/* Top Right Media Type Badge (Reel or Photo) */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    {isReel ? (
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider border border-white/15">
                        <Play size={10} fill="currentColor" />
                        <span>Reel</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
                        <ImageIcon size={11} />
                      </div>
                    )}
                  </div>

                  {/* Client / Campaign Tag at Bottom Left */}
                  <div className="absolute bottom-2.5 left-2.5 z-10 max-w-[80%] truncate">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10 truncate block">
                      {item.client || item.campaign || "Social Diaries"}
                    </span>
                  </div>

                  {/* Hover Overlay with Likes, Comments & Caption Preview */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-20">
                    <div className="flex items-center justify-end">
                      <div className="h-8 w-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                        {isReel ? <Play size={14} fill="currentColor" /> : <ExternalLink size={14} />}
                      </div>
                    </div>

                    <div className="text-left space-y-2">
                      {item.caption && (
                        <p className="text-[11px] text-white/90 font-medium line-clamp-2 leading-relaxed">
                          {item.caption}
                        </p>
                      )}
                      
                      {/* Engagement Stats */}
                      <div className="flex items-center gap-4 text-xs font-bold text-white pt-1">
                        <span className="flex items-center gap-1">
                          <Heart size={13} className="text-red-400 fill-red-400" />
                          {item.likes || "12.4k"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={13} className="text-white/80" />
                          {item.comments || "240"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* ═══ 4. VIEW MORE / VIEW LESS / VIEW ALL & INSTAGRAM CTA ═══ */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          {/* View More Button */}
          {hasMore && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={handleLoadMore}
              className="flex items-center gap-2 bg-[#C5A880] text-[#0A1628] hover:bg-[#D4BC98] px-5 sm:px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl cursor-pointer active:scale-95"
            >
              <span suppressHydrationWarning>View More ({filteredItems.length - activeLimit} Remaining)</span>
              <ChevronDown size={15} />
            </button>
          )}

          {/* View Less Button */}
          {isExpanded && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={handleViewLess}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 sm:px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl cursor-pointer active:scale-95"
            >
              <span>View Less</span>
              <ChevronUp size={15} />
            </button>
          )}

          {/* Direct Instagram Profile Link */}
          <a
            href={accountUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white px-5 sm:px-7 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-xl cursor-pointer active:scale-95 text-center whitespace-nowrap"
          >
            <Instagram size={16} className="shrink-0" />
            <span>Explore on @{accountHandle}</span>
            <ExternalLink size={14} className="shrink-0 opacity-90" />
          </a>
        </div>
      </div>

      {/* ═══ 5. FULL INSTAGRAM REEL VIDEO PLAYER MODAL ═══ */}
      <AnimatePresence>
        {activeReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6"
            onClick={() => setActiveReel(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[85vh] bg-[#111111] rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col justify-between"
            >
              {/* Video Player */}
              <video
                src={getOptimizedVideoUrl(activeReel.videoUrl || "/videos/restaurant_dining.mp4")}
                autoPlay
                loop
                muted={isReelMuted}
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Gradient Shade for Controls */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none z-10" />

              {/* Top Header Bar (Close & Sound Toggle) */}
              <div className="relative z-20 flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[1.5px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                      <Instagram size={12} className="text-white" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide">@{accountHandle}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mute/Unmute */}
                  <button
                    type="button"
                    onClick={() => setIsReelMuted(!isReelMuted)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white border border-white/20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    title={isReelMuted ? "Unmute" : "Mute"}
                  >
                    {isReelMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>

                  {/* Close */}
                  <button
                    type="button"
                    onClick={() => setActiveReel(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white border border-white/20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    title="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Right Instagram Action Buttons */}
              <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-4 text-white select-none">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-red-500">
                    <Heart size={18} fill="currentColor" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-white/90">{activeReel.likes || "18.4k"}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white">
                    <MessageCircle size={18} />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-white/90">{activeReel.comments || "412"}</span>
                </div>
              </div>

              {/* Bottom Caption & Instagram Action Button */}
              <div className="relative z-20 p-5 text-left space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{activeReel.client || "Social Diaries Reel"}</h4>
                  <p className="text-xs text-white/85 mt-1 line-clamp-3 leading-relaxed font-normal">
                    {activeReel.caption || activeReel.campaign || "Creative visual production in Delhi NCR."}
                  </p>
                </div>

                <a
                  href={activeReel.permalink || accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Instagram size={13} />
                  <span>Open Reel on Instagram</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 6. FULL PHOTO LIGHTBOX MODAL ═══ */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-[#111111] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white border border-white/20 cursor-pointer hover:scale-110 transition-transform"
              >
                <X size={18} />
              </button>

              <div className="relative aspect-square sm:aspect-[4/3] w-full bg-black">
                <Image
                  src={getOptimizedImageUrl(activePhoto.image)}
                  alt={activePhoto.campaign || "Instagram photo"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>

              {/* Caption Footer */}
              <div className="p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 bg-[#0A0A0A]">
                <div>
                  <h4 className="text-sm font-bold text-white">{activePhoto.client || activePhoto.campaign || "Social Diaries Photography"}</h4>
                  <p className="text-xs text-white/70 mt-1">{activePhoto.caption || "High-end commercial & editorial photography."}</p>
                </div>

                <a
                  href={activePhoto.permalink || accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  <Instagram size={14} />
                  <span>View on Instagram</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
