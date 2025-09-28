import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, ShieldCheck, Timer } from "lucide-react";

const ContactCTA = () => {
  const scrollToForm = () => {
    const el = document.getElementById("eligibility-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="contact" className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
          {/* soft gradient background */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-primary/5" />

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
            {/* Left column: copy + CTAs */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Quick eligibility check — in under 2 minutes
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                Answer a few simple questions to see if your home qualifies for free heating controls through the ECO4 scheme. No obligation.
              </p>

              <ul className="mt-6 grid gap-3 text-sm">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 mt-0.5" />
                  <span>Government‑backed ECO4 support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Timer className="h-4 w-4 mt-0.5" />
                  <span>2‑minute form, instant guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 mt-0.5" />
                  <span>Chat anytime on WhatsApp</span>
                </li>
              </ul>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={scrollToForm}
                  className="group"
                >
                  Start eligibility check
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>

                <Button variant="outline" size="lg" asChild className="flex items-center gap-2">
                  <a
                    href="https://wa.me/8801813771121"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Right column: helper card */}
            <div className="lg:justify-self-end">
              <div className="rounded-xl border bg-background p-5 sm:p-6">
                <h3 className="font-semibold">Prefer to talk first?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Message us and we’ll help you confirm eligibility and next steps.
                </p>

                <div className="mt-4">
                  <Button asChild className="w-full">
                    <a
                      href="https://wa.me/8801813771121"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp us now
                    </a>
                  </Button>

                  <p className="mt-3 text-xs text-muted-foreground">
                    Typical reply time: under 30 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
