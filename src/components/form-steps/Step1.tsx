import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "../MultiStepForm";

interface Step1Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

export const Step1 = ({ formData, updateFormData, onNext }: Step1Props) => {
  const benefits = [
    "Pension Credit (Guarantee Element)",
    "Child Benefit", 
    "Child Tax Credit",
    "Working Tax Credits",
    "Universal Credit",
    "Income Support",
    "Income-Related Employment & Support Allowance (ESA)",
    "Income-Based Job Seekers Allowance (JSA)",
    "Armed Forces Independence Payment",
    "Attendance Allowance",
    "Carers Allowance",
    "Disability Living Allowance (DLA)",
    "Severe Disablement Allowance",
    "War Pensions Mobility Supplement",
    "Industrial Injuries Disablement Benefit",
    "Personal Independence Payment",
    "Constant Attendance Allowance"
  ];

  const handleBenefitChange = (benefit: string, checked: boolean) => {
    let newBenefits = [...formData.benefits];
    if (checked) {
      newBenefits.push(benefit);
    } else {
      newBenefits = newBenefits.filter(b => b !== benefit);
    }
    updateFormData({ benefits: newBenefits });
  };

  const canProceed = formData.propertyRelationship && formData.adults && formData.children;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">About You</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium text-foreground">
              What is your relationship to the property which you are applying for? *
            </Label>
            <RadioGroup 
              value={formData.propertyRelationship} 
              onValueChange={(value) => updateFormData({ propertyRelationship: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="homeowner" id="homeowner" />
                <Label htmlFor="homeowner">Home Owner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private-tenant" id="private-tenant" />
                <Label htmlFor="private-tenant">Private Tenant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="landlord" id="landlord" />
                <Label htmlFor="landlord">Landlord</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="council-tenant" id="council-tenant" />
                <Label htmlFor="council-tenant">Council Tenant</Label>
              </div>
            </RadioGroup>
            
            {formData.propertyRelationship === "homeowner" && (
              <p className="text-sm text-accent mt-2 p-2 bg-green-light rounded">
                Boiler grants are now only available for homeowners, in properties with mains gas.
              </p>
            )}
            
            {(formData.propertyRelationship === "private-tenant" || 
              formData.propertyRelationship === "council-tenant" || 
              formData.propertyRelationship === "landlord") && (
              <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                Private tenants, Council Tenants, and Landlords can apply for a grant if their home doesn't have any central heating at all!
              </p>
            )}
          </div>

          <div>
            <Label className="text-base font-medium text-foreground">
              Please select all benefits which are being received within the household: *
            </Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto bg-muted/50 p-3 rounded">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center space-x-2">
                  <Checkbox
                    id={benefit}
                    checked={formData.benefits.includes(benefit)}
                    onCheckedChange={(checked) => handleBenefitChange(benefit, checked as boolean)}
                  />
                  <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="none-apply"
                  checked={formData.benefits.includes("None Apply")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFormData({ benefits: ["None Apply"] });
                    } else {
                      updateFormData({ benefits: [] });
                    }
                  }}
                />
                <Label htmlFor="none-apply" className="text-sm font-medium">None Apply</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-medium text-foreground">
                How many adults are living at the property? *
              </Label>
              <RadioGroup 
                value={formData.adults} 
                onValueChange={(value) => updateFormData({ adults: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="adults-1" />
                  <Label htmlFor="adults-1">1 Adult</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2+" id="adults-2" />
                  <Label htmlFor="adults-2">2+ Adults</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium text-foreground">
                How many children are living at the property? *
              </Label>
              <RadioGroup 
                value={formData.children} 
                onValueChange={(value) => updateFormData({ children: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="children-0" />
                  <Label htmlFor="children-0">No Children</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="children-1" />
                  <Label htmlFor="children-1">1 Child</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2+" id="children-2" />
                  <Label htmlFor="children-2">2+ Children</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          variant="hero"
          size="lg"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
};