"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: any) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  magnetic?: boolean;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
  magnetic = true,
  disabled = false,
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || disabled || !buttonRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    // Limit maximum displacement to 8px for sub-pixel feel
    setPosition({ x: x * 0.2, y: y * 0.2 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-500 select-none overflow-hidden text-[10px] py-4 px-8 border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-[#C5A880] text-[#1A1715] border-[#C5A880] hover:bg-transparent hover:text-[#C5A880] hover:border-[#C5A880]",
    secondary: "bg-[#1A1715] text-[#F5F3EF] border-[#1A1715] hover:bg-transparent hover:text-[#1A1715] hover:border-[#1A1715]",
    outline: "bg-transparent text-studio-muted border-primary/10 hover:border-primary/45 hover:text-primary",
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.1 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className} group`}
    >
      {/* Sliding text container for award-winning feel */}
      <span className="relative z-10 block overflow-hidden py-0.5">
        <span className="block transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 w-full text-center">
          {children}
        </span>
      </span>
    </motion.button>
  );
}
