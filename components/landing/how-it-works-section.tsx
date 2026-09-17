"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "I",
    title: "Browse & Search",
    description:
      "Find exactly what you need with instant real-time search, category filtering, and featured project badges.",
    code: `// Search across tools collection
const results = await collection.search({
  query: 'downloader',
  category: 'media',
  status: 'active'
})`,
  },
  {
    number: "II",
    title: "Launch & Use Instantly",
    description:
      "Direct access to live tool interfaces, API documentation, and source code with zero setup barriers.",
    code: `// Direct tool access & integration
const tool = await collection.get('media-downloader')
console.log('Online at:', tool.website_url)
console.log('Source:', tool.github_url)`,
  },
  {
    number: "III",
    title: "Community Collaboration",
    description:
      "Suggest new tools, submit pull requests, and contribute to the SANN404 FORUM GROUP ecosystem.",
    code: `// Community contribution workflow
community.submitTool({
  name: 'New Developer Utility',
  submittedBy: '@sann404_contributor',
  verified: true
})`,
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-foreground text-background overflow-hidden"
    >
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            currentColor 40px,
            currentColor 41px
          )`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-14 lg:mb-20">
          <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-background/50 mb-4 uppercase tracking-wider">
            <span className="w-8 h-px bg-background/30" />
            Simple Process
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Three steps.
            <br />
            <span className="text-background/50">Zero friction.</span>
          </h2>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Steps */}
          <div className="space-y-0">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-full text-left py-7 border-b border-background/10 transition-all duration-500 group cursor-pointer ${
                  activeStep === index
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-75"
                }`}
              >
                <div className="flex items-start gap-6">
                  <span className="font-display text-2xl sm:text-3xl text-background/30">
                    {step.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-display mb-2 group-hover:translate-x-2 transition-transform duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-background/60 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Progress indicator */}
                    {activeStep === index && (
                      <div className="mt-4 h-px bg-background/20 overflow-hidden">
                        <div
                          className="h-full bg-background w-0"
                          style={{
                            animation: "progress 5s linear forwards",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Code display */}
          <div className="lg:sticky lg:top-32 self-start">
            <div className="border border-background/10 overflow-hidden rounded-lg">
              {/* Window header */}
              <div className="px-6 py-4 border-b border-background/10 flex items-center justify-between bg-background/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                </div>
                <span className="text-xs font-mono text-background/40">
                  collection.ts
                </span>
              </div>

              {/* Code content */}
              <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm min-h-[260px] bg-background/[0.02]">
                <pre className="text-background/80 overflow-x-auto">
                  {steps[activeStep].code.split("\n").map((line, lineIndex) => (
                    <div
                      key={`${activeStep}-${lineIndex}`}
                      className="leading-loose"
                    >
                      <span className="text-background/20 select-none w-8 inline-block">
                        {lineIndex + 1}
                      </span>
                      <span className="text-background/90">{line}</span>
                    </div>
                  ))}
                </pre>
              </div>

              {/* Status */}
              <div className="px-6 py-3.5 border-t border-background/10 flex items-center justify-between text-xs font-mono text-background/40 bg-background/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Realtime Supabase Sync</span>
                </div>
                <span>SANN404 API v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
