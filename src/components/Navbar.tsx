"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

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

  if (pathname === "/admin") {
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
            ? "border-b border-primary/5 bg-studio-bg/90 py-0 backdrop-blur-md"
            : "bg-transparent py-2"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] w-full items-center justify-between px-8 md:px-16 lg:px-24">
          {/* Logo / Wordmark */}
          <Link
            href="/"
            className="flex items-center"
          >
            <img
              src="/images/logo.png"
              alt="Delhi Diaries Official Logo"
              className="h-14 w-14 md:h-18 md:w-18 object-contain select-none"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-bold tracking-widest uppercase transition-colors duration-300 hover:text-primary hover-underline-animated py-1 ${
                    isActive ? "text-primary font-extrabold" : "text-studio-muted"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="hidden text-[10px] font-bold tracking-widest uppercase text-studio-muted hover:text-primary transition-colors duration-300 md:block"
            >
              Login
            </Link>
            <Link
              href="/contact"
              className="hidden border border-primary px-6 py-2.5 text-[10px] font-extrabold tracking-widest uppercase transition-all duration-500 hover:bg-primary hover:text-studio-bg md:block"
            >
              Start a Project
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-primary lg:hidden cursor-pointer"
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
            className="fixed inset-0 z-40 flex flex-col bg-studio-bg px-6 pt-24 pb-12 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-1 flex-col justify-center gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-3xl font-bold tracking-tight text-primary hover:text-studio-muted"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-6"
            >
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full border border-primary/20 bg-primary py-4 text-center text-xs font-bold tracking-widest uppercase text-studio-bg hover:bg-transparent hover:text-primary transition-all duration-300"
              >
                Start a Project
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full border border-primary/10 py-3 text-center text-[10px] font-bold tracking-widest uppercase text-studio-muted hover:text-primary transition-colors duration-300"
              >
                Admin Login
              </Link>
              <div className="flex justify-between text-[10px] tracking-wider uppercase text-studio-muted">
                <span>Delhi NCR, India</span>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  Instagram
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
