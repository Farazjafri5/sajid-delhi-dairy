import ServiceCard from "@/components/ServiceCard";
import { services } from "@/data/services";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function ServicesPage() {
  return (
    <main className="flex-1 bg-gradient-to-b from-[#FAF8F5] via-[#FFFFFF] to-[#FAF8F5] max-sm:pb-10 pt-25 pb-24 md:pt-30 md:pb-32 relative overflow-hidden">
      {/* Subtle Ambient Gold Spotlights */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#C5A880]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#DD2A7B]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-8 md:px-16 lg:px-24 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16 max-sm:mb-10 text-left">
          {/* Back Navigation Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#0A1628]/70 hover:text-[#0A1628] bg-white/80 border border-[#C5A880]/35 hover:border-[#C5A880] px-4 py-2 rounded-full mb-6 transition-all duration-300 shadow-sm hover:shadow group w-fit cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft size={14} className="text-[#C5A880] transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/40 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md shadow-sm">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0A1628]">Our Offerings</span>
            </div>
          </div>
          <h1 className="heading-serif-hero text-[#0A1628] uppercase tracking-tight">
            From one reel to an <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#91724B] via-[#C5A880] to-[#91724B] drop-shadow-[0_2px_15px_rgba(197,168,128,0.25)]">
              entire digital presence.
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-[#0A1628]/70 font-medium max-w-2xl leading-relaxed">
            We operate as a full-service creative partner. We show up at your venue, craft the strategy, shoot the content, and manage your community.
          </p>
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 max-sm:mb-5">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* How We Shoot Section (Luxury Pathway Cards) */}
        <div className="border-t border-[#C5A880]/20 pt-20 max-sm:pt-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-5 text-left">
              <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/40 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md shadow-sm">
                <span className="text-[#C5A880] text-xs">✦</span>
                <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0A1628]">On-Ground Shoots</span>
              </div>
              <h2 className="mt-2 heading-serif-section text-[#0A1628] uppercase tracking-tight">
                We show up and <br />
                <span className="bg-gradient-to-r from-[#0A1628] via-[#91724B] to-[#C5A880] bg-clip-text text-transparent">create.</span>
              </h2>
              <p className="mt-6 text-sm md:text-base text-[#0A1628]/70 leading-relaxed font-normal">
                Unlike agencies that work with generic stock footage or require you to capture your own clips, we handle everything on-ground. Our team visits your restaurant, cafe, boutique, or office in Delhi NCR once or twice a month with high-end camera rigs and lighting setups.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                { title: "Monthly Production Days", desc: "A structured, pre-planned shooting day covering menu item reveals, interior design angles, customer experiences, and staff highlights.", tag: "✦ On-Site Film Rig" },
                { title: "Quick-turn Reels Capture", desc: "Filming designed specifically to align with current trending audios and transition challenges on Instagram.", tag: "✦ Viral Social Hooks" },
                { title: "UGC & Authentic Capture", desc: "Short, raw-style mobile vertical video shoots that blend naturally into user feeds and drive higher shares.", tag: "✦ Native Engagement" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="group relative rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F1] to-[#F3ECE1] p-6 sm:p-7 shadow-sm hover:shadow-[0_20px_45px_rgba(197,168,128,0.22)] transition-all duration-500 hover:-translate-y-1 overflow-hidden flex gap-5 items-start text-left"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A880] via-[#F3E5D0] to-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="font-serif text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#0A1628] via-[#91724B] to-[#C5A880] leading-none mt-1">
                    0{idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#0A1628] uppercase group-hover:text-[#91724B] transition-colors">{item.title}</h3>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-[#C5A880] bg-white/80 border border-[#C5A880]/30 px-2.5 py-0.5 rounded-full self-start sm:self-auto">{item.tag}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#0A1628]/70 leading-relaxed font-normal mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Luxury Midnight CTA banner */}
        <div className="mt-28 max-sm:mt-5 relative rounded-3xl border border-[#C5A880]/30 bg-gradient-to-b from-[#070F1B] via-[#0A1628] to-[#070F1B] p-10 md:p-16 text-center text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[#C5A880]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A880]">Collaborate With Us</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
              Ready to give your brand a <br />
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F5E6D3] to-[#C5A880] bg-clip-text text-transparent">
                premium visual language?
              </span>
            </h3>
            <p className="mt-4 text-xs sm:text-sm text-white/70 max-w-lg leading-relaxed">
              Let's discuss how high-end visual storytelling and social strategy can scale your reservations and customer desire.
            </p>
            <Link 
              href="/contact" 
              className="mt-8 group flex items-center gap-3 rounded-full bg-[#C5A880] text-[#0A1628] hover:bg-white hover:text-[#0A1628] px-8 py-4 text-xs font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(197,168,128,0.3)] transition-all duration-300 cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
