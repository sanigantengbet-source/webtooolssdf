"use client";

import { useEffect, useState, useRef } from "react";

const locations = [
  { city: "Jakarta", region: "Southeast Asia", latency: "8ms" },
  { city: "Singapore", region: "Asia Central", latency: "16ms" },
  { city: "Tokyo", region: "East Asia", latency: "42ms" },
  { city: "Frankfurt", region: "Europe West", latency: "135ms" },
  { city: "San Francisco", region: "US West", latency: "145ms" },
  { city: "Sydney", region: "Oceania", latency: "95ms" },
];

export function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeLocation, setActiveLocation] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLocation((prev) => (prev + 1) % locations.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden border-t border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-muted-foreground mb-6 uppercase tracking-wider">
              <span className="w-8 h-px bg-foreground/30" />
              Global Reach & Performance
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight mb-6">
              Accessible
              <br />
              worldwide.
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
              Optimized for fast client loading with edge caching, automated
              Supabase synchronization, and distributed cloud hosting.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 sm:gap-8">
              <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-display mb-1">
                  100%
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Free Access
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-display mb-1">
                  99.9%
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  System Uptime
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-display mb-1">
                  &lt;30ms
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Regional Latency
                </div>
              </div>
            </div>
          </div>

          {/* Right: Location list */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10 rounded-lg overflow-hidden bg-background">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between bg-foreground/[0.02]">
                <span className="text-sm font-mono text-muted-foreground">
                  Edge Availability
                </span>
              </div>

              {/* Locations */}
              <div>
                {locations.map((location, index) => (
                  <div
                    key={location.city}
                    className={`px-6 py-4 sm:py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${
                      activeLocation === index ? "bg-foreground/[0.03]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                          activeLocation === index
                            ? "bg-foreground scale-110"
                            : "bg-foreground/20"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-sm sm:text-base text-foreground">
                          {location.city}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {location.region}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs sm:text-sm text-muted-foreground">
                      {location.latency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
