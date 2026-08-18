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
import { services } from "@/data/services";
import { projects, Project } from "@/data/projects";
import { WEB3FORMS_ACCESS_KEY } from "@/config/email";
import { isSupabaseConfigured, supabase } from "@/config/supabase";
import { defaultSiteContent, SiteContent } from "@/data/siteContent";

export default function Home() {
  const [projectsList, setProjectsList] = useState<Project[]>(projects);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);

  // Dynamic SEO Title Sync
  useEffect(() => {
    if (siteContent?.seo?.metaTitle) {
      document.title = siteContent.seo.metaTitle;
    }
  }, [siteContent?.seo?.metaTitle]);

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

      // Load site content
      const localContent = localStorage.getItem("dd_site_content");
      if (localContent) {
        try { setSiteContent(JSON.parse(localContent)); } catch {}
      }
    };

    loadDynamicData();
  }, []);

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
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // 📸 SLIDER ARRAYS & DYNAMICS (filtered active only, fully guarded against null)
  const leftImages = (siteContent?.showreel?.leftImages || []).filter(img => img && img.active !== false);
  const rightImages = (siteContent?.showreel?.rightImages || []).filter(img => img && img.active !== false);
  const centerVideos = (siteContent?.showreel?.centerVideos || []).filter(vid => vid && vid.active !== false);

  const [imageIndex, setImageIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);

  // Timer for left/right images (every 6 seconds)
  useEffect(() => {
    if (leftImages.length === 0) return;
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % leftImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [leftImages.length]);

  // Timer for center videos (every 3.5 seconds) - faster!
  useEffect(() => {
    if (centerVideos.length === 0) return;
    const timer = setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % centerVideos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [centerVideos.length]);

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
          subject: `New Lead from Delhi Diaries Official - ${formState.brandName}`,
          from_name: "Delhi Diaries Webmaster",
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


  return (
    <main className="flex-1 bg-studio-bg overflow-hidden">
      {/* 1. HERO SECTION (Split-Screen Cinematic with Fluid Typography) */}
      <section className="relative flex min-h-[90vh] lg:min-h-screen flex-col justify-between pt-28 pb-12 lg:pt-36">
        {/* Background Subtle Grid/Texture */}
        <div className="absolute inset-0 z-0 opacity-[0.03] select-none pointer-events-none bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="mx-auto w-full max-w-[1400px] px-8 md:px-16 lg:px-24 z-10 flex flex-1 flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
            {/* Left Column: Bold Editorial Copy */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <div className="flex items-center gap-3 text-[10px] font-extrabold tracking-widest uppercase text-primary/80 mb-6">
                <span>Delhi / India</span>
                <span className="h-1.5 w-1.5 bg-primary/30 rounded-full" />
                <span>Social-First Creative Studio</span>
              </div>

              <h1 className="heading-serif-hero text-primary uppercase">
                {siteContent.hero?.heading || "We make brands"} <br />
                <span className="italic font-normal text-gradient-premium">{siteContent.hero?.headingItalic || "worth stopping"}</span> for.
              </h1>

              <p className="mt-6 max-w-xl text-sm sm:text-base md:text-lg font-semibold leading-relaxed text-studio-muted">
                {siteContent.hero?.subtitle || "Reels, content, social media, and creative campaigns for brands people remember. Built for restaurants, cafes, luxury hospitality, and D2C brands."}
              </p>

              <div className="mt-8 flex flex-wrap gap-4 max-sm:w-full">
                <Link href="/work">
                  <Button variant="primary" className="!max-sm:w-full">
                    View Our Work
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button variant="secondary" className="!max-sm:w-full">
                    Start a Project
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Premium Floating Instagram Reel Mockup */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full max-w-[340px] aspect-[9/16] bg-primary border-4 border-primary shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-2 overflow-hidden flex flex-col justify-between rounded-3xl"
              >
                {/* Simulated Phone Notch & Status bar */}
                <div className="absolute top-2 inset-x-0 flex justify-between px-6 z-20 text-[9px] font-bold text-studio-bg/60 select-none">
                  <span>9:41</span>
                  <div className="h-4 w-20 bg-primary rounded-full absolute left-1/2 -translate-x-1/2 top-0" />
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
                  className="relative flex-1 bg-[#1a1a1a] overflow-hidden rounded-2xl cursor-pointer group select-none touch-pan-y"
                >
                  {/* Inline Video Player */}
                  {isPlayingReel ? (
                    <video
                      src={mockReels[reelIndex].videoUrl}
                      autoPlay
                      loop
                      muted={isReelMuted}
                      playsInline
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
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-transparent to-primary/20 z-0 pointer-events-none" />

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

                  {/* Play icon overlay */}
                  {!isPlayingReel && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="h-14 w-14 rounded-full bg-studio-bg/25 backdrop-blur-sm flex items-center justify-center text-studio-bg group-hover:scale-110 transition-transform duration-300">
                        <Play fill="currentColor" size={16} className="ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Vertical Instagram Action Bar (Likes, Comments, Shares) */}
                  <div className="absolute right-4 bottom-16 flex flex-col items-center gap-5 text-studio-bg z-10 select-none pointer-events-none">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">❤️</span>
                      <span className="text-[9px] font-bold mt-1 text-studio-bg/85">{mockReels[reelIndex].likes}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg">💬</span>
                      <span className="text-[9px] font-bold mt-1 text-studio-bg/85">{mockReels[reelIndex].comments}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg">✈️</span>
                      <span className="text-[9px] font-bold mt-1 text-studio-bg/85">1.2k</span>
                    </div>
                  </div>

                  {/* Mock Username and Caption Details */}
                  <div className="absolute left-4 bottom-4 right-14 text-studio-bg z-10 select-none text-left pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-studio-accent/40 border border-studio-bg/25 flex items-center justify-center text-[9px] font-bold">
                        DD
                      </div>
                      <span className="text-xs font-bold tracking-wider">delhidiariesofficial</span>
                      <span className="text-[8px] bg-studio-bg/20 px-2 py-0.5 rounded-full font-bold">Follow</span>
                    </div>
                    <p className="text-[10px] mt-2 font-normal leading-relaxed text-studio-bg/90 line-clamp-2">
                      {mockReels[reelIndex].caption}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[8px] text-studio-accent/80 font-bold uppercase tracking-wider">
                      <span>🎵 original audio</span>
                      <span>•</span>
                      <span>Saket, Delhi</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating Metadata Banner */}
        <div className="mx-auto w-full max-w-[1400px] px-8 md:px-16 lg:px-24 z-10 mt-12 grid grid-cols-1 gap-6 border-t border-primary/10 pt-8 sm:grid-cols-3 text-xs tracking-wider uppercase text-studio-muted">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-primary">Based In:</span>
            <span>Delhi NCR, India</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-primary">Focus:</span>
            <span>Content • Social • Reels</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-primary">Status:</span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Available for collaborations
            </span>
          </div>
        </div>
      </section>

      {/* 2. SHOWREEL SECTION (Responsive Aspect Ratios) */}
      <section className="bg-primary text-studio-bg py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="text-left">
              <span className="text-xs font-semibold tracking-widest uppercase text-studio-accent/60">
                Studio Reel
              </span>
              <h2 className="mt-4 heading-serif-section text-studio-bg uppercase">
                {siteContent.showreel?.heading || "This is what we do."}
              </h2>
            </div>
            <p className="max-w-md text-sm text-studio-accent/75 font-normal leading-relaxed text-left">
              {siteContent.showreel?.description || "We shoot short-form videos designed to convert casual scrollers into loyal customers. No stock templates, no boring structures."}
            </p>
          </div>

          {/* Reel Display Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            {/* Left vertical image */}
            <div 
              onClick={() => setLightboxImage(leftImages[imageIndex].src)}
              className="relative aspect-[9/16] overflow-hidden bg-studio-muted/20 order-2 lg:order-1 group cursor-pointer hidden lg:block"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={imageIndex}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={leftImages[imageIndex].src}
                    alt={leftImages[imageIndex].label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-primary/20" />
                  <div className="absolute bottom-6 left-6 text-xs uppercase tracking-widest text-studio-bg z-10">
                    {leftImages[imageIndex].label}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Center Main Showreel player (Reel layout on mobile, Cinema layout on desktop) */}
            <div className="lg:col-span-2 relative aspect-[9/16] md:aspect-video bg-studio-muted/10 order-1 lg:order-2 overflow-hidden flex items-center justify-center group">
              {/* Mobile Previous / Next Arrows (Visible only on mobile/tablet screens) */}
              {centerVideos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoIndex((prev) => (prev - 1 + centerVideos.length) % centerVideos.length);
                    }}
                    className="lg:hidden absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xl active:scale-90 transition-transform cursor-pointer"
                    aria-label="Previous Video"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoIndex((prev) => (prev + 1) % centerVideos.length);
                    }}
                    className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xl active:scale-90 transition-transform cursor-pointer"
                    aria-label="Next Video"
                  >
                    <ChevronRight size={22} />
                  </button>

                  {/* Video Counter Indicator for Mobile */}
                  <div className="lg:hidden absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-widest uppercase">
                    <span>{videoIndex + 1}</span>
                    <span className="text-white/40">/</span>
                    <span className="text-white/60">{centerVideos.length}</span>
                  </div>
                </>
              )}

              <AnimatePresence mode="popLayout">
                <motion.div
                  key={videoIndex}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
                  onClick={() => setShowreelOpen(true)}
                >
                  <Image
                    src={centerVideos[videoIndex].poster}
                    alt={centerVideos[videoIndex].label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/45 transition-colors duration-500" />
                  
                  {/* Play Button Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowreelOpen(true);
                    }}
                    className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-studio-bg text-primary transition-all duration-300 scale-90 group-hover:scale-100 shadow-xl cursor-pointer"
                    data-cursor="play"
                  >
                    <Play fill="currentColor" size={20} className="ml-0.5" />
                  </button>

                  <div className="absolute bottom-6 left-6 text-[10px] md:text-xs uppercase tracking-widest text-studio-bg z-10">
                    Click to {centerVideos[videoIndex].label}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right vertical image */}
            <div 
              onClick={() => setLightboxImage(rightImages[imageIndex].src)}
              className="relative aspect-[9/16] overflow-hidden bg-studio-muted/20 order-3 group cursor-pointer hidden lg:block"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={imageIndex}
                  initial={{ y: "-100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={rightImages[imageIndex].src}
                    alt={rightImages[imageIndex].label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-primary/20" />
                  <div className="absolute bottom-6 left-6 text-xs uppercase tracking-widest text-studio-bg z-10">
                    {rightImages[imageIndex].label}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MARQUEE SECTION */}
      <section className="bg-studio-accent/25 border-y border-primary/10 py-8 select-none">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 overflow-hidden">
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee gap-16 pr-16 text-3xl md:text-5xl font-serif font-bold tracking-tight text-primary uppercase">
              <span>Reels</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Content</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Social</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Strategy</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Brands</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Campaigns</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Collaborations</span>
              <span className="italic font-normal text-primary/30">•</span>
            </div>
            {/* Duplicate to enable infinite loop scroll */}
            <div className="flex animate-marquee gap-16 pr-16 text-3xl md:text-5xl font-serif font-bold tracking-tight text-primary uppercase" aria-hidden="true">
              <span>Reels</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Content</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Social</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Strategy</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Brands</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Campaigns</span>
              <span className="italic font-normal text-primary/30">•</span>
              <span>Collaborations</span>
              <span className="italic font-normal text-primary/30">•</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section className="py-24 md:py-32">
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

      {/* 5. INDUSTRIES SECTION */}
      <section className="bg-primary text-studio-bg py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
          {/* Header */}
          <div className="max-w-2xl mb-16 text-left">
            <span className="text-xs font-semibold tracking-widest uppercase text-studio-accent/60">
              Who We Create For
            </span>
            <h2 className="mt-4 heading-serif-section text-studio-bg uppercase">
              We create for brands people love.
            </h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <section className="py-24 md:py-32 md:pb-52 overflow-hidden">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 text-left">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
                Selected Projects
              </span>
              <h2 className="mt-4 heading-serif-section text-primary uppercase">
                Work that does the talking.
              </h2>
            </div>
            <Link href="/work">
              <Button variant="secondary">View All Projects</Button>
            </Link>
          </div>

          {/* Asymmetric Portfolio Grid with Infinite Vertical Scroll Loop */}
          <div className="relative md:h-[750px] lg:h-[850px] overflow-hidden">
            {/* Fade overlays for the premium editorial look */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-studio-bg to-transparent z-10 pointer-events-none hidden md:block" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-studio-bg to-transparent z-10 pointer-events-none hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start h-full">
              {/* Column 1 (Projects 1 & 3) - Slides Up Slow */}
              <div className="flex flex-col gap-12 lg:gap-24 md:animate-vertical-loop-slow md:pause-on-hover">
                {/* Original set */}
                {projectsList.slice(0, 4).filter((_, idx) => idx % 2 === 0).map((project) => (
                  <ProjectCard key={`${project.slug}-col1`} project={project} asymmetric={false} />
                ))}
                {/* Duplicate set for infinite loop */}
                {projectsList.slice(0, 4).filter((_, idx) => idx % 2 === 0).map((project) => (
                  <ProjectCard key={`${project.slug}-col1-dup`} project={project} asymmetric={false} />
                ))}
              </div>

              {/* Column 2 (Projects 2 & 4) - Slides Down (Reverse loop) */}
              <div className="flex flex-col gap-12 lg:gap-24 md:animate-vertical-loop-reverse md:pause-on-hover md:mt-24">
                {/* Original set */}
                {projectsList.slice(0, 4).filter((_, idx) => idx % 2 !== 0).map((project) => (
                  <ProjectCard key={`${project.slug}-col2`} project={project} asymmetric={false} />
                ))}
                {/* Duplicate set for infinite loop */}
                {projectsList.slice(0, 4).filter((_, idx) => idx % 2 !== 0).map((project) => (
                  <ProjectCard key={`${project.slug}-col2-dup`} project={project} asymmetric={false} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROCESS SECTION */}
      <section className="border-t border-primary/10 py-24 md:py-32 bg-studio-accent/10">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
          {/* Header */}
          <div className="max-w-2xl mb-20 text-left">
            <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
              How We Work
            </span>
            <h2 className="mt-4 heading-serif-section text-primary uppercase">
              Our Process
            </h2>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              { num: "01", name: "DISCOVER", desc: "We deep-dive into your brand, analyze your competitors on social media, and define a unique content personality." },
              { num: "02", name: "CREATE", desc: "Our creative crew scripts, shoots, and edits native vertical videos and premium photos designed to stop scrolls." },
              { num: "03", name: "PUBLISH", desc: "We handle scheduling, daily copywriting, trending audio integrations, and community management in real-time." },
              { num: "04", name: "GROW", desc: "We track performance metrics closely, optimize based on reach results, and scale high-engagement campaigns." }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex flex-col border-t border-primary/15 pt-8"
              >
                <span className="font-serif text-2xl font-bold text-primary/30 mb-6">{step.num}</span>
                <h3 className="font-serif text-lg font-bold tracking-tight text-primary mb-3">{step.name}</h3>
                <p className="text-sm leading-relaxed text-studio-muted font-normal">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY US SECTION */}
      <section className="py-24 md:py-32 border-t border-primary/10">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
          {/* Header */}
          <div className="max-w-3xl mb-20 text-left">
            <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
              Our Stance
            </span>
            <h2 className="mt-4 heading-serif-section text-primary uppercase">
              We don't just post. <br />
              We build attention.
            </h2>
          </div>

          {/* Focus grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              { title: "SOCIAL FIRST", text: "Content built directly for the way humans consume Instagram today. No dry flyers or stock banners." },
              { title: "ON-GROUND EXECUTION", text: "We don't just email strategy slideshows. We show up at your venue, bring the kit, and capture organic stories." },
              { title: "NATIVE TO SOCIAL", text: "Reels and photography formatted specifically to blend into feeds while grabbing maximum engagement." },
              { title: "NO COOKIE-CUTTER CONTENT", text: "Every dining group, aesthetic boutique, or beauty product gets a unique visual direction custom-styled to them." }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col justify-between border-l border-primary/10 pl-6 h-full min-h-[140px] md:min-h-0">
                <h3 className="font-serif text-lg font-bold tracking-tight text-primary uppercase mb-4">
                  {stat.title}
                </h3>
                <p className="text-sm leading-relaxed text-studio-muted font-normal">
                  {stat.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INSTAGRAM SECTION */}
      <section className="py-24 bg-[#FFFFFF] border-t border-primary/10">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16 text-left">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
                Social Presence
              </span>
              <h2 className="mt-4 heading-serif-section text-primary uppercase">
                Our Instagram is our portfolio.
              </h2>
            </div>
            <a
              href="https://www.instagram.com/delhidiariesofficial_?igsh=amUyZml1ejVmY2M1"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary border-b border-primary pb-1 self-start sm:self-auto"
            >
              Follow us on Instagram <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* 3x3 Grid layout */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {instagramFeed.map((tile, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(tile.image)}
                className="relative aspect-square bg-studio-accent overflow-hidden group cursor-pointer"
              >
                <Image
                  src={tile.image}
                  alt={`Instagram tile ${idx}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 33vw, 33vw"
                />
                
                {/* Hover overlay detail */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 md:p-6 text-studio-bg z-10 text-left">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[8px] md:text-[10px] tracking-widest uppercase bg-studio-bg/15 py-0.5 px-2 md:py-1 md:px-3 self-start rounded-full">
                      {tile.type}
                    </span>
                    <span className="hidden sm:inline-block text-[9px] text-[#C5A880] uppercase tracking-wider font-semibold">
                      🔍 Tap to expand
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-serif text-xs md:text-lg font-bold">{tile.client}</h4>
                    <p className="text-[9px] md:text-xs text-studio-accent/75 mt-0.5 md:mt-1">{tile.campaign}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="py-24 md:py-32 bg-studio-accent/15 border-t border-primary/10">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
              Client Love
            </span>
            <h2 className="mt-4 heading-serif-section text-primary uppercase">
              Good content gets attention. <br />
              Good partnerships keep it.
            </h2>
          </div>

          {/* Slider Container */}
          <div className="max-w-[1400px] w-full relative text-left">
            {/* Sliding Card Wrapper */}
            <div className="relative overflow-hidden min-h-[360px] md:min-h-[290px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full"
                >
                  {/* Card 1 */}
                  <div className="bg-[#FFFFFF] p-8 md:p-10 border border-primary/10 shadow-[0_15px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between h-full">
                    <div>
                      {/* Double Quotes Icon */}
                      <span className="font-serif text-5xl text-studio-accent/25 block -mt-4 -ml-2 h-6 select-none">“</span>
                      <p className="font-serif text-base md:text-lg italic font-normal text-primary leading-relaxed pl-2 mt-2">
                        {testimonials[testimonialIndex].quote}
                      </p>
                    </div>
                    
                    <div className="mt-8 border-t border-primary/10 pt-6 pl-2">
                      <h4 className="font-serif text-sm md:text-base font-bold text-primary">
                        {testimonials[testimonialIndex].author}
                      </h4>
                      <p className="text-[10px] md:text-xs tracking-wider uppercase text-studio-muted mt-1">
                        {testimonials[testimonialIndex].company} — {testimonials[testimonialIndex].industry}
                      </p>
                    </div>
                  </div>

                  {/* Card 2 (Hidden on mobile, side-by-side on desktop) */}
                  <div className="hidden md:flex bg-[#FFFFFF] p-8 md:p-10 border border-primary/10 shadow-[0_15px_30px_rgba(0,0,0,0.01)] flex-col justify-between h-full">
                    <div>
                      {/* Double Quotes Icon */}
                      <span className="font-serif text-5xl text-studio-accent/25 block -mt-4 -ml-2 h-6 select-none">“</span>
                      <p className="font-serif text-base md:text-lg italic font-normal text-primary leading-relaxed pl-2 mt-2">
                        {testimonials[(testimonialIndex + 1) % testimonials.length].quote}
                      </p>
                    </div>
                    
                    <div className="mt-8 border-t border-primary/10 pt-6 pl-2">
                      <h4 className="font-serif text-sm md:text-base font-bold text-primary">
                        {testimonials[(testimonialIndex + 1) % testimonials.length].author}
                      </h4>
                      <p className="text-[10px] md:text-xs tracking-wider uppercase text-studio-muted mt-1">
                        {testimonials[(testimonialIndex + 1) % testimonials.length].company} — {testimonials[(testimonialIndex + 1) % testimonials.length].industry}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Navigation Controls */}
            <div className="flex items-center justify-between mt-8">
              {/* Left/Right buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setTestimonialIndex(
                      (prev) => (prev - 1 + testimonials.length) % testimonials.length
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-[#FFFFFF] text-primary hover:bg-primary hover:text-studio-bg transition-colors duration-300 shadow-sm cursor-pointer"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-[#FFFFFF] text-primary hover:bg-primary hover:text-studio-bg transition-colors duration-300 shadow-sm cursor-pointer"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Indicator Dots */}
              <div className="flex gap-2.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTestimonialIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      testimonialIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-primary/20"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CTA & PREMIUM CONTACT FORM */}
      <section id="contact" className="bg-primary text-studio-bg py-24 md:py-32 relative">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* CTA copy panel */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full text-left">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-studio-accent/60">
                  Let's Collaborate
                </span>
                <h2 className="mt-6 heading-serif-section text-studio-bg uppercase">
                  Got a <span className="text-gradient-gold">brand</span> people should know about?
                </h2>
                <p className="mt-6 text-sm md:text-base text-studio-accent/75 leading-relaxed font-normal">
                  Let's make something worth watching. Drop us a line below, and we'll reply with a custom social audit within 24 hours.
                </p>
              </div>

              {/* Office Details */}
              {/* <div className="mt-16 space-y-6 text-xs tracking-wider uppercase text-studio-accent/60 border-t border-studio-accent/15 pt-8">
                <div className="flex items-start gap-4">
                  <MapPin size={16} className="text-studio-accent mt-0.5" />
                  <div>
                    <span className="block font-semibold text-studio-bg">HQ Office</span>
                    <span className="block mt-1 font-normal normal-case">Champa Gali, Saket, New Delhi, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail size={16} className="text-studio-accent mt-0.5" />
                  <div>
                    <span className="block font-semibold text-studio-bg">Direct Email</span>
                    <a href="mailto:kunwarsajid2@gmail.com" className="block mt-1 font-normal hover:text-studio-bg transition-colors normal-case">
                      kunwarsajid2@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageSquare size={16} className="text-studio-accent mt-0.5" />
                  <div>
                    <span className="block font-semibold text-studio-bg">WhatsApp & Call</span>
                    <a href="https://wa.me/917668487182" target="_blank" rel="noopener noreferrer" className="block mt-1 font-normal hover:text-studio-bg transition-colors">
                      +91 76684 87182
                    </a>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Premium Form panel */}
            <div className="lg:col-span-7 bg-studio-bg text-primary p-8 md:p-12 relative shadow-2xl">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
                    <Check size={28} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold uppercase text-primary">
                    Message Sent!
                  </h3>
                  <p className="mt-3 max-w-sm text-sm text-studio-muted leading-relaxed font-normal">
                    Thank you for reaching out. We will audit your Instagram and contact you via email or WhatsApp within 24 hours.
                  </p>
                  <Button variant="secondary" onClick={() => setIsSubmitted(false)} className="mt-8">
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal"
                        placeholder="Enter your name"
                      />
                    </div>

                    {/* Brand Name */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="brandName" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                        Brand Name *
                      </label>
                      <input
                        type="text"
                        name="brandName"
                        id="brandName"
                        required
                        value={formState.brandName}
                        onChange={handleChange}
                        className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal"
                        placeholder="Enter your brand name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal"
                        placeholder="Enter your email address"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={formState.phone}
                        onChange={handleChange}
                        className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal"
                        placeholder="Enter your phone number"
                      />
                      {phoneError && (
                        <span className="text-[9px] text-red-500 font-bold tracking-wider uppercase mt-1">
                          {phoneError}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Instagram Handle */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="instagramHandle" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                        Instagram Handle *
                      </label>
                      <input
                        type="text"
                        name="instagramHandle"
                        id="instagramHandle"
                        required
                        value={formState.instagramHandle}
                        onChange={handleChange}
                        className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal"
                        placeholder="Enter your Instagram handle"
                      />
                    </div>

                    {/* Business Type */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="businessType" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                        Business Type
                      </label>
                      <select
                        name="businessType"
                        id="businessType"
                        value={formState.businessType}
                        onChange={handleChange}
                        className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal cursor-pointer"
                      >
                        <option value="Restaurant">Restaurant</option>
                        <option value="Cafe">Cafe</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="D2C">D2C</option>
                        <option value="Event">Event</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Services Needed Selection */}
                  <div className="flex flex-col gap-2 pt-2">
                    <label htmlFor="serviceNeeded" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                      What do you need help with?
                    </label>
                    <select
                      name="serviceNeeded"
                      id="serviceNeeded"
                      value={formState.serviceNeeded}
                      onChange={handleChange}
                      className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal cursor-pointer"
                    >
                      <option value="Full Social Media Management">Full Social Media Management</option>
                      <option value="Reels & Short-form Content">Reels & Short-form Content</option>
                      <option value="Content Shoot (Photo/Video)">Content Shoot (Photo/Video)</option>
                      <option value="Influencer & Brand Collaboration">Influencer & Brand Collaboration</option>
                      <option value="Content Strategy Planning">Content Strategy Planning</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending Audit Request..." : "Let's Create →"}
                    </Button>
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
            onClick={() => setShowreelOpen(false)}
            className="absolute top-6 right-6 text-studio-bg hover:text-studio-accent transition-colors p-2 z-55 cursor-pointer"
            aria-label="Close video"
          >
            <X width={32} height={32} />
          </button>
          <div className="aspect-video w-full max-w-5xl bg-[#000000] relative flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-studio-bg/10">
            <video
              src={centerVideos[videoIndex]?.src || "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-42207-large.mp4"}
              className="w-full h-full object-cover"
              controls
              autoPlay
              playsInline
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
