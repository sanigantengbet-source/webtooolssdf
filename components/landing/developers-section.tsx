"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";

const codeExamples = [
  {
    label: "Fetch Tools",
    code: `// Fetch all verified tools
const res = await fetch('https://tools.sann404.com/api/tools');
const { data: tools } = await res.json();
console.log('Loaded:', tools.length, 'tools');`,
  },
  {
    label: "Categories",
    code: `// Retrieve categories with counts
const res = await fetch('https://tools.sann404.com/api/categories');
const categories = await res.json();
console.log('Categories:', categories.map(c => c.name));`,
  },
  {
    label: "Realtime",
    code: `// Subscribe to realtime database events
const channel = supabase
  .channel('public:tools')
  .on('postgres_changes', { event: '*', table: 'tools' }, (payload) => {
    console.log('Live tool update:', payload.new);
  })
  .subscribe();`,
  },
];

const features = [
  {
    title: "Open REST APIs",
    description: "Structured JSON endpoints for programmatic tool retrieval.",
  },
  {
    title: "Realtime Supabase Sync",
    description: "Changes made in admin instantly broadcast to public view.",
  },
  {
    title: "TypeScript Safety",
    description: "Strict typed models for tools, categories, tags, and audit logs.",
  },
  {
    title: "Community Driven",
    description: "Backed by the SANN404 FORUM GROUP developer collective.",
  },
];

export function DevelopersSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      id="developers"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden border-t border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
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
              For Developers & Tinkerers
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight mb-6">
              Built by devs.
              <br />
              <span className="text-muted-foreground">For builders.</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Whether you are looking for ready-to-use tools or integrating our
              directory into your own dashboards, our data APIs are built cleanly.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 50 + 200}ms` }}
                >
                  <h3 className="font-medium text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Code block */}
          <div
            className={`lg:sticky lg:top-32 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10 rounded-lg overflow-hidden bg-background">
              {/* Tabs */}
              <div className="flex items-center border-b border-foreground/10 bg-foreground/[0.02]">
                {codeExamples.map((example, idx) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-mono transition-colors relative cursor-pointer ${
                      activeTab === idx
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {example.label}
                    {activeTab === idx && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                    )}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Code content */}
              <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm bg-foreground/[0.01] min-h-[200px]">
                <pre className="text-foreground/90 overflow-x-auto leading-relaxed">
                  {codeExamples[activeTab].code}
                </pre>
              </div>
            </div>

            {/* Links */}
            <div className="mt-6 flex items-center gap-6 text-sm">
              <Link
                href="/credits"
                className="text-foreground hover:underline underline-offset-4"
              >
                Team Credits
              </Link>
              <span className="text-foreground/20">|</span>
              <a
                href="https://github.com/sannnproject"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub Profile
              </a>
              <span className="text-foreground/20">|</span>
              <a
                href="https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                WhatsApp Channel
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
