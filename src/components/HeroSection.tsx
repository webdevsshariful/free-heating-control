import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-heating.jpg";

const HeroSection = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('eligibility-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative container mx-auto px-4 z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            What is the free boiler replacement scheme?
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 leading-relaxed">
            It's a government-funded scheme, and if you are a homeowner or private tenant in receipt 
            of benefits, tax credits or universal credit, then you could be eligible for a free boiler.
          </p>
          
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Thousands of customers have trusted Free Heating Control to supply and fit their free gas, 
            oil or LPG boilers.
          </p>
          
          <p className="text-base md:text-lg mb-8">
            To find out whether the boiler replacement scheme is available in your area, 
            click the Check Eligibility button below
          </p>
          
          <Button 
            variant="hero" 
            size="lg" 
            className="text-xl px-12 py-6 h-auto"
            onClick={scrollToForm}
          >
            Check Eligibility
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;