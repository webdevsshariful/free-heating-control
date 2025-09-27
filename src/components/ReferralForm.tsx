import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface ReferralPerson {
  name: string;
  phone: string;
  address: string;
  benefits: string;
}

const ReferralForm = () => {
  const [referrals, setReferrals] = useState<ReferralPerson[]>([
    { name: "", phone: "", address: "", benefits: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const updated = referrals.map((referral, i) => 
      i === index ? { ...referral, [field]: value } : referral
    );
    setReferrals(updated);
  };

  const validateForm = () => {
    return referrals.every(referral => 
      referral.name.trim() && referral.phone.trim() && referral.address.trim()
    );
  };

  const submitForm = async () => {
    if (!validateForm()) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, phone number, and address are required for each referral.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const emailContent = `
        Free Heating Control - Referral Submissions
        
        REFERRALS:
        ${referrals.map((referral, index) => `
        Referral ${index + 1}:
        Name: ${referral.name}
        Phone: ${referral.phone}
        Address: ${referral.address}
        Benefits: ${referral.benefits || 'Not specified'}
        `).join('\n')}
        
        Submitted: ${new Date().toLocaleString()}
      `;

      const mailtoLink = `mailto:sharifulhridoy01@gmail.com?subject=Free Heating Control - Referral Submissions&body=${encodeURIComponent(emailContent)}`;
      window.location.href = mailtoLink;
      
      toast({
        title: "Referrals Submitted!",
        description: "Thank you for your referrals. We'll contact them within 24 hours.",
      });

      setReferrals([{ name: "", phone: "", address: "", benefits: "" }]);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your referrals. Please try again.",
        variant: "destructive",
      });
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
              Help your neighbors, friends, and family get free heating upgrades too!
            </p>
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
              {referrals.map((referral, index) => (
                <div key={index} className="border border-border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      Referral {index + 1}
                    </h3>
                    {referrals.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeReferral(index)}
                        className="text-destructive hover:text-destructive"
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
                        onChange={(e) => updateReferral(index, 'name', e.target.value)}
                        placeholder="Enter their full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
                      <Input
                        id={`phone-${index}`}
                        value={referral.phone}
                        onChange={(e) => updateReferral(index, 'phone', e.target.value)}
                        placeholder="Enter their phone number"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`address-${index}`}>Full Address *</Label>
                    <Textarea
                      id={`address-${index}`}
                      value={referral.address}
                      onChange={(e) => updateReferral(index, 'address', e.target.value)}
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
                      onChange={(e) => updateReferral(index, 'benefits', e.target.value)}
                      placeholder="e.g., Universal Credit, Pension Credit, etc."
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={addReferral}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Referral
                </Button>
                
                <Button
                  onClick={submitForm}
                  disabled={isSubmitting || !validateForm()}
                  className="flex-1 sm:flex-none"
                >
                  {isSubmitting ? "Submitting..." : "Submit Referrals"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReferralForm;