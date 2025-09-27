import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "../MultiStepForm";

interface Step2Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2 = ({ formData, updateFormData, onNext, onPrev }: Step2Props) => {
  const canProceed = formData.postcode && formData.address && formData.hasGas && formData.currentHeating;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Property Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="postcode" className="text-base font-medium text-foreground">
              Property Postcode *
            </Label>
            <Input
              id="postcode"
              value={formData.postcode}
              onChange={(e) => updateFormData({ postcode: e.target.value })}
              placeholder="Enter your postcode"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-base font-medium text-foreground">
              Full Property Address *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              placeholder="Enter your full address"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-base font-medium text-foreground">
              Does your property have mains gas available? *
            </Label>
            <RadioGroup 
              value={formData.hasGas} 
              onValueChange={(value) => updateFormData({ hasGas: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="gas-yes" />
                <Label htmlFor="gas-yes">Yes, we have mains gas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="gas-no" />
                <Label htmlFor="gas-no">No, we don't have mains gas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsure" id="gas-unsure" />
                <Label htmlFor="gas-unsure">I'm not sure</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-foreground">
              What type of heating system do you currently have? *
            </Label>
            <RadioGroup 
              value={formData.currentHeating} 
              onValueChange={(value) => updateFormData({ currentHeating: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gas-boiler" id="heating-gas" />
                <Label htmlFor="heating-gas">Gas boiler</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oil-boiler" id="heating-oil" />
                <Label htmlFor="heating-oil">Oil boiler</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lpg-boiler" id="heating-lpg" />
                <Label htmlFor="heating-lpg">LPG boiler</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="electric" id="heating-electric" />
                <Label htmlFor="heating-electric">Electric heating</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="heating-none" />
                <Label htmlFor="heating-none">No central heating</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="heating-other" />
                <Label htmlFor="heating-other">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-foreground">
              How old is your current boiler (approximately)?
            </Label>
            <RadioGroup 
              value={formData.boilerAge} 
              onValueChange={(value) => updateFormData({ boilerAge: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0-5" id="age-0-5" />
                <Label htmlFor="age-0-5">0-5 years</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6-10" id="age-6-10" />
                <Label htmlFor="age-6-10">6-10 years</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="11-15" id="age-11-15" />
                <Label htmlFor="age-11-15">11-15 years</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="16+" id="age-16" />
                <Label htmlFor="age-16">16+ years</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="age-unknown" />
                <Label htmlFor="age-unknown">I don't know</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" size="lg">
          Previous
        </Button>
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