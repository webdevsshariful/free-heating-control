import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const NAV_ITEMS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#eligibility-form", label: "Eligibility" },
  { href: "#referral-form", label: "Refer Friends" },
  { href: "#contact", label: "Contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  const scrollToForm = useCallback(() => {
    const formElement = document.getElementById("eligibility-form");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleNavClick = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  }, []);

  return (
    <>
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-3">
            {/* Left: Logo + brand */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={logo}
                alt="Free Heating Control"
                className="w-40 h-40 rounded-md object-contain"
              />
            </div>

            {/* Center: Desktop nav */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    // Smooth-scroll without jumping hash in the URL (keep your anchors if you prefer)
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* WhatsApp: icon-only on xs, full button on sm+ */}
              <Button
                variant="outline"
                size="sm"
                className="p-2 sm:px-3 sm:py-2"
                asChild
              >
                <a
                  href="https://wa.me/8801813771121"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </Button>

              {/* CTA scales up on md+ */}
              <Button
                variant="hero"
                onClick={scrollToForm}
                className="h-9 px-3 text-sm md:h-10 md:px-6 md:text-base"
              >
                Check Eligibility
              </Button>

              {/* Mobile menu trigger (md-) */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85%] sm:w-80">
                  <div className="flex items-center gap-3 mb-6">
                    <img
                      src={logo}
                      alt="Free Heating Control"
                      className="w-8 h-8 rounded-md object-contain"
                    />
                    <div>
                      <p className="font-semibold leading-tight">Free Heating Control</p>
                      <p className="text-xs text-muted-foreground">United Kingdom</p>
                    </div>
                  </div>

                  <nav className="grid gap-2">
                    {NAV_ITEMS.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.href);
                          }}
                          className="rounded-lg px-3 py-2 text-foreground/90 hover:bg-accent hover:text-accent-foreground"
                        >
                          {item.label}
                        </a>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="mt-6 grid gap-2">
                    <Button asChild variant="outline">
                      <a
                        href="https://wa.me/8801813771121"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    </Button>
                    <Button variant="hero" onClick={() => { setOpen(false); scrollToForm(); }}>
                      Check Eligibility
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
