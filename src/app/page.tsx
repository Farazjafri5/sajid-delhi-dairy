"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight, MessageSquare, Mail, MapPin, Check, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import Button from "@/components/Button";
import ServiceCard from "@/components/ServiceCard";
import IndustryCard from "@/components/IndustryCard";
import ProjectCard from "@/components/ProjectCard";
import InstagramFeedShowcase from "@/components/InstagramFeedShowcase";
import { services } from "@/data/services";
import { projects, Project } from "@/data/projects";
import { WEB3FORMS_ACCESS_KEY } from "@/config/email";
import { isSupabaseConfigured, supabase } from "@/config/supabase";
import { defaultSiteContent, SiteContent } from "@/data/siteContent";
import { getOptimizedVideoUrl } from "@/lib/media";

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Home() {
  const [projectsList, setProjectsList] = useState<Project[]>(projects);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);

  // Dynamic SEO Title Sync
  useEffect(() => {
    if (siteContent?.seo?.metaTitle) {
      document.title = siteContent.seo.metaTitle;
    }
  }, [siteContent?.seo?.metaTitle]);

  // Contact Form State
  const [formState, setFormState] = useState({
    name: "",
    brandName: "",
    email: "",
    phone: "",
    instagramHandle: "",
    businessType: "Restaurant",
    serviceNeeded: "Social Media Management",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Showreel Modal State
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [selectedVideoForModal, setSelectedVideoForModal] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // 📸 SLIDER ARRAYS & DYNAMICS (filtered active only, fully guarded against null)
  const leftImages = (siteContent?.showreel?.leftImages || []).filter(img => img && img.active !== false);
  const rightImages = (siteContent?.showreel?.rightImages || []).filter(img => img && img.active !== false);
  const centerVideos = (siteContent?.showreel?.centerVideos || []).filter(vid => vid && vid.active !== false);
  const allSideImages = [...leftImages, ...rightImages];

  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);

  // Timer for left images (every 5 seconds)
  useEffect(() => {
    if (leftImages.length === 0) return;
    const timer = setInterval(() => {
      setLeftImageIndex((prev) => (prev + 1) % leftImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [leftImages.length]);

  // Timer for right images (every 6 seconds)
  useEffect(() => {
    if (rightImages.length === 0) return;
    const timer = setInterval(() => {
      setRightImageIndex((prev) => (prev + 1) % rightImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [rightImages.length]);

  // Timer for center videos (pauses automatically while video is being played or modal is open)
  useEffect(() => {
    if (centerVideos.length === 0 || showreelOpen) return;
    const timer = setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % centerVideos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [centerVideos.length, showreelOpen]);

  // 📱 INSTAGRAM REEL MOCKUP DYNAMICS (filtered active only, safe fallback)
  const mockReels = (siteContent?.hero?.mockReels || []).filter(reel => reel && reel.active !== false);

  const [reelIndex, setReelIndex] = useState(0);
  const [isPlayingReel, setIsPlayingReel] = useState(false);
  const [isReelMuted, setIsReelMuted] = useState(false);

  // Touch swipe gesture handlers for Hero Reel mockup
  const heroTouchStartX = useRef<number | null>(null);
  const heroTouchEndX = useRef<number | null>(null);
  const heroIsSwiping = useRef<boolean>(false);

  const handleHeroTouchStart = (e: React.TouchEvent) => {
    heroTouchStartX.current = e.touches[0].clientX;
    heroTouchEndX.current = null;
    heroIsSwiping.current = false;
  };

  const handleHeroTouchMove = (e: React.TouchEvent) => {
    heroTouchEndX.current = e.touches[0].clientX;
    if (heroTouchStartX.current && Math.abs(heroTouchStartX.current - e.touches[0].clientX) > 10) {
      heroIsSwiping.current = true;
    }
  };

  const handleHeroTouchEnd = () => {
    if (heroTouchStartX.current !== null && heroTouchEndX.current !== null) {
      const distance = heroTouchStartX.current - heroTouchEndX.current;
      const minSwipeDistance = 40;

      if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0) {
          // Swiped Left -> Next Reel
          setReelIndex((prev) => (prev + 1) % mockReels.length);
          setIsPlayingReel(false);
        } else {
          // Swiped Right -> Previous Reel
          setReelIndex((prev) => (prev - 1 + mockReels.length) % mockReels.length);
          setIsPlayingReel(false);
        }
      }
    }
    setTimeout(() => {
      heroTouchStartX.current = null;
      heroTouchEndX.current = null;
      heroIsSwiping.current = false;
    }, 50);
  };

  // Timer for Instagram Reel mockup slideshow (every 4 seconds, pauses when video is playing)
  useEffect(() => {
    if (isPlayingReel || mockReels.length === 0) return;
    const timer = setInterval(() => {
      setReelIndex((prev) => (prev + 1) % mockReels.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlayingReel, mockReels.length]);

  // Active Testimonials
  const testimonials = (siteContent?.testimonials || []).filter(t => t && t.active !== false);

  // Auto-play timer for Testimonials Carousel (every 6 seconds)
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }
    setPhoneError("");
    setIsSubmitting(true);

    if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
      alert("Notice: To receive actual emails in your Gmail inbox, please request a free Access Key from web3forms.com and configure it in src/config/email.ts. Showing mock success screen for now!");
      setTimeout(() => {
        setIsSubmitted(true);
        setIsSubmitting(false);
        setFormState({
          name: "",
          brandName: "",
          email: "",
          phone: "",
          instagramHandle: "",
          businessType: "Restaurant",
          serviceNeeded: "Social Media Management",
        });
      }, 800);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New Lead from Social Diaries Official - ${formState.brandName}`,
          from_name: "Social Diaries Webmaster",
          ...formState
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        setFormState({
          name: "",
          brandName: "",
          email: "",
          phone: "",
          instagramHandle: "",
          businessType: "Restaurant",
          serviceNeeded: "Social Media Management",
        });
      } else {
        alert(result.message || "Something went wrong. Please check your Access Key and try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormState((prev) => ({
          ...prev,
          phone: digitsOnly,
        }));
        if (digitsOnly.length === 10) {
          setPhoneError("");
        } else if (digitsOnly.length > 0) {
          setPhoneError("Phone number must be exactly 10 digits.");
        } else {
          setPhoneError("");
        }
      }
      return;
    }
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Industries Data (filtered active only, safe fallback)
  const industriesList = (siteContent?.industries || []).filter(ind => ind && ind.active !== false);

  // Instagram Feed Data (filtered active only, safe fallback)
  const instagramFeed = (siteContent?.instagramFeed || []).filter(feed => feed && feed.active !== false);

  // Active Projects Data (filtered active only, safe fallback)
  const activeProjects = (projectsList || []).filter(p => p && p.active !== false && !p.slug.startsWith("inactive:"));


  return (
    <main className="flex-1 bg-studio-bg overflow-hidden">
      {/* 1. HERO SECTION (Split-Screen Cinematic with Fluid Typography) */}
      <section className="relative flex min-h-[90vh] lg:min-h-screen flex-col justify-between pt-28 pb-12 max-sm:pb-6 lg:pt-36 bg-gradient-to-b from-[#FAF8F5] via-[#FFFFFF] to-[#FAF8F5] overflow-hidden">
        {/* Subtle Ambient Gold Radial Lighting */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#C5A880]/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#DD2A7B]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 z-0 opacity-[0.03] select-none pointer-events-none bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="mx-auto w-full max-w-[1400px] px-8 md:px-16 lg:px-24 z-10 flex flex-1 flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
            {/* Left Column: Bold Editorial Copy */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <div className="inline-flex items-center gap-2.5 bg-white/70 border border-[#C5A880]/40 px-4 py-2 rounded-full mb-6 backdrop-blur-md shadow-sm self-start">
                <span className="text-[#C5A880] text-xs">✦</span>
                <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0A1628]">
                  Delhi / India • Social-First Creative Studio
                </span>
              </div>

              <h1 className="heading-serif-hero text-[#0A1628] uppercase tracking-tight">
                {siteContent.hero?.heading || "We make brands"} <br />
                <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#91724B] via-[#C5A880] to-[#91724B] drop-shadow-[0_2px_15px_rgba(197,168,128,0.3)]">
                  {siteContent.hero?.headingItalic || "worth stopping"}
                </span>{" "}
                for.
              </h1>

              <p className="mt-6 max-w-xl text-sm sm:text-base md:text-lg font-medium leading-relaxed text-[#0A1628]/70">
                {siteContent.hero?.subtitle || "Reels, content, social media, and creative campaigns for brands people remember. Built for restaurants, cafes, luxury hospitality, and D2C brands."}
              </p>

              <div className="mt-8 flex flex-wrap gap-4 max-sm:w-full">
                <Link 
                  href="/work" 
                  className="group flex items-center justify-center gap-3 rounded-full bg-[#0A1628] text-white px-8 py-4 text-xs font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(10,22,40,0.22)] hover:bg-[#C5A880] hover:text-[#0A1628] transition-all duration-300 cursor-pointer max-sm:w-full"
                >
                  <span>View Our Work</span>
                  <ArrowRight size={15} className="text-[#C5A880] group-hover:text-[#0A1628] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="#contact" 
                  className="group flex items-center justify-center gap-2 rounded-full bg-white/90 border border-[#C5A880]/50 text-[#0A1628] px-8 py-4 text-xs font-bold tracking-widest uppercase shadow-sm hover:border-[#0A1628] hover:bg-[#0A1628] hover:text-white transition-all duration-300 cursor-pointer max-sm:w-full"
                >
                  <span>Start a Project</span>
                  <span className="text-[#C5A880] font-bold">✦</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Premium Titanium Floating Instagram Reel Mockup */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full max-w-[340px] aspect-[9/16] bg-[#0A1628] border-[3px] border-[#C5A880]/45 shadow-[0_30px_70px_rgba(10,22,40,0.25),0_0_35px_rgba(197,168,128,0.18)] p-2.5 overflow-hidden flex flex-col justify-between rounded-[36px]"
              >
                {/* Simulated Phone Notch & Status bar */}
                <div className="absolute top-2 inset-x-0 flex justify-between px-6 z-20 text-[9px] font-bold text-white/70 select-none">
                  <span>9:41</span>
                  <div className="h-4 w-20 bg-[#0A1628] rounded-full absolute left-1/2 -translate-x-1/2 top-0 border border-[#C5A880]/20" />
                  <div className="flex gap-1">
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Reel Content Layer with Touch Swipe */}
                <div 
                  onTouchStart={handleHeroTouchStart}
                  onTouchMove={handleHeroTouchMove}
                  onTouchEnd={handleHeroTouchEnd}
                  onClick={() => {
                    if (!heroIsSwiping.current) {
                      setIsPlayingReel(!isPlayingReel);
                    }
                  }}
                  className="relative flex-1 bg-[#1a1a1a] overflow-hidden rounded-[26px] cursor-pointer group select-none touch-pan-y"
                >
                  {/* Inline Video Player */}
                  {isPlayingReel ? (
                    <video
                      src={getOptimizedVideoUrl(mockReels[reelIndex].videoUrl)}
                      autoPlay
                      loop
                      muted={isReelMuted}
                      playsInline
                      preload="auto"
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  ) : (
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={reelIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.9, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <Image
                          src={mockReels[reelIndex].poster}
                          alt="Delhi creative studio reel mock"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 340px"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-transparent to-[#0A1628]/30 z-0 pointer-events-none" />

                  {/* Speaker Mute/Unmute Icon Button */}
                  {isPlayingReel && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsReelMuted(!isReelMuted);
                      }}
                      className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      aria-label={isReelMuted ? "Unmute audio" : "Mute audio"}
                      title={isReelMuted ? "Click to Unmute" : "Click to Mute"}
                    >
                      {isReelMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  )}

                  {/* Play icon overlay with pulsing gold aura */}
                  {!isPlayingReel && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute h-16 w-16 rounded-full bg-[#C5A880]/30 animate-ping" />
                        <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#C5A880] via-[#F3E5D0] to-[#C5A880] shadow-[0_0_30px_rgba(197,168,128,0.6)] flex items-center justify-center text-[#0A1628] group-hover:scale-110 transition-transform duration-300">
                          <Play fill="currentColor" size={18} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vertical Instagram Action Bar (Likes, Comments, Shares) */}
                  <div className="absolute right-4 bottom-16 flex flex-col items-center gap-5 text-white z-10 select-none pointer-events-none">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">❤️</span>
                      <span className="text-[9px] font-bold mt-1 text-white/90">{mockReels[reelIndex].likes}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg">💬</span>
                      <span className="text-[9px] font-bold mt-1 text-white/90">{mockReels[reelIndex].comments}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg">✈️</span>
                      <span className="text-[9px] font-bold mt-1 text-white/90">1.2k</span>
                    </div>
                  </div>

                  {/* Mock Username and Caption Details */}
                  <div className="absolute left-4 bottom-4 right-14 text-white z-10 select-none text-left pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#C5A880]/30 border border-[#C5A880]/50 flex items-center justify-center text-[9px] font-bold text-[#C5A880]">
                        SD
                      </div>
                      <span className="text-xs font-bold tracking-wider">socialdiariesagency.co</span>
                      <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Follow</span>
                    </div>
                    <p className="text-[10px] mt-2 font-normal leading-relaxed text-white/90 line-clamp-2">
                      {mockReels[reelIndex].caption || "Capturing culinary artistry & authentic moments in New Delhi."}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[8px] text-[#C5A880] font-bold uppercase tracking-wider">
                      <span>🎵 original audio</span>
                      <span>•</span>
                      <span>Delhi NCR</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating Glass Editorial Metadata Ribbon */}
        <div className="mx-auto w-full max-w-[1400px] px-8 md:px-16 lg:px-24 z-10 mt-12">
          <div className="bg-white/60 border border-[#C5A880]/30 rounded-2xl p-5 backdrop-blur-md shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs tracking-wider uppercase text-[#0A1628]/70">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-[#0A1628]">✦ Based In:</span>
              <span className="font-medium text-[#0A1628]/80">Delhi NCR, India</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-[#0A1628]">✦ Focus:</span>
              <span className="font-medium text-[#0A1628]/80">Content • Social • Reels</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-[#0A1628]">✦ Status:</span>
              <span className="flex items-center gap-2 font-medium text-[#0A1628]/80">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                Available for collaborations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE INSTAGRAM FEED SHOWCASE (Directly below Hero Section) */}
      <InstagramFeedShowcase 
        initialTiles={siteContent?.instagramFeed || []}
        accountHandle={siteContent?.instagramSettings?.handle || "socialdiariesagency.co"}
        accountUrl={siteContent?.instagramSettings?.profileUrl || "https://www.instagram.com/socialdiariesagency.co/"}
        curatorFeedId={siteContent?.instagramSettings?.curatorFeedId || process.env.NEXT_PUBLIC_CURATOR_FEED_ID || "94d8f687-7cf1-4d83-a2ee-334e1dbf323a"}
        beholdFeedId={siteContent?.instagramSettings?.beholdFeedId || process.env.NEXT_PUBLIC_BEHOLD_FEED_ID || "jMYKX8SAVZtq7lMpJFRx"}
        provider={siteContent?.instagramSettings?.provider || "curator"}
        hiddenPostIds={siteContent?.instagramSettings?.hiddenPostIds || []}
        hiddenPermalinks={siteContent?.instagramSettings?.hiddenPermalinks || []}
      />

      {/* 3. SHOWREEL SECTION (Ultra-Luxury Cinematic Cinema & Studio Reel) */}
      <section className="bg-gradient-to-b from-[#070F1B] via-[#0A1628] to-[#070F1B] text-studio-bg py-15 relative overflow-hidden border-b border-[#C5A880]/20">
        {/* Ambient Golden Cinema Spotlights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#C5A880]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#DD2A7B]/8 rounded-full blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md shadow-inner">
                <span className="text-[#C5A880] text-xs">✦</span>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A880]">Studio Reel</span>
              </div>
              <h2 className="mt-2 heading-serif-section uppercase text-white tracking-tight">
                <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F5E6D3] to-[#C5A880] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(197,168,128,0.2)]">
                  {siteContent.showreel?.heading || "This is what we do."}
                </span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-white/70 font-normal leading-relaxed text-left">
              {siteContent.showreel?.description || "We shoot short-form videos designed to convert casual scrollers into loyal customers. No stock templates, no boring structures."}
            </p>
          </div>

          {/* 🖥️ DESKTOP REEL DISPLAY (4-Column Cinema Layout for Desktop) */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8 items-center">
            {/* Left vertical image */}
            <div 
              onClick={() => leftImages[leftImageIndex]?.src && setLightboxImage(leftImages[leftImageIndex].src)}
              className="relative aspect-[9/16] overflow-hidden rounded-[12px] bg-[#08111E] order-2 lg:order-1 group cursor-pointer border border-[#C5A880]/25 hover:border-[#C5A880] shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(197,168,128,0.25)]"
            >
              {leftImages.length > 0 && (
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={leftImageIndex}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={leftImages[leftImageIndex].src}
                      alt={leftImages[leftImageIndex].label || "Studio photo"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-xs uppercase tracking-widest text-[#C5A880] z-10 font-bold bg-[#0A1628]/85 border border-[#C5A880]/30 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-md">
                      {leftImages[leftImageIndex].label || "Featured"}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Center Main Showreel player (Cinema layout on desktop) */}
            <div className="lg:col-span-2 relative aspect-video bg-[#08111E] order-1 lg:order-2 overflow-hidden flex items-center justify-center group rounded-none border border-[#C5A880]/35 hover:border-[#C5A880] shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_75px_rgba(197,168,128,0.3)]">
              {centerVideos.length > 0 && (
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={videoIndex}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      setSelectedVideoForModal(centerVideos[videoIndex]?.src);
                      setShowreelOpen(true);
                    }}
                  >
                    <Image
                      src={centerVideos[videoIndex].poster || "/images/restaurant_1.png"}
                      alt={centerVideos[videoIndex].label || "Video Reel"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/85 via-[#0A1628]/25 to-transparent group-hover:bg-[#0A1628]/40 transition-colors duration-500" />
                    
                    {/* Golden Pulsing Play Button Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideoForModal(centerVideos[videoIndex]?.src);
                        setShowreelOpen(true);
                      }}
                      className="relative z-10 flex h-20 w-20 md:h-22 md:w-22 items-center justify-center rounded-full bg-gradient-to-tr from-[#C5A880] via-[#F5E6D3] to-[#C5A880] text-[#0A1628] transition-all duration-300 scale-95 group-hover:scale-110 shadow-[0_0_45px_rgba(197,168,128,0.65)] cursor-pointer"
                      data-cursor="play"
                    >
                      <div className="absolute -inset-2.5 rounded-full border border-[#C5A880]/50 animate-ping pointer-events-none" />
                      <Play fill="currentColor" size={24} className="ml-1 text-[#0A1628]" />
                    </button>

                    <div className="absolute bottom-6 left-6 text-xs uppercase tracking-widest text-[#C5A880] z-10 font-bold bg-[#0A1628]/85 border border-[#C5A880]/30 px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
                      🎬 Click to {centerVideos[videoIndex].label || "Watch Reel"}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Right vertical image */}
            <div 
              onClick={() => rightImages[rightImageIndex]?.src && setLightboxImage(rightImages[rightImageIndex].src)}
              className="relative aspect-[9/16] overflow-hidden rounded-[12px] bg-[#08111E] order-3 group cursor-pointer border border-[#C5A880]/25 hover:border-[#C5A880] shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(197,168,128,0.25)]"
            >
              {rightImages.length > 0 && (
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={rightImageIndex}
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={rightImages[rightImageIndex].src}
                      alt={rightImages[rightImageIndex].label || "Studio photo"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-xs uppercase tracking-widest text-[#C5A880] z-10 font-bold bg-[#0A1628]/85 border border-[#C5A880]/30 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-md">
                      {rightImages[rightImageIndex].label || "Featured"}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* 📱 MOBILE REEL DISPLAY */}
          <div className="block lg:hidden space-y-8">
            {/* 1. TOP SLIDER (Left Photos) */}
            {leftImages.length > 0 && (
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A880]">
                    📸 Left Showcase Photos
                  </span>
                  <span className="text-[9px] text-[#C5A880]/80 uppercase tracking-wider font-semibold">
                    Tap to Expand
                  </span>
                </div>

                <div 
                  onClick={() => leftImages[leftImageIndex]?.src && setLightboxImage(leftImages[leftImageIndex].src)}
                  className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#08111E] rounded-[12px] overflow-hidden cursor-pointer border border-[#C5A880]/25 shadow-xl group"
                >
                  {/* Previous / Next Arrows */}
                  {leftImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLeftImageIndex((prev) => (prev - 1 + leftImages.length) % leftImages.length);
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-lg active:scale-90 transition-transform cursor-pointer"
                        aria-label="Previous Left Photo"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLeftImageIndex((prev) => (prev + 1) % leftImages.length);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-lg active:scale-90 transition-transform cursor-pointer"
                        aria-label="Next Left Photo"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}

                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={leftImageIndex}
                      initial={{ x: "100%", opacity: 0.8 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "-100%", opacity: 0.8 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={leftImages[leftImageIndex].src}
                        alt={leftImages[leftImageIndex].label || "Studio photo"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/85 via-transparent to-transparent" />
                      
                      <div className="absolute bottom-3 left-4 z-10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A880] bg-[#0A1628]/90 px-3 py-1 rounded-full backdrop-blur-md border border-[#C5A880]/30 shadow-md">
                          {leftImages[leftImageIndex].label || "Featured"}
                        </span>
                      </div>

                      {/* Photo Dots Indicator */}
                      <div className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5">
                        {leftImages.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              leftImageIndex === i ? "w-4 bg-[#C5A880]" : "w-1.5 bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* 2. MIDDLE VIDEO PLAYER */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A880]">
                  🎬 Main Studio Video
                </span>
                <span className="text-[9px] text-[#C5A880]/80 uppercase tracking-wider font-semibold">
                  Tap to Play Reel
                </span>
              </div>

              <div className="relative w-full aspect-[16/10] sm:aspect-video bg-[#08111E] rounded-none overflow-hidden flex items-center justify-center border border-[#C5A880]/35 shadow-2xl">
                {/* Previous / Next Arrows */}
                {centerVideos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoIndex((prev) => (prev - 1 + centerVideos.length) % centerVideos.length);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-xl active:scale-90 transition-transform cursor-pointer"
                      aria-label="Previous Video"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoIndex((prev) => (prev + 1) % centerVideos.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-xl active:scale-90 transition-transform cursor-pointer"
                      aria-label="Next Video"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Video Counter Badge */}
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-0.5 rounded-full text-[10px] font-bold text-[#C5A880] tracking-widest uppercase border border-[#C5A880]/30 shadow-md">
                      <span>{videoIndex + 1}</span>
                      <span className="text-white/40">/</span>
                      <span className="text-white/70">{centerVideos.length}</span>
                    </div>
                  </>
                )}

                {centerVideos.length > 0 && (
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={videoIndex}
                      initial={{ y: "100%", opacity: 0.8 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0.8 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        setSelectedVideoForModal(centerVideos[videoIndex]?.src);
                        setShowreelOpen(true);
                      }}
                    >
                      <Image
                        src={centerVideos[videoIndex].poster || "/images/restaurant_1.png"}
                        alt={centerVideos[videoIndex].label || "Video Reel"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/85 via-[#0A1628]/25 to-transparent" />
                      
                      {/* Golden Pulsing Play Button Overlay */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideoForModal(centerVideos[videoIndex]?.src);
                          setShowreelOpen(true);
                        }}
                        className="relative z-10 flex h-18 w-18 items-center justify-center rounded-full bg-gradient-to-tr from-[#C5A880] via-[#F5E6D3] to-[#C5A880] text-[#0A1628] shadow-[0_0_35px_rgba(197,168,128,0.7)] active:scale-95 transition-transform cursor-pointer"
                        data-cursor="play"
                      >
                        <Play fill="currentColor" size={20} className="ml-0.5 text-[#0A1628]" />
                      </button>

                      <div className="absolute bottom-4 left-4 right-14 text-left z-10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A880] bg-[#0A1628]/90 px-3 py-1 rounded-full backdrop-blur-md border border-[#C5A880]/30 shadow-md">
                          🎬 {centerVideos[videoIndex].label || "Watch Reel"}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* 3. BOTTOM SLIDER (Right Photos) */}
            {rightImages.length > 0 && (
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A880]">
                    ✨ Right Showcase Photos
                  </span>
                  <span className="text-[9px] text-[#C5A880]/80 uppercase tracking-wider font-semibold">
                    Tap to Expand
                  </span>
                </div>

                <div 
                  onClick={() => rightImages[rightImageIndex]?.src && setLightboxImage(rightImages[rightImageIndex].src)}
                  className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#08111E] rounded-[12px] overflow-hidden cursor-pointer border border-[#C5A880]/25 shadow-xl group"
                >
                  {/* Previous / Next Arrows */}
                  {rightImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRightImageIndex((prev) => (prev - 1 + rightImages.length) % rightImages.length);
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-lg active:scale-90 transition-transform cursor-pointer"
                        aria-label="Previous Right Photo"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRightImageIndex((prev) => (prev + 1) % rightImages.length);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-lg active:scale-90 transition-transform cursor-pointer"
                        aria-label="Next Right Photo"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}

                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={rightImageIndex}
                      initial={{ x: "-100%", opacity: 0.8 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "100%", opacity: 0.8 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={rightImages[rightImageIndex].src}
                        alt={rightImages[rightImageIndex].label || "Studio photo"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/85 via-transparent to-transparent" />
                      
                      <div className="absolute bottom-3 left-4 z-10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A880] bg-[#0A1628]/90 px-3 py-1 rounded-full backdrop-blur-md border border-[#C5A880]/30 shadow-md">
                          {rightImages[rightImageIndex].label || "Featured"}
                        </span>
                      </div>

                      {/* Photo Dots Indicator */}
                      <div className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5">
                        {rightImages.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              rightImageIndex === i ? "w-4 bg-[#C5A880]" : "w-1.5 bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. MARQUEE SECTION (Ultra-Luxury Metallic & Midnight Ribbon) */}
      <section className="bg-gradient-to-r from-[#070F1B] via-[#0A1628] to-[#070F1B] border-y border-[#C5A880]/30 py-6 sm:py-7 select-none relative overflow-hidden shadow-2xl">
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,168,128,0.08),transparent_70%)] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 overflow-hidden">
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee items-center gap-12 sm:gap-16 pr-12 sm:pr-16 text-2xl sm:text-4xl md:text-5xl font-serif font-extrabold tracking-wider uppercase">
              <span className="bg-gradient-to-r from-[#C5A880] via-[#F5E6D3] to-[#C5A880] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(197,168,128,0.25)]">
                Reels & Stories
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="text-white drop-shadow-sm font-normal italic font-serif">
                Content Strategy
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#C5A880] bg-clip-text text-transparent font-bold">
                Viral Campaigns
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="text-[#F0E6D8] font-serif font-medium">
                Luxury Brands
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="bg-gradient-to-r from-[#C5A880] to-[#E8D7C1] bg-clip-text text-transparent italic font-normal">
                Cinematic Production
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="text-white font-bold">
                Brand Storytelling
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="bg-gradient-to-r from-[#DD2A7B] via-[#8134AF] to-[#F58529] bg-clip-text text-transparent font-bold">
                Social Growth
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
            </div>
            {/* Duplicate for seamless infinite loop scroll */}
            <div className="flex animate-marquee items-center gap-12 sm:gap-16 pr-12 sm:pr-16 text-2xl sm:text-4xl md:text-5xl font-serif font-extrabold tracking-wider uppercase" aria-hidden="true">
              <span className="bg-gradient-to-r from-[#C5A880] via-[#F5E6D3] to-[#C5A880] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(197,168,128,0.25)]">
                Reels & Stories
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="text-white drop-shadow-sm font-normal italic font-serif">
                Content Strategy
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#C5A880] bg-clip-text text-transparent font-bold">
                Viral Campaigns
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="text-[#F0E6D8] font-serif font-medium">
                Luxury Brands
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="bg-gradient-to-r from-[#C5A880] to-[#E8D7C1] bg-clip-text text-transparent italic font-normal">
                Cinematic Production
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="text-white font-bold">
                Brand Storytelling
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
              <span className="bg-gradient-to-r from-[#DD2A7B] via-[#8134AF] to-[#F58529] bg-clip-text text-transparent font-bold">
                Social Growth
              </span>
              <span className="text-[#C5A880] text-sm sm:text-lg">✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section className=" py-10">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
          {/* Header */}
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
              Our Capabilities
            </span>
            <h2 className="mt-4 heading-serif-section text-primary uppercase">
              From <span className="text-gradient-premium">one reel</span> to an entire digital presence.
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. INDUSTRIES SECTION (Ultra-Luxury Brand Sectors) */}
      <section className="bg-gradient-to-b from-[#070F1B] via-[#0A1628] to-[#070F1B] text-white py-10 relative overflow-hidden border-b border-[#C5A880]/20">
        {/* Ambient Cinema Lighting */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#DD2A7B]/8 rounded-full blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 relative z-10">
          {/* Header */}
          <div className="max-w-2xl mb-16 text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-3 backdrop-blur-md">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A880]">Who We Create For</span>
            </div>
            <h2 className="mt-2 heading-serif-section uppercase text-white tracking-tight">
              We create for brands <br />
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F5E6D3] to-[#C5A880] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(197,168,128,0.2)]">
                people love.
              </span>
            </h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industriesList.map((ind, idx) => (
              <IndustryCard
                key={idx}
                name={ind.name}
                statement={ind.statement}
                image={ind.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED WORK SECTION (Extra desktop padding to prevent overlap) */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#FAF8F5] via-[#FFFFFF] to-[#FAF8F5] relative overflow-hidden">
        {/* Subtle Ambient Radial Gold Glow */}
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-[#C5A880]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 text-left">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-3 backdrop-blur-md">
                <span className="text-[#C5A880] text-xs">✦</span>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#0A1628]">Selected Projects</span>
              </div>
              <h2 className="mt-2 heading-serif-section text-[#0A1628] uppercase tracking-tight">
                Work that does the <span className="bg-gradient-to-r from-[#0A1628] via-[#91724B] to-[#C5A880] bg-clip-text text-transparent">talking.</span>
              </h2>
            </div>
            <Link 
              href="/work"
              className="group flex items-center gap-2.5 text-xs font-bold tracking-wider uppercase text-[#0A1628] bg-white border border-[#C5A880]/40 hover:border-[#C5A880] hover:bg-[#0A1628] hover:text-[#C5A880] px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 self-start md:self-auto cursor-pointer"
            >
              <span>View All Projects</span>
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Asymmetric Portfolio Grid with Smart Dynamic Loop */}
          {(() => {
            const col1 = activeProjects.filter((_, idx) => idx % 2 === 0);
            const col2 = activeProjects.filter((_, idx) => idx % 2 !== 0);
            const shouldAnimateCol1 = col1.length > 1;
            const shouldAnimateCol2 = col2.length > 1;
            const hasLoop = shouldAnimateCol1 || shouldAnimateCol2;

            if (!hasLoop) {
              // Static display when 1 or fewer projects per column (Ruka rahega, no duplicate)
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
                  <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
                    {col1.map((project) => (
                      <ProjectCard key={`${project.slug}-col1`} project={project} asymmetric={false} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 md:mt-16">
                    {col2.map((project) => (
                      <ProjectCard key={`${project.slug}-col2`} project={project} asymmetric={false} />
                    ))}
                  </div>
                </div>
              );
            }

            // Animated vertical loop when multiple projects exist (Chalta rahega)
            return (
              <div className="relative md:h-[750px] lg:h-[850px] overflow-hidden">
                {/* Fade overlays for the premium editorial look */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-studio-bg to-transparent z-10 pointer-events-none hidden md:block" />
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-studio-bg to-transparent z-10 pointer-events-none hidden md:block" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start h-full">
                  {/* Column 1 - Slides Up Slow if > 1 project, else static */}
                  <div className={`flex flex-col gap-12 lg:gap-24 ${shouldAnimateCol1 ? "md:animate-vertical-loop-slow md:pause-on-hover" : ""}`}>
                    {col1.map((project) => (
                      <ProjectCard key={`${project.slug}-col1`} project={project} asymmetric={false} />
                    ))}
                    {shouldAnimateCol1 && col1.map((project) => (
                      <ProjectCard key={`${project.slug}-col1-dup`} project={project} asymmetric={false} />
                    ))}
                  </div>

                  {/* Column 2 - Slides Down (Reverse loop) if > 1 project, else static */}
                  <div className={`flex flex-col gap-12 lg:gap-24 ${shouldAnimateCol2 ? "md:animate-vertical-loop-reverse md:pause-on-hover md:mt-24" : "md:mt-16"}`}>
                    {col2.map((project) => (
                      <ProjectCard key={`${project.slug}-col2`} project={project} asymmetric={false} />
                    ))}
                    {shouldAnimateCol2 && col2.map((project) => (
                      <ProjectCard key={`${project.slug}-col2-dup`} project={project} asymmetric={false} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 7. PROCESS SECTION (Ultra-Luxury Step-by-Step Pathway) */}
      <section className="py-10 bg-gradient-to-b from-[#FAF8F5] via-[#F5EFE6] to-[#FAF8F5] border-t border-[#C5A880]/20 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#C5A880]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 relative z-10">
          {/* Header */}
          <div className="max-w-2xl mb-16 text-left">
            <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-3 backdrop-blur-md">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#0A1628]">How We Work</span>
            </div>
            <h2 className="mt-2 heading-serif-section text-[#0A1628] uppercase tracking-tight">
              Our <span className="bg-gradient-to-r from-[#0A1628] via-[#91724B] to-[#C5A880] bg-clip-text text-transparent">Process.</span>
            </h2>
          </div>

          {/* Steps Grid - Luxury Interactive Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { num: "01", name: "DISCOVER", phase: "Research & Audit", desc: "We deep-dive into your brand, analyze your competitors on social media, and define a unique content personality." },
              { num: "02", name: "CREATE", phase: "Shoots & Native Edit", desc: "Our creative crew scripts, shoots, and edits native vertical videos and premium photos designed to stop scrolls." },
              { num: "03", name: "PUBLISH", phase: "Daily Management", desc: "We handle scheduling, daily copywriting, trending audio integrations, and community management in real-time." },
              { num: "04", name: "GROW", phase: "Scale & Analytics", desc: "We track performance metrics closely, optimize based on reach results, and scale high-engagement campaigns." }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F1] to-[#F3ECE1] p-7 md:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(197,168,128,0.22)] overflow-hidden shadow-sm"
              >
                {/* Top Gold Shimmer Line on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A880] via-[#F3E5D0] to-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#C5A880] via-[#91724B] to-[#C5A880] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#0A1628]/5 group-hover:bg-[#0A1628] text-[#0A1628] group-hover:text-[#C5A880] border border-[#0A1628]/10 group-hover:border-[#C5A880]/40 px-3 py-1 rounded-full transition-all duration-300">
                      Step {step.num}
                    </span>
                  </div>

                  <h3 className="mt-6 font-serif text-xl font-bold tracking-tight text-[#0A1628] group-hover:text-[#91724B] transition-colors duration-300">
                    {step.name}
                  </h3>
                  
                  <p className="mt-3 text-sm leading-relaxed text-[#0A1628]/70 font-normal">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Phase Badge */}
                <div className="mt-6 pt-4 border-t border-[#C5A880]/20 flex items-center justify-between text-xs text-[#0A1628]/60">
                  <span className="flex items-center gap-1.5 font-semibold text-[#0A1628]/80 group-hover:text-[#0A1628]">
                    <span className="text-[#C5A880]">✦</span> {step.phase}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. OUR STANCE SECTION (Ultra-Luxury Midnight & Metallic Gold Manifesto) */}
      <section className="py-10 bg-gradient-to-b from-[#070F1B] via-[#0A1628] to-[#070F1B] text-white relative overflow-hidden border-y border-[#C5A880]/20">
        {/* Ambient Cinema Spotlights */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#DD2A7B]/8 rounded-full blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 relative z-10">
          {/* Header */}
          <div className="max-w-3xl mb-16 text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-3 backdrop-blur-md">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A880]">Our Stance</span>
            </div>
            <h2 className="mt-2 heading-serif-section uppercase tracking-tight text-white">
              We don't just post. <br />
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F5E6D3] to-[#C5A880] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(197,168,128,0.2)]">
                We build attention.
              </span>
            </h2>
          </div>

          {/* 4 Luxury Manifesto Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { icon: "🎯", num: "01", title: "SOCIAL FIRST", text: "Content built directly for the way humans consume Instagram today. No dry flyers or stock banners." },
              { icon: "🎥", num: "02", title: "ON-GROUND EXECUTION", text: "We don't just email strategy slideshows. We show up at your venue, bring the kit, and capture organic stories." },
              { icon: "⚡", num: "03", title: "NATIVE TO SOCIAL", text: "Reels and photography formatted specifically to blend into feeds while grabbing maximum engagement." },
              { icon: "💎", num: "04", title: "NO COOKIE-CUTTER CONTENT", text: "Every dining group, aesthetic boutique, or beauty product gets a unique visual direction custom-styled to them." }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#C5A880]/30 hover:border-[#C5A880] bg-[#08111E]/80 backdrop-blur-md p-7 md:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(197,168,128,0.25)] shadow-xl overflow-hidden"
              >
                {/* Subtle Ambient Radial Highlight */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#C5A880]/15 rounded-full blur-xl pointer-events-none group-hover:bg-[#C5A880]/30 transition-all duration-500" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-white/5 border border-[#C5A880]/30 text-[#C5A880] px-3 py-1 rounded-full backdrop-blur-md">
                      Principle {stat.num}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold tracking-tight text-white uppercase group-hover:text-[#F3E5D0] transition-colors duration-300">
                    {stat.title}
                  </h3>
                  
                  <p className="mt-3 text-sm leading-relaxed text-white/70 font-normal">
                    {stat.text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#C5A880]/20 flex items-center gap-2 text-[11px] font-semibold text-[#C5A880]">
                  <span>✦</span>
                  <span>Social Diaries Standard</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SOCIAL PRESENCE (Original 3x3 Grid from Dashboard) */}
      <section className="py-10 bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F0] to-[#F4EEE4] border-t border-[#C5A880]/20 relative overflow-hidden">
        {/* Subtle Ambient Radial Gold Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C5A880]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16 text-left">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-3 backdrop-blur-md">
                <span className="text-[#C5A880] text-xs">✦</span>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#0A1628]">Social Presence</span>
              </div>
              <h2 className="mt-2 heading-serif-section text-[#0A1628] uppercase tracking-tight">
                Our Instagram is our <span className="bg-gradient-to-r from-[#0A1628] via-[#91724B] to-[#C5A880] bg-clip-text text-transparent">portfolio.</span>
              </h2>
            </div>
            <a
              href={siteContent?.instagramSettings?.profileUrl || "https://www.instagram.com/socialdiariesagency.co/"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-xs font-bold tracking-wider uppercase text-[#0A1628] bg-white border border-[#C5A880]/40 hover:border-[#C5A880] hover:bg-[#0A1628] hover:text-[#C5A880] px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 self-start sm:self-auto cursor-pointer"
            >
              <InstagramIcon size={15} />
              <span>Follow on Instagram</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* 3x3 Grid layout with rounded-3xl luxury glass cards */}
          <div className="grid grid-cols-3 gap-2.5 md:gap-5">
            {instagramFeed.map((tile, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(tile.image)}
                className="relative aspect-square rounded-2xl md:rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] overflow-hidden group cursor-pointer shadow-md hover:shadow-[0_20px_45px_rgba(197,168,128,0.25)] transition-all duration-500 hover:-translate-y-1 bg-[#0A1628]"
              >
                <Image
                  src={tile.image}
                  alt={`Instagram tile ${idx}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 33vw, 33vw"
                />
                
                {/* Hover overlay detail with luxury glass styling */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-[#0A1628]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 md:p-6 text-studio-bg z-10 text-left">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[8px] md:text-[10px] tracking-widest uppercase bg-[#0A1628]/85 text-[#C5A880] border border-[#C5A880]/30 py-0.5 px-2 md:py-1 md:px-3 self-start rounded-full backdrop-blur-md font-bold">
                      {tile.type}
                    </span>
                    <span className="hidden sm:inline-block text-[9px] text-[#C5A880] uppercase tracking-wider font-semibold">
                      🔍 Tap to expand
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-serif text-xs md:text-lg font-bold text-white leading-snug">{tile.client}</h4>
                    <p className="text-[9px] md:text-xs text-[#C5A880] mt-0.5 md:mt-1 font-medium">{tile.campaign}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS (Ultra-Luxury Client Love Showcase) */}
      <section className="py-10 bg-gradient-to-b from-[#FAF8F5] via-[#F4EEE4] to-[#FAF8F5] border-t border-[#C5A880]/20 relative overflow-hidden">
        {/* Subtle Ambient Radial Gold Glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#C5A880]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 relative z-10">
          <div className="max-w-3xl mb-16 text-left">
            <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-3 backdrop-blur-md">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#0A1628]">Client Love</span>
            </div>
            <h2 className="mt-2 heading-serif-section text-[#0A1628] uppercase tracking-tight">
              Good content gets attention. <br />
              <span className="bg-gradient-to-r from-[#0A1628] via-[#91724B] to-[#C5A880] bg-clip-text text-transparent">
                Good partnerships keep it.
              </span>
            </h2>
          </div>

          {/* Slider Container */}
          <div className="max-w-[1400px] w-full relative text-left">
            {/* Sliding Card Wrapper */}
            <div className="relative overflow-hidden min-h-[360px] md:min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full"
                >
                  {/* Card 1 */}
                  <div className="group relative rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F1] to-[#F3ECE1] p-8 md:p-10 shadow-sm hover:shadow-[0_24px_50px_rgba(197,168,128,0.22)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between h-full overflow-hidden">
                    {/* Top Gold Shimmer on Hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A880] via-[#F3E5D0] to-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div>
                      {/* Double Quotes Icon */}
                      <span className="font-serif text-5xl md:text-6xl text-[#C5A880]/40 block -mt-4 -ml-1 select-none leading-none">“</span>
                      <p className="font-serif text-base md:text-lg italic font-normal text-[#0A1628] leading-relaxed mt-2">
                        {testimonials[testimonialIndex].quote}
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-[#C5A880]/20 flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#0A1628] group-hover:text-[#91724B] transition-colors">
                          {testimonials[testimonialIndex].author}
                        </h4>
                        <p className="text-xs font-semibold tracking-wider uppercase text-[#C5A880] mt-0.5">
                          {testimonials[testimonialIndex].company} — {testimonials[testimonialIndex].industry}
                        </p>
                      </div>
                      <span className="text-[#C5A880] text-sm">✦</span>
                    </div>
                  </div>

                  {/* Card 2 (Hidden on mobile, side-by-side on desktop) */}
                  <div className="hidden md:flex group relative rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F1] to-[#F3ECE1] p-8 md:p-10 shadow-sm hover:shadow-[0_24px_50px_rgba(197,168,128,0.22)] transition-all duration-500 hover:-translate-y-1 flex-col justify-between h-full overflow-hidden">
                    {/* Top Gold Shimmer on Hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A880] via-[#F3E5D0] to-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div>
                      {/* Double Quotes Icon */}
                      <span className="font-serif text-5xl md:text-6xl text-[#C5A880]/40 block -mt-4 -ml-1 select-none leading-none">“</span>
                      <p className="font-serif text-base md:text-lg italic font-normal text-[#0A1628] leading-relaxed mt-2">
                        {testimonials[(testimonialIndex + 1) % testimonials.length].quote}
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-[#C5A880]/20 flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#0A1628] group-hover:text-[#91724B] transition-colors">
                          {testimonials[(testimonialIndex + 1) % testimonials.length].author}
                        </h4>
                        <p className="text-xs font-semibold tracking-wider uppercase text-[#C5A880] mt-0.5">
                          {testimonials[(testimonialIndex + 1) % testimonials.length].company} — {testimonials[(testimonialIndex + 1) % testimonials.length].industry}
                        </p>
                      </div>
                      <span className="text-[#C5A880] text-sm">✦</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Navigation Controls */}
            <div className="flex items-center justify-between mt-10">
              {/* Left/Right buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() =>
                    setTestimonialIndex(
                      (prev) => (prev - 1 + testimonials.length) % testimonials.length
                    )
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C5A880]/35 bg-white text-[#0A1628] hover:bg-[#0A1628] hover:text-[#C5A880] hover:border-[#C5A880] transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() =>
                    setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C5A880]/35 bg-white text-[#0A1628] hover:bg-[#0A1628] hover:text-[#C5A880] hover:border-[#C5A880] transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Indicator Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setTestimonialIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      testimonialIndex === idx ? "w-8 bg-[#C5A880]" : "w-2 bg-[#0A1628]/20 hover:bg-[#0A1628]/40"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CTA & PREMIUM COLLABORATION FORM */}
      <section id="contact" className="bg-gradient-to-b from-[#070F1B] via-[#0A1628] to-[#070F1B] text-white py-24 md:py-32 relative overflow-hidden border-t border-[#C5A880]/20">
        {/* Ambient Cinema Gold Spotlights */}
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#DD2A7B]/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* CTA copy panel */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full text-left">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md">
                  <span className="text-[#C5A880] text-xs">✦</span>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A880]">Let's Collaborate</span>
                </div>
                <h2 className="mt-2 heading-serif-section uppercase text-white tracking-tight">
                  Got a <br />
                  <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#F5E6D3] to-[#C5A880] drop-shadow-[0_2px_15px_rgba(197,168,128,0.25)]">
                    brand people
                  </span> <br />
                  should know about?
                </h2>
                <p className="mt-6 text-sm md:text-base text-white/70 leading-relaxed font-normal">
                  Let's make something worth watching. Drop us a line below, and we'll reply with a custom social audit within 24 hours.
                </p>

                {/* Direct Connect Quick Links */}
                <div className="mt-10 space-y-3">
                  <a 
                    href={`mailto:${siteContent?.contactSettings?.email || "kunwarsajid2@gmail.com"}`}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:border-[#C5A880] hover:bg-white/10 transition-colors text-xs text-white/80"
                  >
                    <span className="text-[#C5A880] text-sm">✉️</span>
                    <span className="font-semibold">{siteContent?.contactSettings?.email || "kunwarsajid2@gmail.com"}</span>
                  </a>
                  <a 
                    href={`https://wa.me/${(siteContent?.contactSettings?.whatsapp || "+91 76684 87182").replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:border-[#C5A880] hover:bg-white/10 transition-colors text-xs text-white/80"
                  >
                    <span className="text-[#C5A880] text-sm">💬</span>
                    <span className="font-semibold">WhatsApp: {siteContent?.contactSettings?.whatsapp || "+91 76684 87182"}</span>
                  </a>
                  <a 
                    href={siteContent?.contactSettings?.instagramUrl || "https://www.instagram.com/socialdiariesagency.co/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:border-[#C5A880] hover:bg-white/10 transition-colors text-xs text-white/80"
                  >
                    <span className="text-[#C5A880] text-sm">📸</span>
                    <span className="font-semibold">{siteContent?.contactSettings?.instagramHandle || "@socialdiariesagency.co"}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Premium Form panel (Ultra-Luxury Glass Card) */}
            <div className="lg:col-span-7 relative rounded-3xl border border-[#C5A880]/30 bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F1] to-[#F3ECE1] p-8 md:p-12 shadow-[0_24px_55px_rgba(197,168,128,0.22)] overflow-hidden text-left">
              {/* Top Gold Shimmer Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A880] via-[#F3E5D0] to-[#C5A880]" />

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0A1628] text-[#C5A880] mb-6 shadow-xl">
                    <Check size={28} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold uppercase text-[#0A1628]">
                    Inquiry Received!
                  </h3>
                  <p className="mt-3 max-w-sm text-sm text-[#0A1628]/70 leading-relaxed font-normal">
                    Thank you for reaching out. We will audit your Instagram and contact you via WhatsApp/Email within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="mt-8 px-6 py-3 rounded-full bg-[#0A1628] text-[#C5A880] text-xs font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        suppressHydrationWarning
                        value={formState.name}
                        onChange={handleChange}
                        className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium shadow-sm"
                        placeholder="e.g. Sajid Ali"
                      />
                    </div>

                    {/* Brand Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="brandName" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                        Brand / Restaurant Name *
                      </label>
                      <input
                        type="text"
                        name="brandName"
                        id="brandName"
                        required
                        suppressHydrationWarning
                        value={formState.brandName}
                        onChange={handleChange}
                        className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium shadow-sm"
                        placeholder="e.g. Dastan Dining"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        suppressHydrationWarning
                        value={formState.email}
                        onChange={handleChange}
                        className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium shadow-sm"
                        placeholder="name@brand.com"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        suppressHydrationWarning
                        value={formState.phone}
                        onChange={handleChange}
                        className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium shadow-sm"
                        placeholder="10-digit mobile number"
                      />
                      {phoneError && (
                        <span className="text-[10px] text-red-600 font-bold tracking-wider uppercase mt-0.5">
                          {phoneError}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Instagram Handle */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="instagramHandle" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                        Instagram Handle *
                      </label>
                      <input
                        type="text"
                        name="instagramHandle"
                        id="instagramHandle"
                        required
                        suppressHydrationWarning
                        value={formState.instagramHandle}
                        onChange={handleChange}
                        className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium shadow-sm"
                        placeholder="@yourbrand"
                      />
                    </div>

                    {/* Business Type */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="businessType" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                        Industry / Sector
                      </label>
                      <select
                        name="businessType"
                        id="businessType"
                        suppressHydrationWarning
                        value={formState.businessType}
                        onChange={handleChange}
                        className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium cursor-pointer shadow-sm"
                      >
                        {(siteContent?.contactSettings?.businessTypes || [
                          "Restaurant",
                          "Cafe",
                          "Hotel / Hospitality",
                          "Fashion / Lifestyle",
                          "Beauty / Skincare",
                          "D2C Brand",
                          "Events",
                          "Other"
                        ]).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Services Needed Selection */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <label htmlFor="serviceNeeded" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                      Primary Service Requirement
                    </label>
                    <select
                      name="serviceNeeded"
                      id="serviceNeeded"
                      suppressHydrationWarning
                      value={formState.serviceNeeded}
                      onChange={handleChange}
                      className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium cursor-pointer shadow-sm"
                    >
                      {(siteContent?.contactSettings?.serviceOptions || [
                        "Social Media Management",
                        "Reels & Short-form Content",
                        "Full Brand Campaign",
                        "Product Photography",
                        "Influencer Strategy",
                        "Content Strategy & Consulting"
                      ]).map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      suppressHydrationWarning
                      className="w-full group flex items-center justify-center gap-3 rounded-full bg-[#0A1628] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0A1628] py-4 text-xs font-bold tracking-widest uppercase shadow-[0_10px_25px_rgba(10,22,40,0.2)] transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      <span>{isSubmitting ? "Sending Audit Request..." : "Submit Project Inquiry"}</span>
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 12. SHOWREEL VIDEO MODAL */}
      {showreelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/95 p-4 md:p-6 backdrop-blur-md">
          <button
            onClick={() => {
              setShowreelOpen(false);
              setSelectedVideoForModal(null);
            }}
            className="absolute top-6 right-6 text-studio-bg hover:text-studio-accent transition-colors p-2 z-55 cursor-pointer"
            aria-label="Close video"
          >
            <X width={32} height={32} />
          </button>
          <div className="aspect-video w-full max-w-5xl bg-[#000000] relative flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-studio-bg/10">
            <video
              src={getOptimizedVideoUrl(selectedVideoForModal || centerVideos[videoIndex]?.src || "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42207-large.mp4")}
              className="w-full h-full object-cover"
              controls
              autoPlay
              playsInline
              preload="auto"
            />
          </div>
        </div>
      )}

      {/* 13. LIGHTBOX IMAGE MODAL */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/95 p-4 md:p-8 backdrop-blur-md cursor-pointer select-none"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-studio-bg hover:text-[#C5A880] transition-colors p-2.5 z-[10000] cursor-pointer rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Close image"
          >
            <X width={24} height={24} />
          </button>

          {/* Media container */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-auto h-auto max-w-full max-h-[80vh] flex items-center justify-center overflow-hidden rounded-xl shadow-2xl border border-white/10">
              <img
                src={lightboxImage}
                alt="Enlarged studio visual"
                className="max-h-[80vh] max-w-full w-auto h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Inline Close Icon helper for modal since we need to close it
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
