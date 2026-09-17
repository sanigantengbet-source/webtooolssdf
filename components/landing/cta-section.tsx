"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedTetrahedron } from "./animated-tetrahedron";

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative py-28 lg:py-44 overflow-hidden border-t border-foreground/10"
    >
      {/* Interactive mouse spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(120, 120, 120, 0.1), transparent 40%)`,
        }}
      />

      {/* 3D Tetrahedron animation */}
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] lg:w-[700px] lg:h-[700px] opacity-25 pointer-events-none">
        <AnimatedTetrahedron />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div
            className={`mb-6 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-muted-foreground uppercase tracking-wider">
              <span className="w-8 h-px bg-foreground/30" />
              START EXPLORING TODAY
            </span>
          </div>

          {/* Headline */}
          <h2
            className={`text-4xl sm:text-5xl lg:text-7xl font-display tracking-tight leading-[1] mb-8 transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Ready to explore
            <br />
            the collection?
          </h2>

          {/* Description */}
          <p
            className={`text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Search, filter, and launch dozens of handpicked developer utilities,
            online converters, and community tools in seconds.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              asChild
              size="lg"
              className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group cursor-pointer"
            >
              <Link href="/tools" className="flex items-center justify-center">
                <span>Explore Tools Now</span>
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
                <span>View Community Credits</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
