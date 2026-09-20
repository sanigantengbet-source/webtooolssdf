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
    "Curated collection of online web tools, utilities, automation scripts, and projects created and managed by SANN404 FORUM GROUP.",
  openGraph: {
    title: "SANN404 FORUM GROUP | Curated Tools Collection",
    description:
      "Curated collection of online web tools, utilities, automation scripts, and projects created and managed by SANN404 FORUM GROUP.",
    type: "website",
    siteName: "Tools Collection",
    images: [
      {
        url: "https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png",
        width: 1734,
        height: 907,
        alt: "Tools Collection - SANN404 FORUM GROUP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SANN404 FORUM GROUP | Curated Tools Collection",
    description:
      "Curated collection of online web tools, utilities, automation scripts, and projects created and managed by SANN404 FORUM GROUP.",
    images: [
      {
        url: "https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png",
        width: 1734,
        height: 907,
        alt: "Tools Collection - SANN404 FORUM GROUP",
      },
    ],
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
