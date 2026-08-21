"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const pathname = usePathname();
  const [cursorType, setCursorType] = useState<"default" | "hover" | "view" | "play">("default");
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Buttery-smooth spring physics tuned for zero lag and fluid trailing
  const springConfig = { damping: 32, stiffness: 450, mass: 0.08 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

  useEffect(() => {
    if (isAdmin) return;

    // Check if we are on desktop
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    if (isMobile) return;

    setIsVisible(true);
    document.documentElement.classList.add("custom-cursor-enabled");

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find closest interactive element
      const interactiveEl = target.closest("a, button, [role='button'], input, textarea, select");
      const viewEl = target.closest("[data-cursor='view']");
      const playEl = target.closest("[data-cursor='play']");

      if (playEl) {
        setCursorType("play");
        setCursorText("PLAY");
      } else if (viewEl) {
        setCursorType("view");
        setCursorText("VIEW");
      } else if (interactiveEl) {
        setCursorType("hover");
        setCursorText("");
      } else {
        setCursorType("default");
        setCursorText("");
      }
    };

    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      document.documentElement.classList.remove("custom-cursor-enabled");
    };
  }, [cursorX, cursorY, isAdmin]);

  if (isAdmin || !isVisible) return null;

  // GPU-accelerated scale transforms for 144Hz butter-smooth rendering
  const variants = {
    default: {
      scale: 1,
      opacity: 1,
      backgroundColor: "#FFFFFF",
    },
    hover: {
      scale: 3.2,
      opacity: 0.95,
      backgroundColor: "#FFFFFF",
    },
    view: {
      scale: 5.6,
      opacity: 1,
      backgroundColor: "#FFFFFF",
    },
    play: {
      scale: 5.6,
      opacity: 1,
      backgroundColor: "#FFFFFF",
    }
  };

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[99999] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold tracking-widest lg:flex mix-blend-difference w-4 h-4"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      animate={cursorType}
      variants={variants}
      transition={{ type: "spring", stiffness: 350, damping: 24, mass: 0.1 }}
    >
      {cursorText && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 0.2 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="text-black font-black tracking-widest text-[36px] select-none uppercase pointer-events-none"
        >
          {cursorText}
        </motion.span>
      )}
    </motion.div>
  );
}
