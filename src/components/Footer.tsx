"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
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
  return (
    <footer className="footer-gold-glow text-studio-bg pt-20 pb-10 overflow-hidden">

      <div className="relative z-10 mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Headline */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-block bg-studio-bg p-2.5 rounded-lg border border-studio-accent/20 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={logoSrc}
                alt="Delhi Diaries Official Logo"
                className="h-14 w-14 object-contain select-none"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm tracking-wide text-studio-accent/75">
              Content that people stop scrolling for. Social-first creative campaigns built for brands that want to be remembered.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-studio-accent mb-6">
              Navigation
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/work" className="text-sm text-studio-accent/60 hover:text-studio-bg transition-colors">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-studio-accent/60 hover:text-studio-bg transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-studio-accent/60 hover:text-studio-bg transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-studio-accent/60 hover:text-studio-bg transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-studio-accent mb-6">
              Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-studio-accent/60 hover:text-studio-bg transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917668487182"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-studio-accent/60 hover:text-studio-bg transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:kunwarsajid2@gmail.com"
                  className="text-sm text-studio-accent/60 hover:text-studio-bg transition-colors"
                >
                  kunwarsajid2@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 border-t border-studio-accent/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-studio-accent/40">
          <p>© {new Date().getFullYear()} Delhi Diaries Official. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Delhi · India</span>
            <span>Available for collaborations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
