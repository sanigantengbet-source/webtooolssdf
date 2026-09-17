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
