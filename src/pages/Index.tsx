import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import ForOrganizations from "@/components/landing/ForOrganizations";
import ForVolunteers from "@/components/landing/ForVolunteers";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ForOrganizations />
        <ForVolunteers />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
