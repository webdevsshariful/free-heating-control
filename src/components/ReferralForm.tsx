import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, PoundSterling, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import emailjs from "@emailjs/browser";

// ---------- Utils ----------
interface ReferralPerson {
  name: string;
  phone: string;
  address: string;
  benefits: string;
}

const isValidUKPhone = (phone: string) => {
  const cleaned = phone.replace(/\s+/g, "");
  // Accepts +44 or 0 followed by 9-10 digits (mobiles/landlines)
  return /^(\+44|0)\d{9,10}$/.test(cleaned);
};


const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;


const ReferralForm = () => {
  const [referrals, setReferrals] = useState<ReferralPerson[]>([
    { name: "", phone: "", address: "", benefits: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [referrerName, setReferrerName] = useState("");
  const [referrerContact, setReferrerContact] = useState(""); // phone or email
  const [payoutMethod, setPayoutMethod] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const { toast } = useToast();

  const addReferral = () => {
    setReferrals([...referrals, { name: "", phone: "", address: "", benefits: "" }]);
  };

  const removeReferral = (index: number) => {
    if (referrals.length > 1) {
      setReferrals(referrals.filter((_, i) => i !== index));
    }
  };

  const updateReferral = (index: number, field: keyof ReferralPerson, value: string) => {
    const updated = referrals.map((referral, i) => (i === index ? { ...referral, [field]: value } : referral));
    setReferrals(updated);
  };

  const validateForm = () => {
    const requiredOk = referrals.every((r) => r.name.trim() && r.phone.trim() && r.address.trim());
    const phonesOk = referrals.every((r) => isValidUKPhone(r.phone));
    return requiredOk && phonesOk && hasConsent && acceptTerms;
  };

  const submitForm = async () => {
    if (!referrals.every((r) => r.name.trim() && r.phone.trim() && r.address.trim())) {
      toast({ title: "Please fill in all required fields", description: "Name, phone number, and address are required for each referral.", variant: "destructive" });
      return;
    }
    if (!referrals.every((r) => isValidUKPhone(r.phone))) {
      toast({ title: "Check phone numbers", description: "Use a valid UK number (e.g., 07… or +44…).", variant: "destructive" });
      return;
    }
    if (!hasConsent) {
      toast({ title: "Consent required", description: "Please confirm you have permission from each person to share their details.", variant: "destructive" });
      return;
    }
    if (!acceptTerms) {
      toast({ title: "Accept the terms", description: "Please accept the Referral Reward Terms before submitting.", variant: "destructive" });
      return;
    }
    if (!WEB3FORMS_KEY) {
      toast({ title: "Missing API key", description: "Add VITE_WEB3FORMS_KEY in your environment.", variant: "destructive" });
      return;
    }
  
    setIsSubmitting(true);
    try {
      const referralsText = referrals.map((r, i) => `Referral ${i + 1}:
  Name: ${r.name}
  Phone: ${r.phone}
  Address: ${r.address}
  Benefits: ${r.benefits || "Not specified"}`).join("\n\n");
  
      const message =
  `REFERRER
  Name: ${referrerName || "Not provided"}
  Contact: ${referrerContact || "Not provided"}
  Payout method: ${payoutMethod || "Not specified"}
  
  ${referralsText}
  
  Consent confirmed: ${hasConsent ? "Yes" : "No"}
  Terms accepted: ${acceptTerms ? "Yes" : "No"}
  Submitted: ${new Date().toLocaleString()}
  UA: ${navigator.userAgent}`;
  
      const resp = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Free Heating Control - Referral Submissions",
          from_name: referrerName || "Referral Form",
          reply_to: /\S+@\S+\.\S+/.test(referrerContact) ? referrerContact : undefined, // only if it's an email
          // to: "sharifulhridoy01@gmail.com", // optional override
          message
        }),
      });
  
      const data = await resp.json();
      if (data.success) {
        toast({ title: "Referrals Submitted!", description: "Thank you — we’ll contact your referrals within 24 hours." });
        setSuccessOpen(true);
  
        // reset
        setReferrals([{ name: "", phone: "", address: "", benefits: "" }]);
        setHasConsent(false);
        setAcceptTerms(false);
        setReferrerName("");
        setReferrerContact("");
        setPayoutMethod("");
      } else {
        throw new Error(data.message || "Web3Forms error");
      }
    } catch (error) {
      toast({ title: "Error", description: "We couldn't send your referrals automatically. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <section id="referral-form" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Refer Friends & Family</h2>
            <p className="text-lg text-muted-foreground">
              Help your neighbours, friends, and family get free heating upgrades too!
            </p>

            {/* Reward banner */}
            <div className="mt-5 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                    <PoundSterling className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold leading-tight">Earn up to £100 per valid lead</p>
                    <p className="text-xs text-muted-foreground">Paid after successful survey/installation — see terms.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="whitespace-nowrap">
                    Limited-time offer
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Info className="h-4 w-4" /> View terms
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Referral Reward Terms</DialogTitle>
                        <DialogDescription>
                          Summary of how the reward works. Edit these to match your policy.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>
                            <span className="font-medium">Reward:</span> Up to £100 per valid lead. The exact amount may vary by
                            measure installed and region.
                          </li>
                          <li>
                            <span className="font-medium">What counts as a valid lead:</span> UK resident homeowner/tenant who (a)
                            gives consent to be contacted, (b) is reachable, (c) appears eligible under the ECO4 scheme, and (d)
                            completes a home survey. Duplicates, existing customers, and self-referrals are excluded.
                          </li>
                          <li>
                            <span className="font-medium">Payout timing:</span> Typically within 30 days after the successful home
                            survey or first installation, whichever comes first.
                          </li>
                          <li>
                            <span className="font-medium">Payout method:</span> Bank transfer or mobile wallet. We’ll contact you to
                            arrange payment using the details you provide below.
                          </li>
                          <li>
                            <span className="font-medium">Limits:</span> Up to 20 rewards per month per referrer unless agreed in
                            writing.
                          </li>
                          <li>
                            <span className="font-medium">Compliance:</span> You must have permission from each person before sharing
                            their details. Please do not submit contact details harvested without consent.
                          </li>
                        </ol>
                        <p className="text-xs text-muted-foreground mt-2">ECO4 eligibility and funding are subject to change.</p>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="secondary">Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-foreground font-medium">
                ✅ We'll contact your referrals within 24 hours to check their eligibility
              </p>
            </div>
          </div>

          <Card className="shadow-[var(--shadow-card)] border-0">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Referral Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Referrer details for reward payout */}
              <div className="border border-border rounded-lg p-6 space-y-4 bg-background/50">
                <h3 className="text-lg font-semibold text-foreground">Your details (for the reward)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="referrer-name">Your Name</Label>
                    <Input
                      id="referrer-name"
                      value={referrerName}
                      onChange={(e) => setReferrerName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="referrer-contact">Your Phone or Email</Label>
                    <Input
                      id="referrer-contact"
                      value={referrerContact}
                      onChange={(e) => setReferrerContact(e.target.value)}
                      placeholder="For arranging payout"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="payout-method">Preferred Payout Method</Label>
                    <Input
                      id="payout-method"
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      placeholder="e.g., Bank transfer, Mobile wallet"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">We’ll only use this to arrange your reward.</p>
              </div>

              {referrals.map((referral, index) => (
                <div key={index} className="border border-border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Referral {index + 1}</h3>
                    {referrals.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeReferral(index)}
                        className="text-destructive hover:text-destructive"
                        aria-label={`Remove referral ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>Full Name *</Label>
                      <Input
                        id={`name-${index}`}
                        value={referral.name}
                        onChange={(e) => updateReferral(index, "name", e.target.value)}
                        placeholder="Enter their full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
                      <Input
                        id={`phone-${index}`}
                        value={referral.phone}
                        onChange={(e) => updateReferral(index, "phone", e.target.value)}
                        placeholder="UK number (07… or +44…)"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`address-${index}`}>Full Address *</Label>
                    <Textarea
                      id={`address-${index}`}
                      value={referral.address}
                      onChange={(e) => updateReferral(index, "address", e.target.value)}
                      placeholder="Enter their complete address including postcode"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`benefits-${index}`}>Benefits Received (Optional)</Label>
                    <Input
                      id={`benefits-${index}`}
                      value={referral.benefits}
                      onChange={(e) => updateReferral(index, "benefits", e.target.value)}
                      placeholder="e.g., Universal Credit, Pension Credit, etc."
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={addReferral} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Another Referral
                </Button>

                <div className="flex-1" />
              </div>

              {/* Consent & terms */}
              <div className="space-y-3 rounded-lg border p-4">
                <label className="flex items-start gap-3 text-sm">
                  <Checkbox id="consent" checked={hasConsent} onCheckedChange={(v) => setHasConsent(Boolean(v))} />
                  <span>
                    I confirm I have each person’s permission to share their details for the purpose of an ECO4 eligibility check.
                  </span>
                </label>

                <label className="flex items-start gap-3 text-sm">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(Boolean(v))} />
                  <span>
                    I accept the{" "}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="underline underline-offset-2">Referral Reward Terms</button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Referral Reward Terms</DialogTitle>
                          <DialogDescription>Same as above — please review.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 text-sm">
                          <p>
                            Up to £100 per valid lead; paid within ~14–30 days after survey/installation; consent required;
                            duplicates and existing customers excluded; monthly caps may apply.
                          </p>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="secondary">Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    .
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={submitForm} disabled={isSubmitting || !validateForm()} className="flex-1 sm:flex-none">
                  {isSubmitting ? "Submitting..." : "Submit Referrals"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thanks! Your referrals were sent ✅</DialogTitle>
            <DialogDescription>We’ll review and reach out within 24 hours.</DialogDescription>
          </DialogHeader>
          <div className="text-sm space-y-1">
            <p>
              <strong>What happens next?</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We call each referral to confirm details</li>
              <li>Eligibility check & survey booking</li>
              <li>We’ll update you on rewards</li>
            </ul>
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button asChild>
              <a href="https://wa.me/8801813771121" target="_blank" rel="noreferrer">
                WhatsApp us
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReferralForm;
