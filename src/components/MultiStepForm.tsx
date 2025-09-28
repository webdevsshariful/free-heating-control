import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Check, Edit3, ShieldCheck, Timer } from "lucide-react";
import emailjs from "@emailjs/browser";

export interface FormData {
  // Step 1
  propertyRelationship: string; // homeowner | tenant | landlord | other
  benefits: string[]; // REQUIRED (at least one)
  adults: string; // optional numeric string
  children: string; // optional numeric string

  // Step 2
  postcode: string;
  address: string;
  hasGas: string; // yes | no | unknown
  currentHeating: string; // gas-boiler | electric-storage | electric-panels | oil | lpg | solid-fuel | none | other
  boilerAge: string; // OPTIONAL <5 | 5-8 | 9-12 | 13+
  epcRating: string; // unknown | A | B | C | D | E | F | G
  propertyType: string; // OPTIONAL house | flat | bungalow | park-home | other

  // Step 3
  firstName: string;
  lastName: string;
  email: string; // OPTIONAL
  phone: string; // REQUIRED
  preferredContact: string; // REQUIRED
  contactTime: string; // REQUIRED

  // meta
  consentContact: boolean; // REQUIRED (GDPR)
  consentPrivacy: boolean; // REQUIRED
  marketingOptIn: boolean; // optional
  notes: string; // optional
}

const initialFormData: FormData = {
  propertyRelationship: "",
  benefits: [],
  adults: "",
  children: "",
  postcode: "",
  address: "",
  hasGas: "",
  currentHeating: "",
  boilerAge: "",
  epcRating: "unknown",
  propertyType: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredContact: "",
  contactTime: "",
  consentContact: false,
  consentPrivacy: false,
  marketingOptIn: false,
  notes: "",
};

const BENEFITS = [
  "Universal Credit",
  "Pension Credit (Guarantee Credit)",
  "Income-based JSA",
  "Income-related ESA",
  "Income Support",
  "Working Tax Credit",
  "Child Tax Credit",
  "Housing Benefit",
  "Child Benefit (income thresholds apply)",
] as const;

const QUALIFYING_BENEFITS = new Set([
  "Universal Credit",
  "Pension Credit (Guarantee Credit)",
  "Income-based JSA",
  "Income-related ESA",
  "Income Support",
  "Working Tax Credit",
  "Child Tax Credit",
  "Housing Benefit",
  "Child Benefit (income thresholds apply)",
]);

const STORAGE_KEY = "eco4_main_form_v2_emailjs";

const isValidEmail = (email: string) => !email || /.+@.+\..+/.test(email.trim()); // optional
const isValidUKPhone = (phone: string) => /^(\+44|0)\s?\d{9,10}$/.test(phone.replace(/\s+/g, ""));
const normalisePostcode = (pc: string) => pc.toUpperCase().replace(/\s+/g, "").replace(/([A-Z]{1,2}\d[A-Z\d]?:?)(\d[A-Z]{2})/, "$1 $2");
const isLikelyUKPostcode = (pc: string) => /^(GIR 0AA)|((([A-Z]{1,2}\d{1,2})|(([A-Z]{1,2}\d[A-Z])|([A-Z]{1,2}\d{2})))[ ]?\d[ABD-HJLN-UW-Z]{2})$/.test(normalisePostcode(pc));

// Honeypot field name
const HONEYPOT_NAME = "company";
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;



