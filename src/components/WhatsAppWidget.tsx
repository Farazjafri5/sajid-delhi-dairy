"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const WhatsAppIcon = () => (
  <svg
    className="h-4 w-4 fill-current"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437 0 9.862-4.42 9.866-9.864.002-2.637-1.023-5.116-2.887-6.98C16.38 1.897 13.9 1.866 12.01 1.866c-5.436 0-9.86 4.42-9.864 9.864-.001 1.73.456 3.424 1.396 4.887L2.518 21.39l4.129-1.08zM17.75 14.89c-.315-.157-1.86-.92-2.145-1.025-.285-.104-.493-.157-.7.157-.207.314-.8 1.025-.98 1.235-.18.209-.36.235-.675.078-1.745-.873-2.92-1.516-3.882-3.167-.255-.44-.082-.68.093-.855.157-.157.315-.367.472-.55.157-.184.21-.314.315-.524.105-.21.053-.393-.026-.55-.08-.157-.7-1.686-.96-2.316-.252-.61-.51-.527-.7-.527-.18-.008-.388-.008-.596-.008s-.545.078-.83.393c-.285.314-1.09 1.073-1.09 2.616s1.123 3.037 1.277 3.246c.156.21 2.21 3.374 5.356 4.73.748.323 1.333.517 1.787.662.752.24 1.436.207 1.977.127.602-.09 1.86-.76 2.124-1.467.264-.707.264-1.31.187-1.437-.08-.124-.287-.18-.6-.338z" />
  </svg>
);

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const [whatsappNumber, setWhatsappNumber] = useState("917668487182");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("dd_site_content");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.contactSettings?.whatsapp) {
          const digits = parsed.contactSettings.whatsapp.replace(/\D/g, "");
          if (digits.length >= 10) {
            setWhatsappNumber(digits.length === 10 ? `91${digits}` : digits);
          }
        }
      }
    } catch (e) {}
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }
  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 2.8, duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-[998] flex items-center gap-2.5 bg-[#9333EA] text-white px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(147,51,234,0.35)] hover:bg-[#7E22CE] hover:shadow-[0_15px_35px_rgba(147,51,234,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-xs tracking-wider uppercase select-none border border-white/10"
    >
      <WhatsAppIcon />
      <span>Chat with us</span>
    </motion.a>
  );
}

