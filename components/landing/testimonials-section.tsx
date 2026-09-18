"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    quote:
      "SANN404 Tool Collection saves hours of hunting across GitHub and random forums. Everything is curated and instantly accessible.",
    author: "Valora Official",
    role: "Community Member",
    company: "SANN404 FORUM GROUP",
    metric: "10x Faster Discovery",
  },
  {
    quote:
      "The fast filtering and clean preview modals make finding tools effortless. Proud to see this collection grow.",
    author: "Iqbal",
    role: "Open Source Enthusiast",
    company: "Forum Contributor",
    metric: "Daily Developer Tool",
  },
  {
    quote:
      "Having a trusted, community-managed directory with zero ads and direct links is invaluable for modern tinkerers.",
    author: "Kuzuruken",
    role: "Active Contributor",
    company: "SANN404 Tech",
    metric: "100% Free & Open",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="relative py-24 lg:py-36 border-t border-foreground/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Community Voices
          </span>
          <div className="flex-1 h-px bg-foreground/10" />
          <span className="font-mono text-xs text-muted-foreground">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>

        {/* Main Quote */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8">
            <blockquote
              className={`transition-all duration-300 ${
                isAnimating
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <p className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-foreground">
                &ldquo;{activeTestimonial.quote}&rdquo;
              </p>
            </blockquote>

            {/* Author */}
            <div
              className={`mt-10 sm:mt-12 flex items-center gap-5 transition-all duration-300 delay-100 ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                <span className="font-display text-xl text-foreground">
                  {activeTestimonial.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-base sm:text-lg font-medium text-foreground">
                  {activeTestimonial.author}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {activeTestimonial.role} &middot; {activeTestimonial.company}
                </p>
              </div>
            </div>
          </div>

          {/* Metric Highlight */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div
              className={`p-6 sm:p-8 border border-foreground/10 rounded-lg bg-background transition-all duration-300 ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase block mb-3">
                Highlight
              </span>
              <p className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">
                {activeTestimonial.metric}
              </p>
            </div>

            {/* Navigation Dots */}
            <div className="flex gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setActiveIndex(idx);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "w-8 bg-foreground"
                      : "w-2 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Community Banner */}
        <div className="mt-20 pt-10 border-t border-foreground/10">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-6 text-center">
            Supported by SANN404 FORUM GROUP projects & ecosystem
          </p>
        </div>
      </div>

      {/* Marquee running text outside container */}
      <div className="w-full relative overflow-hidden py-4 border-t border-b border-foreground/5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max items-center marquee hover:[animation-play-state:paused] whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div
              key={setIdx}
              className="flex shrink-0 items-center gap-10 sm:gap-14 pr-10 sm:pr-14"
              aria-hidden={setIdx > 0 ? "true" : undefined}
            >
              {[
                "SANN404 FORUMS",
                "WEB TOOLS",
                "AUTOMATION BOT",
                "DEV UTILITIES",
                "COMMUNITY REPOS",
                "OPEN ACCESS",
                "SYSTEM SCRIPTS",
              ].map((item) => (
                <div key={`${setIdx}-${item}`} className="flex items-center gap-10 sm:gap-14">
                  <span className="font-mono text-xs sm:text-sm tracking-widest uppercase font-semibold text-foreground/45 hover:text-foreground transition-colors duration-200">
                    {item}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 shrink-0" aria-hidden="true" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
