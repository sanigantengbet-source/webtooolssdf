"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    number: "01",
    title: "Curated Web Utilities",
    description:
      "Handpicked collection of online converters, code helpers, scrapers, and digital utilities running at edge speeds.",
    visual: "deploy",
  },
  {
    number: "02",
    title: "AI & Smart Automation",
    description:
      "Modern utilities equipped with AI endpoints and automated data transformers built to simplify repetitive digital tasks.",
    visual: "ai",
  },
  {
    number: "03",
    title: "Community Collaboration",
    description:
      "Built collaboratively with the SANN404 FORUM GROUP. Open community suggestions, constant updates, and real-time status tracking.",
    visual: "collab",
  },
  {
    number: "04",
    title: "Verified & Secure",
    description:
      "Strict curation and security standards. Clear documentation, privacy-focused links, and zero hidden telemetry.",
    visual: "security",
  },
];

function DeployVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <defs>
        <clipPath id="deployClip">
          <rect x="30" y="20" width="140" height="120" rx="4" />
        </clipPath>
      </defs>

      {/* Container */}
      <rect
        x="30"
        y="20"
        width="140"
        height="120"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Animated bars */}
      <g clipPath="url(#deployClip)">
        <line
          x1="30"
          y1="50"
          x2="170"
          y2="50"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="30"
          y1="80"
          x2="170"
          y2="80"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="30"
          y1="110"
          x2="170"
          y2="110"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />

        <rect x="40" y="30" width="30" height="12" rx="2" fill="currentColor">
          <animate
            attributeName="width"
            values="30;60;30"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="40" y="60" width="80" height="12" rx="2" fill="currentColor">
          <animate
            attributeName="width"
            values="80;40;80"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="40" y="90" width="50" height="12" rx="2" fill="currentColor">
          <animate
            attributeName="width"
            values="50;90;50"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="40" y="120" width="70" height="12" rx="2" fill="currentColor">
          <animate
            attributeName="width"
            values="70;30;70"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
      </g>

      {/* Live dot */}
      <circle cx="155" cy="35" r="4" fill="currentColor">
        <animate
          attributeName="opacity"
          values="1;0.2;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

const AI_ORBIT_NODES = [
  { x: 150, y: 80 },
  { x: 125, y: 123.3 },
  { x: 75, y: 123.3 },
  { x: 50, y: 80 },
  { x: 75, y: 36.7 },
  { x: 125, y: 36.7 },
];

function AIVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Central brain node */}
      <circle
        cx="100"
        cy="80"
        r="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="100" cy="80" r="8" fill="currentColor">
        <animate
          attributeName="r"
          values="6;10;6"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Orbiting nodes */}
      {AI_ORBIT_NODES.map((node, i) => (
        <g key={i}>
          <line
            x1="100"
            y1="80"
            x2={node.x}
            y2={node.y}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur="2s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </line>
          <circle
            cx={node.x}
            cy={node.y}
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <animate
              attributeName="r"
              values="6;8;6"
              dur="2s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* Pulse rings */}
      <circle
        cx="100"
        cy="80"
        r="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0"
      >
        <animate
          attributeName="r"
          values="20;60"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

function CollabVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* User A */}
      <g>
        <rect
          x="30"
          y="50"
          width="50"
          height="60"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="55"
          y="85"
          textAnchor="middle"
          fontSize="20"
          fontFamily="monospace"
          fill="currentColor"
        >
          S
        </text>
        <circle
          cx="55"
          cy="35"
          r="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>

      {/* User B */}
      <g>
        <rect
          x="120"
          y="50"
          width="50"
          height="60"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="145"
          y="85"
          textAnchor="middle"
          fontSize="20"
          fontFamily="monospace"
          fill="currentColor"
        >
          4
        </text>
        <circle
          cx="145"
          cy="35"
          r="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>

      {/* Connection */}
      <line
        x1="80"
        y1="80"
        x2="120"
        y2="80"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-8"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </line>

      {/* Data packet */}
      <circle r="4" fill="currentColor">
        <animateMotion dur="1.5s" repeatCount="indefinite">
          <mpath href="#dataPath" />
        </animateMotion>
      </circle>
      <path id="dataPath" d="M 80 80 L 120 80" fill="none" />

      {/* Sync indicator */}
      <g transform="translate(100, 130)">
        <circle r="6" fill="none" stroke="currentColor" strokeWidth="2">
          <animate
            attributeName="r"
            values="6;10;6"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}

function SecurityVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Shield */}
      <path
        d="M 100 20 L 150 40 L 150 90 Q 150 130 100 145 Q 50 130 50 90 L 50 40 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Inner shield */}
      <path
        d="M 100 35 L 135 50 L 135 85 Q 135 115 100 128 Q 65 115 65 85 L 65 50 Z"
        fill="currentColor"
        opacity="0.1"
      >
        <animate
          attributeName="opacity"
          values="0.1;0.2;0.1"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

      {/* Lock icon */}
      <rect x="85" y="70" width="30" height="25" rx="3" fill="currentColor" />
      <path
        d="M 90 70 L 90 60 Q 90 50 100 50 Q 110 50 110 60 L 110 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Keyhole */}
      <circle cx="100" cy="80" r="4" fill="white" />
      <rect x="98" y="82" width="4" height="8" fill="white" />
    </svg>
  );
}

function AnimatedVisual({ type }: { type: string }) {
  switch (type) {
    case "deploy":
      return <DeployVisual />;
    case "ai":
      return <AIVisual />;
    case "collab":
      return <CollabVisual />;
    case "security":
      return <SecurityVisual />;
    default:
      return <DeployVisual />;
  }
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-10 lg:py-16 border-b border-foreground/10">
        {/* Number */}
        <div className="shrink-0">
          <span className="font-mono text-sm text-muted-foreground">
            {feature.number}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display mb-3 group-hover:translate-x-2 transition-transform duration-500">
              {feature.title}
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-48 h-36 text-foreground">
              <AnimatedVisual type={feature.visual} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
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

  return (
    <section id="features" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-14 lg:mb-20">
          <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-muted-foreground mb-4 uppercase tracking-wider">
            <span className="w-8 h-px bg-foreground/30" />
            Capabilities & Focus
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Built for productivity.
            <br />
            <span className="text-muted-foreground">
              Everything in one curated space.
            </span>
          </h2>
        </div>

        {/* Features List */}
        <div>
          {features.map((feature, index) => (
            <FeatureCard key={feature.number} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
