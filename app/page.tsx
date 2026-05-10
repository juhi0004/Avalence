import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />

      <section id="blog" className="min-h-screen" />
      <section id="contact" className="min-h-screen" />
    </>
  );
}
