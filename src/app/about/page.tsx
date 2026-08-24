import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex-1 bg-gradient-to-b from-[#FAF8F5] via-[#FFFFFF] to-[#FAF8F5] pt-25 pb-24 max-sm:pb-10 md:pt-30 md:pb-32 relative overflow-hidden">
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
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0A1628]">Our Story</span>
            </div>
          </div>
          <h1 className="heading-serif-hero text-[#0A1628] uppercase tracking-tight">
            We build <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#91724B] via-[#C5A880] to-[#91724B] drop-shadow-[0_2px_15px_rgba(197,168,128,0.25)]">
              attention.
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-[#0A1628]/70 font-medium max-w-2xl leading-relaxed">
            Social Diaries Official is a social-first creative studio based in New Delhi. We help restaurants, cafes, hospitality, lifestyle, and D2C brands grow through high-end Instagram content and strategies.
          </p>
        </div>

        {/* Narrative & Visual layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-28 max-sm:mb-5 items-center text-left">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0A1628]">The Philosophy</span>
            </div>
            <h2 className="heading-serif-section text-[#0A1628] uppercase tracking-tight">
              Not your typical <br />
              <span className="bg-gradient-to-r from-[#0A1628] via-[#91724B] to-[#C5A880] bg-clip-text text-transparent">marketing agency.</span>
            </h2>
            <p className="text-sm md:text-base text-[#0A1628]/70 leading-relaxed font-normal">
              Most digital agencies treat Instagram like a bulletin board. They design dry, templated flyers and talk in corporate buzzwords. But consumers don't open Instagram to read ads. They open it to find escape, aesthetic inspiration, and connection.
            </p>
            <p className="text-sm md:text-base text-[#0A1628]/70 leading-relaxed font-normal">
              We started Social Diaries Official to rewrite the rules. We merge the high art direction of a luxury editorial magazine with the speed and hooks native to social media platforms. We capture authentic textures—the steam rising from fresh modern Indian dining plates, the pour of morning latte art, the shadows across organic ceramic home decor.
            </p>

            {/* Studio Pillars Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { title: "100% On-Ground", desc: "Real equipment & shoots in Delhi NCR" },
                { title: "Bespoke Art Direction", desc: "High-fashion color grading & pacing" },
                { title: "Social-First Hooks", desc: "Engineered for maximum reel shares" },
                { title: "Full-Service Partner", desc: "Strategy, shoot, edit & community" }
              ].map((pill, idx) => (
                <div key={idx} className="rounded-2xl border border-[#C5A880]/30 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0A1628]">
                    <span className="text-[#C5A880]">✦</span>
                    <span>{pill.title}</span>
                  </div>
                  <p className="text-[10px] text-[#0A1628]/60 mt-1 font-medium">{pill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/5] rounded-3xl border border-[#C5A880]/35 bg-[#0A1628] overflow-hidden shadow-2xl group">
            <Image
              src="/images/project_lifestyle.png"
              alt="Social Diaries Official studio composition"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/85 via-transparent to-transparent pointer-events-none" />
            
            {/* Top Floating Badge */}
            <div className="absolute top-5 left-5 z-20">
              <span className="bg-[#0A1628]/85 text-[#C5A880] border border-[#C5A880]/30 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">
                ✦ Studio Art Direction
              </span>
            </div>

            {/* Bottom Tag */}
            <div className="absolute bottom-5 left-5 right-5 z-20 text-left">
              <p className="font-serif text-sm font-bold text-white tracking-wide">Social Diaries Official</p>
              <p className="text-[10px] text-[#C5A880] uppercase tracking-wider mt-0.5">Crafted in New Delhi, India</p>
            </div>
          </div>
        </div>

        {/* Principles segment (Luxury Principle Cards) */}
        <div className="border-t border-[#C5A880]/20 pt-20 max-sm:pt-5">
          <div className="max-w-2xl mb-16 max-sm:mb-10 text-left">
            <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/40 px-4 py-1.5 rounded-full mb-3 backdrop-blur-md shadow-sm">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0A1628]">Our Principles</span>
            </div>
            <h2 className="mt-2 heading-serif-section text-[#0A1628] uppercase tracking-tight">
              What we <span className="bg-gradient-to-r from-[#0A1628] via-[#91724B] to-[#C5A880] bg-clip-text text-transparent">stand for.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { num: "01", icon: "🎯", tag: "Pure Aesthetics", title: "Visual Desirability", desc: "Every piece of content we produce must look premium and desirable. We want viewers to stop scrolling because the visual textures look expensive." },
              { num: "02", icon: "📱", tag: "Viral Retention", title: "Social Native Formats", desc: "No cookie-cutter stock videos. We shoot reels using transitions, timings, and trend hooks that feel native to user feeds." },
              { num: "03", icon: "🎥", tag: "Real Production", title: "On-Ground Commitment", desc: "We are physically on the ground. We visit our partners, bring the equipment, direct the shoot, and translate real-world experiences into stories." }
            ].map((p, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880] bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F1] to-[#F3ECE1] p-8 shadow-sm hover:shadow-[0_24px_50px_rgba(197,168,128,0.22)] transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col justify-between text-left"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A880] via-[#F3E5D0] to-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#0A1628] via-[#91724B] to-[#C5A880] leading-none">
                      {p.num}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#C5A880] bg-white/80 border border-[#C5A880]/30 px-3 py-1 rounded-full">{p.tag}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0A1628] uppercase group-hover:text-[#91724B] transition-colors">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-[#0A1628]/70 leading-relaxed font-normal mt-3">{p.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#C5A880]/20 flex items-center justify-between text-[11px] font-bold text-[#C5A880] uppercase tracking-wider">
                  <span>Social Diaries Standard</span>
                  <span>✦</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Luxury Midnight CTA banner */}
        <div className="mt-28 max-sm:mt-5 relative rounded-3xl border border-[#C5A880]/30 bg-gradient-to-b from-[#070F1B] via-[#0A1628] to-[#070F1B] p-10 md:p-16 text-center text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[#C5A880]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-[#C5A880]/35 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A880]">Join Our Roster</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
              Want to partner <br />
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F5E6D3] to-[#C5A880] bg-clip-text text-transparent">
                with our studio?
              </span>
            </h3>
            <p className="mt-4 text-xs sm:text-sm text-white/70 max-w-lg leading-relaxed">
              We collaborate with ambitious brands to transform their digital presence and drive measurable customer footfall.
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
