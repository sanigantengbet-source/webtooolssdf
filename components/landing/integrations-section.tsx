"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import LogoLoop, { LogoItem } from "@/components/ui/logo-loop";

// Authentic Official Logos
function NextjsLogo() {
  return (
    <svg viewBox="0 0 180 180" className="w-6 h-6" fill="none">
      <circle cx="90" cy="90" r="90" className="fill-black dark:fill-white" />
      <path
        d="M149.508 157.438L69.147 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
        className="fill-white dark:fill-black"
      />
      <rect x="115" y="54" width="12" height="72" className="fill-white dark:fill-black" />
    </svg>
  );
}

function TailwindLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path
        d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
        fill="#38BDF8"
      />
    </svg>
  );
}

function ReactLogo() {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-6 h-6" fill="none">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function JavaScriptLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <rect width="24" height="24" rx="4" fill="#F7DF1E" />
      <path
        d="M16.5 17.5c.8 0 1.5-.4 1.8-1.1.2-.5.1-1.3-.3-1.6-.7-.5-1.9-.7-2.7-1.1-.6-.3-.9-.7-.9-1.2 0-.8.7-1.4 1.7-1.4.7 0 1.3.3 1.6.8l.9-.6c-.5-.7-1.4-1.1-2.5-1.1-1.6 0-2.8 1-2.8 2.4 0 .9.5 1.6 1.4 2 .8.4 1.8.6 2.5 1 .4.2.6.5.6.9 0 .7-.6 1.2-1.5 1.2-.9 0-1.6-.4-2-.9l-1 .6c.6 1 1.7 1.5 3 1.5zm-6.2 0V9.8H8.8v5.5c0 1.1-.4 1.5-1.3 1.5-.4 0-.8-.1-1.1-.2l-.3.9c.4.2.9.3 1.5.3 1.7 0 2.7-.8 2.7-2.3z"
        fill="#000000"
      />
    </svg>
  );
}

function TypeScriptLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <path
        d="M13.8 14.5c.3.5.8.8 1.4.8.7 0 1.2-.4 1.2-1 0-.6-.4-.9-1.2-1.3-.9-.4-2-.9-2-2.1 0-1.2 1-2.1 2.5-2.1 1 0 1.8.4 2.2 1.1l-.9.6c-.3-.5-.7-.7-1.3-.7-.7 0-1.2.4-1.2.9 0 .5.3.8 1.1 1.2 1 .5 2.1.9 2.1 2.2 0 1.4-1.1 2.2-2.6 2.2-1.2 0-2.1-.5-2.6-1.4l.7-.8zm-2.8-5.6h-4v1.2h1.3v6.7h1.4v-6.7h1.3V8.9z"
        fill="#ffffff"
      />
    </svg>
  );
}

function SupabaseLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path
        d="M13.35 2.11a1 1 0 0 0-1.67.73v7.41H3.5a1 1 0 0 0-.78 1.63l9.15 11a1 1 0 0 0 1.67-.73v-7.41h8.18a1 1 0 0 0 .78-1.63l-9.15-11Z"
        fill="#3ECF8E"
      />
    </svg>
  );
}

function SqlLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <ellipse cx="12" cy="5" rx="8" ry="2.5" fill="#0284C7" />
      <path d="M4 5v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V5" stroke="#0284C7" strokeWidth="2" />
      <path d="M4 10v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-5" stroke="#0284C7" strokeWidth="2" />
      <path d="M4 15v4c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-4" stroke="#0284C7" strokeWidth="2" />
      <path d="M11 9l-2 3h4l-2 3" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VercelLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 text-foreground" fill="currentColor">
      <path d="M12 2L24 22H0L12 2Z" />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 text-foreground" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function NodeLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#5FA04E">
      <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339c.082.045.197.045.272 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.192-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68c-.085.049-.139.145-.139.241v10.15c0 .097.054.189.139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675c-.57-.329-.922-.945-.922-1.604V6.921c0-.659.353-1.275.922-1.603l8.795-5.082c.557-.315 1.296-.315 1.848 0l8.794 5.082c.57.329.924.944.924 1.603v10.15c0 .659-.354 1.273-.924 1.604l-8.794 5.078c-.279.162-.598.246-.924.246zM19.099 13.993c0-1.9-1.284-2.406-3.987-2.763-2.731-.361-3.009-.548-3.009-1.187 0-.528.235-1.233 2.258-1.233 1.807 0 2.473.389 2.747 1.607.024.115.129.199.247.199h1.141c.071 0 .138-.031.186-.081.048-.054.074-.123.067-.196-.177-2.098-1.571-3.076-4.388-3.076-2.508 0-4.004 1.058-4.004 2.833 0 1.925 1.488 2.457 3.895 2.695 2.88.282 3.103.703 3.103 1.269 0 .983-.789 1.402-2.642 1.402-2.327 0-2.839-.584-3.011-1.742-.02-.124-.126-.215-.253-.215h-1.137c-.141 0-.254.112-.254.253 0 1.482.806 3.248 4.655 3.248 2.548 0 4.146-1.097 4.146-3.014z" />
    </svg>
  );
}

function RedisLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path d="M12 2L3 6.5v11L12 22l9-4.5v-11L12 2z" fill="#DC382D" />
      <path d="M12 2.5L4.5 6.2v9.6L12 19.5l7.5-3.7V6.2L12 2.5z" fill="#A81F17" />
      <path d="M12 4.5l5.5 2.7-5.5 2.8L6.5 7.2 12 4.5z" fill="#EA4435" />
      <circle cx="12" cy="7.2" r="1" fill="#ffffff" />
      <circle cx="9.5" cy="12.5" r="0.9" fill="#ffffff" />
      <circle cx="14.5" cy="12.5" r="0.9" fill="#ffffff" />
    </svg>
  );
}

function GraphqlLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path
        d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 2.31L4.84 8.44v7.12L12 19.69l7.16-4.13V8.44L12 4.31z"
        fill="#E10098"
      />
      <circle cx="12" cy="2" r="1.5" fill="#E10098" />
      <circle cx="20.66" cy="7" r="1.5" fill="#E10098" />
      <circle cx="20.66" cy="17" r="1.5" fill="#E10098" />
      <circle cx="12" cy="22" r="1.5" fill="#E10098" />
      <circle cx="3.34" cy="17" r="1.5" fill="#E10098" />
      <circle cx="3.34" cy="7" r="1.5" fill="#E10098" />
    </svg>
  );
}

interface TechCardItem {
  name: string;
  category: string;
  icon: React.ReactNode;
}

const row1Items: TechCardItem[] = [
  { name: "Next.js", category: "Fullstack Framework", icon: <NextjsLogo /> },
  { name: "React", category: "Component UI", icon: <ReactLogo /> },
  { name: "Tailwind CSS", category: "Utility Styling", icon: <TailwindLogo /> },
  { name: "TypeScript", category: "Type Safety", icon: <TypeScriptLogo /> },
  { name: "Supabase", category: "PostgreSQL & Auth", icon: <SupabaseLogo /> },
  { name: "SQL", category: "Database Queries", icon: <SqlLogo /> },
];

const row2Items: TechCardItem[] = [
  { name: "JavaScript", category: "Core Language", icon: <JavaScriptLogo /> },
  { name: "Node.js", category: "Runtime Engine", icon: <NodeLogo /> },
  { name: "GitHub", category: "Version Control", icon: <GitHubLogo /> },
  { name: "Vercel", category: "Cloud Deployment", icon: <VercelLogo /> },
  { name: "Redis", category: "In-Memory Cache", icon: <RedisLogo /> },
  { name: "GraphQL", category: "API Architecture", icon: <GraphqlLogo /> },
];

const createLogoItems = (items: TechCardItem[]): LogoItem[] =>
  items.map((item) => ({
    title: item.name,
    ariaLabel: `${item.name} - ${item.category}`,
    node: (
      <div className="flex items-center gap-4 px-6 py-4 rounded-xl border border-foreground/10 bg-background/80 hover:border-foreground/30 hover:bg-foreground/[0.04] transition-all duration-200 select-none shadow-xs group cursor-default">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-foreground/[0.04] border border-foreground/10 group-hover:scale-110 transition-transform duration-200">
          {item.icon}
        </div>
        <div className="text-left">
          <div className="text-sm sm:text-base font-semibold tracking-tight text-foreground whitespace-nowrap">
            {item.name}
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {item.category}
          </div>
        </div>
      </div>
    ),
  }));

export function IntegrationsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const row1Logos = useMemo(() => createLogoItems(row1Items), []);
  const row2Logos = useMemo(() => createLogoItems(row2Items), []);

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
      id="integrations"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-muted-foreground mb-4 uppercase tracking-wider">
            <span className="w-8 h-px bg-foreground/30" />
            Ecosystem & Stack
            <span className="w-8 h-px bg-foreground/30" />
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight mb-4">
            Connected to the
            <br />
            technologies you rely on.
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground">
            Built with modern web standards, open-source APIs, and community-driven
            integrations.
          </p>
        </div>
      </div>

      {/* Smooth Continuous LogoLoop with Authentic Logos */}
      <div className="space-y-6 w-full overflow-hidden">
        {/* Row 1: Leftward loop with pause-on-hover & edge fade */}
        <LogoLoop
          logos={row1Logos}
          speed={35}
          direction="left"
          gap={24}
          logoHeight={56}
          pauseOnHover={true}
          fadeOut={true}
          ariaLabel="Primary ecosystem technologies"
        />

        {/* Row 2: Rightward loop with pause-on-hover & edge fade */}
        <LogoLoop
          logos={row2Logos}
          speed={35}
          direction="right"
          gap={24}
          logoHeight={56}
          pauseOnHover={true}
          fadeOut={true}
          ariaLabel="Secondary ecosystem technologies"
        />
      </div>
    </section>
  );
}
