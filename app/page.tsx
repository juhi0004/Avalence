import HeroSection from "@/components/HeroSection";
import ClientsSection from "@/components/ClientsSection";
import ServicesSection from "@/components/ServicesSection";
import CTASection from "@/components/CTASection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ParallaxController from "@/components/ParallaxController";
import FloatingOrbs from "@/components/ui/FloatingOrbs";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ParticleTunnel from "@/components/three/ParticleTunnel";

export default function Home() {
  return (
    <main style={{ position: "relative", overflowX: "hidden", perspective: "1200px", perspectiveOrigin: "50% 0%" }}>
      <ParticleTunnel />
      <FloatingOrbs />
      <ScrollProgress />
      <ParallaxController />
      <Navbar />

      <HeroSection />
      <ServicesSection />
      <ClientsSection />
      <CTASection />
      <BlogSection />
      <ContactSection />

      <Footer />
    </main>
  );
}
