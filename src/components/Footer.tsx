import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="Free Heating Control" className="w-10 h-10" />
              <h3 className="text-xl font-bold">Free Heating Control</h3>
            </div>
            <p className="text-background/80 mb-4">
              Helping UK households access free boiler replacements through government-funded schemes. 
              Thousands of satisfied customers have trusted us with their heating needs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <Button
              variant="outline"
              className="bg-transparent border-background/20 text-background hover:bg-background/10"
              asChild
            >
              <a href="https://wa.me/8801813771121" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact via WhatsApp
              </a>
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
            <ul className="space-y-2 text-background/80">
              <li>1. Complete our eligibility form</li>
              <li>2. Book your free property survey</li>
              <li>3. Professional boiler installation</li>
              <li>4. Enjoy reliable, efficient heating</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60">
            © {new Date().getFullYear()} Free Heating Control. All rights reserved. | 
            Government-funded boiler replacement schemes available for eligible households.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;