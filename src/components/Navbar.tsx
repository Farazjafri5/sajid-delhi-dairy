"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [logoSrc, setLogoSrc] = useState("/images/logo.png");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("dd_site_content");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.branding?.logoUrl) {
          setLogoSrc(parsed.branding.logoUrl);
        }
      }
    } catch (e) {}
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  const navLinks = [
    { name: "Work", href: "/work" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "border-b border-[#C5A880]/30 bg-[#FAF8F5]/90 py-2.5 backdrop-blur-2xl shadow-[0_10px_35px_rgba(10,22,40,0.06)]"
            : "bg-transparent py-4"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] w-full items-center justify-between px-6 sm:px-10 md:px-16 lg:px-24">
          {/* Logo & Brand Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3 group select-none"
          >
            <div className="relative flex items-center justify-center p-1 rounded-2xl bg-white/40 border border-[#0A1628]/10 group-hover:border-[#C5A880]/50 shadow-sm transition-all duration-300">
              <img
                src={logoSrc}
                alt="Social Diaries Official Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-serif text-sm md:text-base font-extrabold tracking-wider text-[#0A1628] leading-none group-hover:text-[#91724B] transition-colors">
                SOCIAL DIARIES
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-[#C5A880] uppercase mt-0.5">
                Creative Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 py-1.5 ${
                    isActive ? "text-[#0A1628] font-extrabold" : "text-[#0A1628]/65 hover:text-[#0A1628]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.name}
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />}
                  </span>
                  {/* Animated Gold Underline on Hover & Active */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#C5A880] to-[#91724B] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/admin"
              className="hidden text-[11px] font-bold tracking-widest uppercase text-[#0A1628]/60 hover:text-[#0A1628] px-3.5 py-1.5 rounded-full hover:bg-black/5 transition-all duration-300 md:block"
            >
              Login
            </Link>
            
            {/* Luxury Start a Project Pill Button */}
            <Link
              href="/contact"
              className="hidden group relative items-center gap-2 overflow-hidden rounded-full bg-[#0A1628] px-5 py-2.5 text-[11px] font-bold tracking-widest uppercase text-white shadow-[0_4px_18px_rgba(10,22,40,0.18)] hover:bg-[#C5A880] hover:text-[#0A1628] transition-all duration-300 md:flex cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowUpRight size={14} className="text-[#C5A880] group-hover:text-[#0A1628] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0A1628]/5 border border-[#0A1628]/10 text-[#0A1628] hover:bg-[#0A1628] hover:text-[#C5A880] transition-all duration-300 lg:hidden cursor-pointer shadow-sm"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col bg-gradient-to-b from-[#FAF8F5] via-[#F4EEE4] to-[#FAF8F5] px-8 pt-28 pb-12 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-1 flex-col justify-center gap-6 text-left">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A880] uppercase">
                ✦ Navigation
              </span>
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-serif text-3xl sm:text-4xl font-bold tracking-tight transition-colors flex items-center justify-between ${
                        isActive ? "text-[#C5A880]" : "text-[#0A1628] hover:text-[#91724B]"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight size={20} className="text-[#C5A880]" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col gap-4 mt-8 pt-6 border-t border-[#C5A880]/20"
            >
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-2xl bg-[#0A1628] py-4 text-center text-xs font-bold tracking-widest uppercase text-[#C5A880] shadow-xl hover:bg-[#C5A880] hover:text-[#0A1628] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Start a Project</span>
                <span>✦</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-2xl border border-[#0A1628]/15 bg-white/60 py-3 text-center text-[10px] font-bold tracking-widest uppercase text-[#0A1628] hover:bg-[#0A1628] hover:text-white transition-all duration-300"
              >
                Admin Login
              </Link>
              <div className="flex justify-between text-[10px] font-semibold tracking-wider uppercase text-[#0A1628]/60 mt-2">
                <span>Delhi NCR, India</span>
                <a 
                  href="https://www.instagram.com/socialdiariesagency.co/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#0A1628] text-[#C5A880]"
                >
                  @socialdiariesagency.co
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
