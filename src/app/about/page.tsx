import Link from "next/link";
import Button from "@/components/Button";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="flex-1 bg-studio-bg pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
            Our Story
          </span>
          <h1 className="mt-4 heading-serif-hero text-primary uppercase">
            We build attention.
          </h1>
          <p className="mt-6 text-base md:text-lg text-studio-muted font-normal max-w-xl">
            Delhi Diaries Official is a social-first creative studio based in New Delhi. We help restaurants, cafes, hospitality, lifestyle, and D2C brands grow through high-end Instagram content and strategies.
          </p>
        </div>

        {/* Narrative & Image layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="heading-serif-section text-primary uppercase">
              Not your typical marketing agency.
            </h2>
            <p className="text-sm md:text-base text-studio-muted leading-relaxed font-normal">
              Most digital agencies treat Instagram like a bulletin board. They design dry, templated flyers and talk in corporate buzzwords. But consumers don't open Instagram to read ads. They open it to find escape, aesthetic inspiration, and connection.
            </p>
            <p className="text-sm md:text-base text-studio-muted leading-relaxed font-normal">
              We started Delhi Diaries Official to rewrite the rules. We merge the high art direction of a luxury editorial magazine with the speed and hooks native to social media platforms. We capture authentic textures—the steam rising from fresh modern Indian dining plates, the pour of morning latte art, the shadows across organic ceramic home decor.
            </p>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/5] bg-studio-accent overflow-hidden">
            <Image
              src="/images/project_lifestyle.png"
              alt="Delhi Diaries Official studio composition"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* Principles segment */}
        <div className="border-t border-primary/10 pt-20">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
              Our Principles
            </span>
            <h2 className="mt-4 heading-serif-section text-primary uppercase">
              What we stand for.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { num: "01", title: "Visual Desirability", desc: "Every piece of content we produce must look premium and desirable. We want viewers to stop scrolling because the visual textures look expensive." },
              { num: "02", title: "Social Native Formats", desc: "No cookie-cutter stock videos. We shoot reels using transitions, timings, and trend hooks that feel native to user feeds." },
              { num: "03", title: "On-Ground Commitment", desc: "We are physically on the ground. We visit our partners, bring the equipment, direct the shoot, and translate real-world experiences into stories." }
            ].map((p, idx) => (
              <div key={idx} className="border-t border-primary/10 pt-8">
                <span className="font-serif text-xl font-bold text-primary/30">{p.num}</span>
                <h3 className="font-serif text-lg font-bold text-primary uppercase mt-4">{p.title}</h3>
                <p className="text-xs text-studio-muted leading-relaxed font-normal mt-2">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 border-t border-primary/10 pt-16 flex flex-col items-center text-center">
          <h3 className="heading-serif-section text-primary uppercase max-w-xl">
            Want to partner with us?
          </h3>
          <Link href="/contact" className="mt-8">
            <Button variant="primary">Start a Project →</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
