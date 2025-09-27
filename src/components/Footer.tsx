import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <h3 className="text-xl font-bold">Free Heating Control</h3>
            </div>
            <p className="text-background/80 mb-4">
              Helping UK households access free boiler replacements through government-funded schemes. 
              Thousands of satisfied customers have trusted us with their heating needs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>+8801813771121</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>sharifulhridoy01@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>United Kingdom</span>
              </div>
            </div>
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