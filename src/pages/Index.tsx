import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessSteps from "@/components/ProcessSteps";
import EligibilitySection from "@/components/EligibilitySection";
import MultiStepForm from "@/components/MultiStepForm";
import ReferralForm from "@/components/ReferralForm";
import Footer from "@/components/Footer";
import ContactCTA from "@/components/ContactCTA";
import Header2 from "@/components/Header2";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header2 />
      {/* <HeroSection /> */}
      <MultiStepForm />
      <ReferralForm />
      <EligibilitySection />
      <ContactCTA />
      <ProcessSteps />
      {/* <Footer /> */}
    </div>
  );
};

export default Index;
