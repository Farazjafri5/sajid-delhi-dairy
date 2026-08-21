"use client";

import { motion } from "framer-motion";
import { ServiceItem } from "@/data/services";
import { ArrowUpRight } from "lucide-react";

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative flex flex-col justify-between rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F0] to-[#F3ECE0] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(197,168,128,0.22)] overflow-hidden text-left"
    >
      {/* Top Gold Shimmer Border on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A880] via-[#F3E5D0] to-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Subtle Ambient Radial Glow on Top Corner */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#C5A880]/15 rounded-full blur-2xl pointer-events-none group-hover:bg-[#C5A880]/30 transition-all duration-500" />

      {/* Top Section */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#C5A880] via-[#91724B] to-[#C5A880] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
            {service.id}
          </span>
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A1628]/5 group-hover:bg-[#0A1628] text-[#0A1628] group-hover:text-[#C5A880] border border-[#0A1628]/10 group-hover:border-[#C5A880]/50 transition-all duration-300 shadow-sm"
          >
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        <h3 className="mt-7 font-serif text-xl font-bold tracking-tight text-[#0A1628] md:text-2xl group-hover:text-[#91724B] transition-colors duration-300">
          {service.title}
        </h3>
        
        <p className="mt-3.5 text-sm leading-relaxed text-[#0A1628]/70 font-normal">
          {service.description}
        </p>
      </div>

      {/* Bullet Items list with luxury gold diamond markers */}
      <ul className="mt-8 space-y-3 border-t border-[#C5A880]/20 pt-6 relative z-10">
        {service.details.map((detail, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs tracking-wide text-[#0A1628]/75 group-hover:text-[#0A1628] transition-colors duration-300">
            <span className="text-[#C5A880] font-bold text-xs mt-0.5 shrink-0">✦</span>
            <span className="leading-snug">{detail}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
