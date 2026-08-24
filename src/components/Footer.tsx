"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Inline Instagram Icon for clean luxury rendering
function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const [logoSrc, setLogoSrc] = useState("/images/logo.png");
  const [contact, setContact] = useState({
    email: "kunwarsajid2@gmail.com",
    phone: "+91 76684 87182",
    whatsapp: "+91 76684 87182",
    instagramHandle: "@socialdiariesagency.co",
    instagramUrl: "https://www.instagram.com/socialdiariesagency.co/",
  });

  useEffect(() => {
    try {
      const cached = localStorage.getItem("dd_site_content");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.branding?.logoUrl) {
          setLogoSrc(parsed.branding.logoUrl);
        }
        if (parsed?.contactSettings) {
          setContact((prev) => ({
            ...prev,
            ...parsed.contactSettings,
          }));
        }
      }
    } catch (e) {}
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="footer-gold-glow text-white pt-16 pb-12 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1400px] w-full px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 text-left">
          {/* Logo & Headline */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3.5 group select-none"
            >
              <div className="bg-white/95 p-2 rounded-2xl border border-[#C5A880]/40 group-hover:border-[#C5A880] shadow-md transition-all">
                <img
                  src={logoSrc}
                  alt="Social Diaries Official Logo"
                  className="h-11 w-11 object-contain select-none transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-base font-extrabold tracking-wider text-white leading-none">
                  SOCIAL DIARIES
                </span>
                <span className="text-[9px] font-bold tracking-[0.25em] text-[#C5A880] uppercase mt-1">
                  Creative Studio
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm tracking-wide text-white/70 leading-relaxed font-normal">
              Content that people stop scrolling for. Social-first creative campaigns built for restaurants, cafes, luxury hospitality, and D2C brands.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-[#C5A880] font-semibold">
              <span>✦</span>
              <span>Based in New Delhi, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#C5A880] text-xs">✦</span>
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5A880]">
                Navigation
              </h4>
            </div>
            <ul className="space-y-3.5">
              {[
                { name: "Selected Work", href: "/work" },
                { name: "Our Services", href: "/services" },
                { name: "Our Story", href: "/about" },
                { name: "Start a Project", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-sm font-medium text-white/70 hover:text-[#C5A880] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-300"
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#C5A880] text-xs">✦</span>
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#C5A880]">
                Connect
              </h4>
            </div>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={contact.instagramUrl || "https://www.instagram.com/socialdiariesagency.co/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white/70 hover:text-[#C5A880] hover:translate-x-1 inline-flex items-center gap-2 transition-all duration-300"
                >
                  <InstagramIcon size={14} />
                  <span>{contact.instagramHandle || "@socialdiariesagency.co"}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${(contact.whatsapp || "+91 76684 87182").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white/70 hover:text-[#C5A880] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-300"
                >
                  <span>💬 WhatsApp ({contact.whatsapp || "+91 76684 87182"})</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email || "kunwarsajid2@gmail.com"}`}
                  className="text-sm font-medium text-white/70 hover:text-[#C5A880] hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-300"
                >
                  <span>✉️ {contact.email || "kunwarsajid2@gmail.com"}</span>
                </a>
              </li>
              {/* <li>
                <Link
                  href="/admin"
                  className="text-xs font-bold uppercase tracking-wider text-white/40 hover:text-[#C5A880] transition-colors mt-2 inline-block"
                >
                  Admin Portal ➔
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} Social Diaries Official. All rights reserved.</p>
          <p className="mt-4 sm:mt-0">Creative Direction & Production</p>
        </div>
      </div>
    </footer>
  );
}
