"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedSphere } from "./animated-sphere";

const words = ["explore", "discover", "launch", "automate", "build"];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 20);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-20 sm:pt-24 lg:pt-24">
      {/* Animated sphere background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[450px] sm:w-[550px] sm:h-[550px] lg:w-[720px] lg:h-[720px] opacity-40 pointer-events-none">
        <AnimatedSphere />
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/15"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/15"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-6 pb-10 sm:pt-10 sm:pb-14 lg:pt-10 lg:pb-16">
        {/* Eyebrow */}
        <div
          className={`mb-5 lg:mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-muted-foreground uppercase tracking-wider">
            <span className="w-8 h-px bg-foreground/30" />
            SANN404 FORUM GROUP · CURATED TOOL DIRECTORY
          </span>
        </div>

        {/* Main headline */}
        <div className="mb-6 lg:mb-8">
          <h1
            className={`text-[clamp(2.75rem,8vw,7.5rem)] font-display leading-[0.95] tracking-tight transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block">The collection</span>
            <span className="block">
              to{" "}
              <span className="relative inline-block">
                <span key={wordIndex} className="inline-flex">
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in"
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-foreground/10" />
              </span>
            </span>
          </h1>
        </div>

        {/* Description */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-20 items-end">
          <p
            className={`text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            A centralized hub of hand-crafted web tools, utilities, automation
            resources, and projects built to empower modern developers and digital
            explorers.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              asChild
              size="lg"
              className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group cursor-pointer"
            >
              <Link href="/tools" className="flex items-center justify-center">
                <span>Explore All Tools</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5 cursor-pointer"
            >
              <Link href="/credits" className="flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                <span>Meet the Team</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats marquee */}
      <div
        className={`mt-6 sm:mt-10 lg:mt-12 w-full border-t border-foreground/10 py-5 overflow-hidden transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-16 marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 items-baseline">
              {[
                { value: "100%", label: "free & accessible", company: "COMMUNITY" },
                { value: "Instant", label: "web-based utilities", company: "OPTIMIZED" },
                { value: "Curated", label: "checked for safety", company: "VERIFIED" },
                { value: "24/7", label: "always operational", company: "GLOBAL" },
                { value: "SANN404", label: "collaborative forum", company: "ECOSYSTEM" },
              ].map((stat) => (
                <div
                  key={`${stat.company}-${i}`}
                  className="flex items-baseline gap-4"
                >
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-display">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                    <span className="block font-mono text-[10px] sm:text-xs mt-0.5 tracking-wider text-foreground/70">
                      {stat.company}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