const Stepper = ({ step, total }: { step: number; total: number }) => {
  const titles = ["About you", "Property", "Contact", "Review"];
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {titles.slice(0, total).map((label, idx) => {
          const n = idx + 1;
          const active = n === step;
          const completed = n < step;
          return (
            <div key={label} className="flex-1 flex items-center gap-2">
              <div
                className={
                  "inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] " +
                  (completed
                    ? "bg-primary text-primary-foreground border-primary"
                    : active
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-muted text-foreground/70")
                }
                aria-current={active ? "step" : undefined}
              >
                {completed ? <Check className="h-3.5 w-3.5" /> : n}
              </div>
              <span className={"hidden sm:inline " + (active ? "font-medium text-foreground" : "")}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Inline error helper
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

export default function MultiStepForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [honeypot, setHoneypot] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const totalSteps = 4; // with Review step
  const progress = (currentStep / totalSteps) * 100;

  // Load autosave
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.formData) setFormData(parsed.formData);
        if (parsed?.currentStep) setCurrentStep(parsed.currentStep);
      }
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save autosave
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ formData, currentStep })
      );
    } catch { }
  }, [formData, currentStep]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const setFieldError = (field: keyof FormData, message: string) => {
    setErrors((e) => ({ ...e, [field]: message }));
  };
  const clearFieldError = (field: keyof FormData) => {
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep = (step: number) => {
    let ok = true;
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.propertyRelationship) {
        newErrors.propertyRelationship = "Please select your relationship to the property.";
        ok = false;
      }
      if (!formData.benefits.length) {
        newErrors.benefits = "Please select at least one benefit (required).";
        ok = false;
      }
      // Adults/children are optional – clear any leftover errors
      newErrors.adults = undefined;
      newErrors.children = undefined;
    }

    if (step === 2) {
      if (!isLikelyUKPostcode(formData.postcode)) {
        newErrors.postcode = "Enter a valid UK postcode (e.g., SW1A 1AA).";
        ok = false;
      }
      if (!formData.address.trim()) {
        newErrors.address = "Please enter your full address.";
        ok = false;
      }
      if (!formData.hasGas) {
        newErrors.hasGas = "Please select mains gas availability.";
        ok = false;
      }
      if (!formData.currentHeating) {
        newErrors.currentHeating = "Please select your current heating type.";
        ok = false;
      }
      // boilerAge & propertyType are optional
      newErrors.boilerAge = undefined;
      newErrors.propertyType = undefined;
    }

    if (step === 3) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required.";
        ok = false;
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required.";
        ok = false;
      }
      if (!isValidEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address or leave it blank.";
        ok = false;
      }
      if (!isValidUKPhone(formData.phone)) {
        newErrors.phone = "Enter a valid UK phone number (07… or +44…).";
        ok = false;
      }
      if (!formData.preferredContact) {
        newErrors.preferredContact = "Please choose your preferred contact method.";
        ok = false;
      }
      if (!formData.contactTime) {
        newErrors.contactTime = "Please choose the best time to contact you.";
        ok = false;
      }
      if (!formData.consentContact) {
        newErrors.consentContact = "Please consent to being contacted to proceed.";
        ok = false;
      }
      if (!formData.consentPrivacy) {
        newErrors.consentPrivacy = "Please accept the Privacy Notice to proceed.";
        ok = false;
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (!ok) {
      // Show top-level toast explaining the first error we find
      const firstMsg = Object.values(newErrors).find(Boolean);
      if (firstMsg) toast({ title: "Fix the highlighted fields", description: String(firstMsg), variant: "destructive" });
    }

    return ok;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  const clearForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    setHoneypot("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { }
  };

  const eligibilityFlags = useMemo(() => {
    const hasBenefit = formData.benefits.some((b) => QUALIFYING_BENEFITS.has(b));
    const noGas = formData.hasGas === "no";
    const electricHeat = ["electric-storage", "electric-panels", "none"].includes(formData.currentHeating);
    const oldBoiler = formData.boilerAge === "13+";
    const lowEpc = ["E", "F", "G"].includes(formData.epcRating);
    const hints: string[] = [];
    if (hasBenefit) hints.push("On qualifying benefit");
    if (noGas && electricHeat) hints.push("Off‑gas & electric heating");
    if (oldBoiler) hints.push("Boiler 13+ years");
    if (lowEpc) hints.push("EPC E/F/G");
    return hints.length ? hints.join(", ") : "No key flags";
  }, [formData]);

  const submitForm = async () => {
    if (honeypot) {
      toast({ title: "Submission blocked", description: "Please contact us directly.", variant: "destructive" });
      return;
    }
    if (!validateStep(3)) return;
  
    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get("utm_source") || "",
      medium: params.get("utm_medium") || "",
      campaign: params.get("utm_campaign") || "",
      ref: params.get("ref") || "",
    };
  
    if (!WEB3FORMS_KEY) {
      toast({ title: "Missing API key", description: "Add VITE_WEB3FORMS_KEY in your environment.", variant: "destructive" });
      return;
    }
  
    const message =
  `FLAGS: ${eligibilityFlags}
  Source: ${utm.source}/${utm.medium} ${utm.campaign} Ref:${utm.ref}
  
  STEP 1 - ABOUT YOU
  Relationship: ${formData.propertyRelationship}
  Benefits: ${formData.benefits.join(", ") || "None"}
  Adults: ${formData.adults || "—"}
  Children: ${formData.children || "—"}
  
  STEP 2 - PROPERTY
  Postcode: ${normalisePostcode(formData.postcode)}
  Address: ${formData.address}
  Mains Gas: ${formData.hasGas}
  Current Heating: ${formData.currentHeating}
  Boiler Age: ${formData.boilerAge || "—"}
  EPC Rating: ${formData.epcRating}
  Property Type: ${formData.propertyType || "—"}
  
  STEP 3 - CONTACT
  Name: ${formData.firstName} ${formData.lastName}
  Email: ${formData.email || "—"}
  Phone: ${formData.phone}
  Preferred Contact: ${formData.preferredContact}
  Best Time: ${formData.contactTime}
  GDPR Contact Consent: ${formData.consentContact ? "Yes" : "No"}
  Privacy Accepted: ${formData.consentPrivacy ? "Yes" : "No"}
  Marketing Opt-in: ${formData.marketingOptIn ? "Yes" : "No"}
  
  NOTES
  ${formData.notes || "(none)"}
  
  Submitted: ${new Date().toLocaleString()}
  UA: ${navigator.userAgent}`;
  
    try {
      const resp = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Free Heating Control - Application from ${formData.firstName} ${formData.lastName}`,
          from_name: `${formData.firstName} ${formData.lastName}`.trim() || "ECO4 Application",
          reply_to: formData.email || undefined,     // optional
          // to: "sharifulhridoy01@gmail.com",       // optional override (else set in Web3Forms dashboard)
          message,
          company: honeypot || ""                    // honeypot
        }),
      });
  
      const data = await resp.json();
      if (data.success) {
        toast({ title: "Application submitted!", description: "Thank you — we'll be in touch within 24 hours." });
        setSuccessOpen(true);        // keep your success modal
        clearForm();
      } else {
        throw new Error(data.message || "Web3Forms error");
      }
    } catch (err) {
      toast({
        title: "Could not send",
        description: "We couldn't send your details automatically. Please try again or contact us on WhatsApp.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <section id="eligibility-form" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-[var(--shadow-card)] border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">Check your eligibility</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Government‑backed ECO4 scheme • No obligation • Takes ~2 minutes
              </p>
              <div className="mt-4 space-y-2">
                <Stepper step={currentStep} total={totalSteps} />
                <Progress value={progress} className="w-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label>Relationship to the property</Label>
                    <RadioGroup
                      className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
                      value={formData.propertyRelationship}
                      onValueChange={(v) => {
                        clearFieldError("propertyRelationship");
                        updateFormData({ propertyRelationship: v });
                      }}
                    >
                      {[
                        { v: "homeowner", l: "Homeowner" },
                        { v: "tenant", l: "Tenant" },
                        { v: "landlord", l: "Landlord" },
                        { v: "other", l: "Other" },
                      ].map((opt) => (
                        <Label key={opt.v} className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer">
                          <RadioGroupItem value={opt.v} /> {opt.l}
                        </Label>
                      ))}
                    </RadioGroup>
                    <FieldError message={errors.propertyRelationship} />
                  </div>

                  <div>
                    <Label>Do you receive any of the following benefits? <span className="text-destructive">*</span></Label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BENEFITS.map((b) => (
                        <Label key={b} className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer">
                          <Checkbox
                            checked={formData.benefits.includes(b)}
                            onCheckedChange={(ck) => {
                              clearFieldError("benefits");
                              const val = String(b);
                              updateFormData({
                                benefits: ck
                                  ? [...formData.benefits, val]
                                  : formData.benefits.filter((x) => x !== val),
                              });
                            }}
                          />
                          <span>{b}</span>
                        </Label>
                      ))}
                    </div>
                    <FieldError message={errors.benefits} />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Selecting a benefit helps us speed up your eligibility check.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Adults in the property (optional)</Label>
                      <Input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={formData.adults}
                        onChange={(e) => updateFormData({ adults: e.target.value })}
                        placeholder="e.g., 2"
                      />
                      <FieldError message={errors.adults} />
                    </div>
                    <div>
                      <Label>Children in the property (optional)</Label>
                      <Input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={formData.children}
                        onChange={(e) => updateFormData({ children: e.target.value })}
                        placeholder="e.g., 1"
                      />
                      <FieldError message={errors.children} />
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-accent/20">
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="h-4 w-4" /> Your information is used only to assess ECO4 eligibility.
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div />
                    <Button onClick={nextStep}>Next</Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Postcode</Label>
                      <Input
                        value={formData.postcode}
                        onChange={(e) => {
                          clearFieldError("postcode");
                          updateFormData({ postcode: e.target.value.toUpperCase() });
                        }}
                        onBlur={(e) => updateFormData({ postcode: normalisePostcode(e.target.value) })}
                        placeholder="e.g., SW1A 1AA"
                        aria-invalid={!!errors.postcode}
                      />
                      <FieldError message={errors.postcode} />
                    </div>
                    <div>
                      <Label>Full Address</Label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) => {
                          clearFieldError("address");
                          updateFormData({ address: e.target.value });
                        }}
                        placeholder="House number, street, town, postcode"
                        rows={3}
                      />
                      <FieldError message={errors.address} />
                    </div>
                  </div>

                  <div>
                    <Label>Mains gas available?</Label>
                    <RadioGroup
                      className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2"
                      value={formData.hasGas}
                      onValueChange={(v) => {
                        clearFieldError("hasGas");
                        updateFormData({ hasGas: v });
                      }}
                    >
                      {[
                        { v: "yes", l: "Yes" },
                        { v: "no", l: "No" },
                        { v: "unknown", l: "Not sure" },
                      ].map((opt) => (
                        <Label key={opt.v} className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer">
                          <RadioGroupItem value={opt.v} /> {opt.l}
                        </Label>
                      ))}
                    </RadioGroup>
                    <FieldError message={errors.hasGas} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Current heating type</Label>
                      <Select
                        value={formData.currentHeating}
                        onValueChange={(v) => {
                          clearFieldError("currentHeating");
                          updateFormData({ currentHeating: v });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gas-boiler">Gas boiler</SelectItem>
                          <SelectItem value="electric-storage">Electric storage heaters</SelectItem>
                          <SelectItem value="electric-panels">Electric panel heaters</SelectItem>
                          <SelectItem value="oil">Oil</SelectItem>
                          <SelectItem value="lpg">LPG</SelectItem>
                          <SelectItem value="solid-fuel">Solid fuel</SelectItem>
                          <SelectItem value="none">No central heating</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError message={errors.currentHeating} />
                    </div>
                    <div>
                      <Label>Boiler age (optional)</Label>
                      <Select value={formData.boilerAge} onValueChange={(v) => updateFormData({ boilerAge: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<5">Under 5 years</SelectItem>
                          <SelectItem value="5-8">5–8 years</SelectItem>
                          <SelectItem value="9-12">9–12 years</SelectItem>
                          <SelectItem value="13+">13+ years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError message={errors.boilerAge} />
                    </div>
                    <div>
                      <Label>EPC rating (if known)</Label>
                      <Select value={formData.epcRating} onValueChange={(v) => updateFormData({ epcRating: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Unknown" />
                        </SelectTrigger>
                        <SelectContent>
                          {(["unknown", "A", "B", "C", "D", "E", "F", "G"] as const).map((r) => (
                            <SelectItem key={r} value={r}>
                              {r.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Property type (optional)</Label>
                      <Select value={formData.propertyType} onValueChange={(v) => updateFormData({ propertyType: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="flat">Flat / Maisonette</SelectItem>
                          <SelectItem value="bungalow">Bungalow</SelectItem>
                          <SelectItem value="park-home">Park home</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError message={errors.propertyType} />
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-accent/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Timer className="h-4 w-4" /> Don’t worry if you’re unsure — we’ll confirm details during a quick call.
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button onClick={nextStep}>Next</Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>First name</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => {
                          clearFieldError("firstName");
                          updateFormData({ firstName: e.target.value });
                        }}
                      />
                      <FieldError message={errors.firstName} />
                    </div>
                    <div>
                      <Label>Last name</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => {
                          clearFieldError("lastName");
                          updateFormData({ lastName: e.target.value });
                        }}
                      />
                      <FieldError message={errors.lastName} />
                    </div>
                    <div>
                      <Label>Email (optional)</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          clearFieldError("email");
                          updateFormData({ email: e.target.value });
                        }}
                        placeholder="name@example.com"
                      />
                      <FieldError message={errors.email} />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        inputMode="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          clearFieldError("phone");
                          updateFormData({ phone: e.target.value });
                        }}
                        placeholder="07… or +44…"
                      />
                      <FieldError message={errors.phone} />
                    </div>
                  </div>

                  {/* Ensure no overlap: stack on mobile, side-by-side on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Preferred contact</Label>
                      <RadioGroup
                        className="mt-2 grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2"
                        value={formData.preferredContact}
                        onValueChange={(v) => {
                          clearFieldError("preferredContact");
                          updateFormData({ preferredContact: v });
                        }}
                      >
                        {[
                          { v: "phone", l: "Phone" },
                          { v: "email", l: "Email" },
                          { v: "whatsapp", l: "WhatsApp" },
                        ].map((opt) => (
                          <Label key={opt.v} className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer">
                            <RadioGroupItem value={opt.v} /> {opt.l}
                          </Label>
                        ))}
                      </RadioGroup>
                      <FieldError message={errors.preferredContact} />
                    </div>
                    <div className="flex flex-col justify-between">
                      <Label>Best time to contact</Label>
                      <Select
                        value={formData.contactTime}
                        onValueChange={(v) => {
                          clearFieldError("contactTime");
                          updateFormData({ contactTime: v });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9–12)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12–5)</SelectItem>
                          <SelectItem value="evening">Evening (5–8)</SelectItem>
                          <SelectItem value="anytime">Anytime</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError message={errors.contactTime} />
                    </div>
                  </div>

                  <div>
                    <Label>Anything else we should know? (optional)</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => updateFormData({ notes: e.target.value })}
                      placeholder="E.g., access times, mobility needs, thermostat issues, etc."
                      rows={3}
                    />
                  </div>

                  {/* Consents */}
                  <div className="space-y-3 rounded-lg border p-4">
                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox
                        checked={formData.consentContact}
                        onCheckedChange={(v) => {
                          clearFieldError("consentContact");
                          updateFormData({ consentContact: Boolean(v) });
                        }}
                      />
                      <span>
                        I agree that Free Heating Control may contact me to assess ECO4 eligibility and arrange a survey.
                      </span>
                    </label>
                    <FieldError message={errors.consentContact} />

                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox
                        checked={formData.consentPrivacy}
                        onCheckedChange={(v) => {
                          clearFieldError("consentPrivacy");
                          updateFormData({ consentPrivacy: Boolean(v) });
                        }}
                      />
                      <span>
                        I have read and accept the Privacy Notice.
                      </span>
                    </label>
                    <FieldError message={errors.consentPrivacy} />

                    <label className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Checkbox
                        checked={formData.marketingOptIn}
                        onCheckedChange={(v) => updateFormData({ marketingOptIn: Boolean(v) })}
                      />
                      <span>Send me occasional updates and offers (optional).</span>
                    </label>
                  </div>

                  {/* Honeypot */}
                  <div className="hidden" aria-hidden>
                    <Label htmlFor={HONEYPOT_NAME}>Company</Label>
                    <Input id={HONEYPOT_NAME} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button onClick={nextStep}>Review</Button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold mb-2">Quick review</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="w-28 text-muted-foreground">Flags</span>
                        <span>{eligibilityFlags}</span>
                      </div>
                      <hr className="my-2" />
                      <SectionRow label="Relationship" value={formData.propertyRelationship} />
                      <SectionRow label="Benefits" value={formData.benefits.join(", ") || "None"} />
                      <SectionRow label="Adults / Children" value={`${formData.adults || "—"} / ${formData.children || "—"}`} />
                      <hr className="my-2" />
                      <SectionRow label="Postcode" value={normalisePostcode(formData.postcode)} />
                      <SectionRow label="Address" value={formData.address} multiline />
                      <SectionRow label="Mains Gas" value={formData.hasGas} />
                      <SectionRow label="Heating" value={formData.currentHeating} />
                      <SectionRow label="Boiler Age" value={formData.boilerAge || "—"} />
                      <SectionRow label="EPC" value={formData.epcRating} />
                      <SectionRow label="Property Type" value={formData.propertyType || "—"} />
                      <hr className="my-2" />
                      <SectionRow label="Name" value={`${formData.firstName} ${formData.lastName}`} />
                      <SectionRow label="Email" value={formData.email || "—"} />
                      <SectionRow label="Phone" value={formData.phone} />
                      <SectionRow label="Contact" value={`${formData.preferredContact}, ${formData.contactTime}`} />
                      {formData.notes && <SectionRow label="Notes" value={formData.notes} multiline />}
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      By submitting, you confirm the details above are accurate to the best of your knowledge.
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-1">
                      <Edit3 className="h-4 w-4" /> Edit About You
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-1">
                      <Edit3 className="h-4 w-4" /> Edit Property
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentStep(3)} className="gap-1">
                      <Edit3 className="h-4 w-4" /> Edit Contact
                    </Button>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button onClick={submitForm}>Submit application</Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Eligibility and funding for ECO4 can change. Final approval depends on survey results and scheme rules.
                  </div>
                </div>
              )}

              {/* Footer helpers */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <button type="button" onClick={clearForm} className="underline underline-offset-2">
                  Clear & restart
                </button>
                <span>Typical reply time: under 30 minutes</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thanks! Your application was sent ✅</DialogTitle>
            <DialogDescription>
              We’ve received your details. We’ll review and contact you shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm space-y-2">
            <p><strong>What happens next?</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A quick call to confirm a few details</li>
              <li>We’ll arrange your free survey</li>
              <li>You’ll get next‑step guidance</li>
            </ul>
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <DialogClose asChild>
              <Button variant="outline" asChild>
                <a href="#eligibility-form">Close</a>
              </Button>
            </DialogClose>

            <Button asChild>
              <a href="https://wa.me/8801813771121" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </section>
  );
}

function SectionRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className={multiline ? "whitespace-pre-wrap" : "truncate"}>{value || "—"}</span>
    </div>
  );
}
