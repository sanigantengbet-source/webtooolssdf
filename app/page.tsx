import {
  Navigation,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  InfrastructureSection,
  MetricsSection,
  IntegrationsSection,
  SecuritySection,
  TestimonialsSection,
  CtaSection,
  FooterSection,
} from "@/components/landing";

export const metadata = {
  title: "SANN404 FORUM GROUP | Curated Tools Collection",
  description:
    "A centralized hub of hand-crafted web tools, utilities, automation resources, and projects built to empower modern developers and digital explorers.",
  openGraph: {
    title: "SANN404 FORUM GROUP | Curated Tools Collection",
    description:
      "A centralized hub of hand-crafted web tools, utilities, automation resources, and projects built to empower modern developers and digital explorers.",
    url: "https://project.saannndec5ty.my.id",
    type: "website",
    siteName: "Tools Collection",
    locale: "id_ID",
    images: [
      {
        url: "https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png",
        secureUrl: "https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Tools Collection - SANN404 FORUM GROUP",
      },
      {
        url: "/og-image.jpg",
        secureUrl: "https://project.saannndec5ty.my.id/og-image.jpg",
        width: 1200,
        height: 628,
        type: "image/jpeg",
        alt: "Tools Collection - SANN404 FORUM GROUP",
      },
      {
        url: "/og-image.png",
        secureUrl: "https://project.saannndec5ty.my.id/og-image.png",
        width: 1200,
        height: 628,
        type: "image/png",
        alt: "Tools Collection - SANN404 FORUM GROUP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SANN404 FORUM GROUP | Curated Tools Collection",
    description:
      "A centralized hub of hand-crafted web tools, utilities, automation resources, and projects built to empower modern developers and digital explorers.",
    images: ["https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png"],
  },
  other: {
    "image_src": "https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background font-sans noise-overlay">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <InfrastructureSection />
        <MetricsSection />
        <IntegrationsSection />
        <SecuritySection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  );
}
