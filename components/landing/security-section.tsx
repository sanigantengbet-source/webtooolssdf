"use client";

import { useEffect, useState, useRef } from "react";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "Vetted & Verified Tools",
    description:
      "All featured external tools are manually audited to ensure stability, safety, and no malicious redirects.",
  },
  {
    icon: Lock,
    title: "HTTPS & Safe Links",
    description:
      "Forced HTTPS encryption and secure external routing with strict referrer protection.",
  },
  {
    icon: Eye,
    title: "Privacy-Conscious",
    description:
      "Zero invasive user tracking or unnecessary data hoarding. Fast and private tool usage.",
  },
  {
    icon: FileCheck,
    title: "Admin Audit Logging",
    description:
      "Every tool addition, modification, and status change is logged into a tamper-proof audit trail.",
  },
];

const certifications = ["SSL ENCRYPTED", "VERIFIED REPOS", "AUDIT LOGGED", "OPEN COMMUNITY", "ZERO ADS"];

export function SecuritySection() {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section
      id="security"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-foreground/[0.02] overflow-hidden border-t border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-muted-foreground mb-6 uppercase tracking-wider">
              <span className="w-8 h-px bg-foreground/30" />
              Safety & Verification
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight mb-6">
              Safe tools.
              <br />
              Zero compromises.
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
              We curate tools that respect user security. Clean interfaces, vetted
              origins, and transparent information for every project listed.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2.5">
              {certifications.map((cert, index) => (
                <span
                  key={cert}
                  className={`px-3.5 py-1.5 border border-foreground/10 text-xs font-mono rounded-md transition-all duration-500 bg-background ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 50 + 200}ms` }}
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Features */}
          <div className="grid gap-4 sm:gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`p-6 border border-foreground/10 rounded-lg hover:border-foreground/30 transition-all duration-500 bg-background group ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-1 group-hover:translate-x-1 transition-transform duration-300 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
