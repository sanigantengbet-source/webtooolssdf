"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
  badge?: string;
}

const footerLinks: Record<string, FooterLink[]> = {
  Directory: [
    { name: "All Tools", href: "/tools" },
    { name: "Categories", href: "/tools" },
    { name: "Featured Picks", href: "/tools" },
    { name: "Team Credits", href: "/credits" },
  ],
  Community: [
    {
      name: "WhatsApp Channel",
      href: "https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L",
      external: true,
    },
    {
      name: "GitHub",
      href: "https://github.com/sannnproject",
      external: true,
    },
    {
      name: "Saweria Donation",
      href: "https://saweria.co/sann404",
      external: true,
      badge: "Support",
    },
  ],
  Management: [
    { name: "Admin Portal", href: "/admin/login" },
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Audit Trail", href: "/admin/dashboard" },
  ],
};

const socialLinks = [
  {
    name: "WhatsApp",
    href: "https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L",
  },
  { name: "GitHub", href: "https://github.com/sannnproject" },
  { name: "Saweria", href: "https://saweria.co/sann404" },
];

export function FooterSection() {
  return (
    <footer className="relative border-t border-foreground/10 overflow-hidden">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <Image
                  src="/logo.png"
                  alt="SANN404 FORUM GROUP"
                  width={547}
                  height={169}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm text-sm">
                Curated collection of online web tools, utilities, and developer
                projects managed and maintained by the SANN404 FORUM GROUP community.
              </p>
              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden md:block col-span-1" />

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="col-span-1">
                <h3 className="text-sm font-medium mb-6 text-foreground">
                  {title}
                </h3>
                <ul className="space-y-4">
                  {links.map((link) => {
                    const isInternal = link.href.startsWith('/') && !link.external;
                    const content = (
                      <>
                        {link.name}
                        {'badge' in link && link.badge && (
                          <span className="text-[10px] px-2 py-0.5 bg-foreground text-background rounded-full font-mono">
                            {link.badge}
                          </span>
                        )}
                      </>
                    );
                    const className =
                      'text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2';

                    return (
                      <li key={link.name}>
                        {isInternal ? (
                          <Link href={link.href} prefetch={true} className={className}>
                            {content}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className={className}
                          >
                            {content}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} SANN404 FORUM GROUP. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All tools & systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
