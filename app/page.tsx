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
    url: "https://project.saannndec5ty.my.id",
    type: "website",
    siteName: "Tools Collection",
    locale: "id_ID",
    images: [
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
      {
        url: "https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png",
        width: 1734,
        height: 907,
        type: "image/png",
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
        url: "/og-image.jpg",
        width: 1200,
        height: 628,
        alt: "Tools Collection - SANN404 FORUM GROUP",
      },
    ],
  },
  other: {
    "image_src": "https://project.saannndec5ty.my.id/og-image.jpg",
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
