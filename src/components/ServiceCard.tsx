"use client";

import { motion } from "framer-motion";
import { ServiceItem } from "@/data/services";
import { Plus } from "lucide-react";

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group relative flex flex-col justify-between border border-primary/10 bg-[#FFFFFF] p-8 md:p-10 transition-all duration-500 hover:border-primary hover:shadow-[0_20px_40px_rgba(0,0,0,0.02)]"
    >
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between">
          <span className="font-serif text-3xl font-bold tracking-tight text-primary/30 group-hover:text-primary transition-colors duration-300">
            {service.id}
          </span>
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 group-hover:bg-primary group-hover:text-studio-bg transition-colors duration-300"
          >
            <Plus size={16} />
          </motion.div>
        </div>

        <h3 className="mt-8 font-serif text-xl font-bold tracking-tight text-primary md:text-2xl">
          {service.title}
        </h3>
        
        <p className="mt-4 text-sm leading-relaxed text-studio-muted font-normal">
          {service.description}
        </p>
      </div>

      {/* Bullet Items list */}
      <ul className="mt-10 space-y-3 border-t border-primary/10 pt-6">
        {service.details.map((detail, idx) => (
          <li key={idx} className="flex items-center gap-3 text-xs tracking-wide text-studio-muted group-hover:text-primary transition-colors duration-300">
            <span className="h-1 w-1 bg-primary/40 rounded-full" />
            {detail}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
