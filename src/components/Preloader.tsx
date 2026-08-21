"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

  useEffect(() => {
    if (isAdmin) {
      setLoading(false);
      return;
    }
    // Lock scroll on mount
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => {
      setLoading(false);
      // Unlock scroll on complete
      document.body.style.overflow = "";
    }, 2500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%", 
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center preloader-bg text-[#F5F3EF]"
        >
          {/* Subtle noise grid overlay to match background aesthetics */}
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-repeat bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />

          {/* Luxury Text Animation */}
          <div className="relative overflow-hidden text-center px-6">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
              }}
              exit={{ 
                y: -60, 
                opacity: 0,
                transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } 
              }}
              className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] leading-none text-gradient-gold"
            >
              Social Diaries
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.8,
                transition: { delay: 0.6, duration: 1 }
              }}
              exit={{ opacity: 0 }}
              className="mt-4 text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-[#F0D399]"
            >
              Official
            </motion.div>

            {/* Luxurious Line Loading Bar */}
            <div className="mt-8 h-[1px] w-48 mx-auto bg-[#F5F3EF]/10 overflow-hidden relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ 
                  left: "100%",
                  transition: { duration: 2.2, ease: "easeInOut" }
                }}
                className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-[#D4AF37] to-[#F5E5C9]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
