import ServiceCard from "@/components/ServiceCard";
import { services } from "@/data/services";
import Link from "next/link";
import Button from "@/components/Button";

export default function ServicesPage() {
  return (
    <main className="flex-1 bg-studio-bg pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
            Our Offerings
          </span>
          <h1 className="mt-4 heading-serif-hero text-primary uppercase">
            From one reel to an entire digital presence.
          </h1>
          <p className="mt-6 text-base md:text-lg text-studio-muted font-normal max-w-xl">
            We operate as a full-service creative partner. We show up at your venue, craft the strategy, shoot the content, and manage your community.
          </p>
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* How We Shoot Section */}
        <div className="border-t border-primary/10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
                On-Ground Shoots
              </span>
              <h2 className="mt-4 heading-serif-section text-primary uppercase">
                We show up and create.
              </h2>
              <p className="mt-6 text-sm md:text-base text-studio-muted leading-relaxed font-normal">
                Unlike agencies that work with generic stock footage or require you to capture your own clips, we handle everything on-ground. Our team visits your restaurant, cafe, boutique, or office in Delhi NCR once or twice a month with high-end camera rigs and lighting setups.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-8">
              {[
                { title: "Monthly Production Days", desc: "A structured, pre-planned shooting day covering menu item reveals, interior design angles, customer experiences, and staff highlights." },
                { title: "Quick-turn Reels Capture", desc: "Filming designed specifically to align with current trending audios and transition challenges on Instagram." },
                { title: "UGC & Authentic Capture", desc: "Short, raw-style mobile vertical video shoots that blend naturally into user feeds and drive higher shares." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 border-b border-primary/5 pb-6 last:border-0 last:pb-0">
                  <span className="font-serif text-xl font-bold text-primary/30">0{idx + 1}</span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-primary uppercase">{item.title}</h3>
                    <p className="text-xs text-studio-muted leading-relaxed font-normal mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-24 border-t border-primary/10 pt-16 flex flex-col items-center text-center">
          <h3 className="font-serif text-2xl md:text-4xl font-bold uppercase text-primary max-w-xl">
            Ready to give your brand a premium visual language?
          </h3>
          <Link href="/contact" className="mt-8">
            <Button variant="primary">Start a Project →</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
