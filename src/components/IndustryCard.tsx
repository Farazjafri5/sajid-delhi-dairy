"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface IndustryCardProps {
  name: string;
  statement: string;
  image: string;
}

export default function IndustryCard({ name, statement, image }: IndustryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-[4/5] w-full overflow-hidden bg-primary group"
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-40"
        sizes="(max-width: 768px) 100vw, 25vw"
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 z-10">
        <h3 className="font-serif text-2xl font-bold tracking-tight text-studio-bg md:text-3xl">
          {name}
        </h3>

        {/* Hover Statement Reveal */}
        <div className="overflow-hidden">
          <motion.p
            initial={{ y: "100%", opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-serif text-lg italic text-studio-accent font-medium leading-snug"
          >
            "{statement}"
          </motion.p>
        </div>
      </div>

      {/* Soft overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/40 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
    </div>
  );
}
