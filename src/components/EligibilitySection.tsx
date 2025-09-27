import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EligibilitySection = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('eligibility-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="eligibility" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent">
              Can I get a free boiler through the boiler replacement scheme?
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Card className="shadow-[var(--shadow-card)] border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Quick Eligibility Check</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    If you think you may be eligible, apply using our quick form below.
                  </p>
                  <p className="text-foreground font-medium">
                    Most of our customers qualify for a free boiler.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    But even if you can't access a free boiler, you may be able to get a part funded 
                    or heavily subsidised boiler. That means you'll get some funding, but you'll need 
                    to make a contribution towards the cost.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    If you're struggling with an old, inefficient boiler that keeps breaking down or 
                    costs a fortune to run, then this could be a way for you to solve the problem for good.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-light to-warm-accent p-8 rounded-lg shadow-[var(--shadow-card)]">
                <h3 className="text-xl font-bold text-foreground mb-4">Ready to Apply?</h3>
                <p className="text-muted-foreground mb-6">
                  Complete our simple eligibility form and find out if you qualify for a free boiler replacement.
                </p>
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={scrollToForm}
                >
                  Start Application
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Have questions? Call us at{" "}
                  <a href="tel:+8801813771121" className="text-primary font-medium hover:underline">
                    +8801813771121
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EligibilitySection;