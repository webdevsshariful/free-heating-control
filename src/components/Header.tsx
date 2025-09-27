import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

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
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Free Heating Control" className="w-12 h-12" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Free Heating Control</h1>
            <p className="text-sm text-muted-foreground">United Kingdom</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">How It Works</a>
          <a href="#eligibility" className="text-foreground hover:text-primary transition-colors">Eligibility</a>
          <a href="#referral-form" className="text-foreground hover:text-primary transition-colors">Refer Friends</a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2"
            onClick={() => window.open('https://wa.me/8801813771121', '_blank')}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
          <Button variant="hero" size="lg" onClick={scrollToForm}>
            Check Eligibility
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;