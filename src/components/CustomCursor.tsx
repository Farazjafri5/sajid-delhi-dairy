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

  const springConfig = { damping: 25, stiffness: 1000, mass: 0.1 };
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

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
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

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "#1A1715",
      border: "0px solid transparent",
    },
    hover: {
      width: 48,
      height: 48,
      backgroundColor: "transparent",
      border: "1px solid #1A1715",
    },
    view: {
      width: 80,
      height: 80,
      backgroundColor: "#1A1715",
      border: "0px solid transparent",
      color: "#F5F3EF",
    },
    play: {
      width: 80,
      height: 80,
      backgroundColor: "#1A1715",
      border: "0px solid transparent",
      color: "#F5F3EF",
    }
  };

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-medium tracking-widest lg:flex"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={cursorType}
      variants={variants}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      {cursorText && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-studio-bg"
        >
          {cursorText}
        </motion.span>
      )}
    </motion.div>
  );
}
