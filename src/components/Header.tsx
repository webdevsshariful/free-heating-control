import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const Header = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('eligibility-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Free Heating Control</h1>
            <p className="text-sm text-muted-foreground">United Kingdom</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">How It Works</a>
          <a href="#eligibility" className="text-foreground hover:text-primary transition-colors">Eligibility</a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-foreground">
            <Phone className="w-4 h-4" />
            <span className="font-medium">+8801813771121</span>
          </div>
          <Button variant="hero" size="lg" onClick={scrollToForm}>
            Check Eligibility
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;