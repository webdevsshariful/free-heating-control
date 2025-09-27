import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessSteps from "@/components/ProcessSteps";
import EligibilitySection from "@/components/EligibilitySection";
import MultiStepForm from "@/components/MultiStepForm";
import ReferralForm from "@/components/ReferralForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProcessSteps />
      <EligibilitySection />
      <MultiStepForm />
      <ReferralForm />
      <Footer />
    </div>
  );
};

export default Index;
