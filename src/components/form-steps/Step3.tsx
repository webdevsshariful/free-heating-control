import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "../MultiStepForm";

interface Step3Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const Step3 = ({ formData, updateFormData, onPrev, onSubmit, isSubmitting }: Step3Props) => {
  const canSubmit = formData.firstName && formData.lastName && formData.email && formData.phone && formData.preferredContact;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Contact Details</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-base font-medium text-foreground">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateFormData({ firstName: e.target.value })}
                placeholder="Enter your first name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-base font-medium text-foreground">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateFormData({ lastName: e.target.value })}
                placeholder="Enter your last name"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-medium text-foreground">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="Enter your email address"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-base font-medium text-foreground">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="Enter your phone number"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-base font-medium text-foreground">
              How would you prefer to be contacted? *
            </Label>
            <RadioGroup 
              value={formData.preferredContact} 
              onValueChange={(value) => updateFormData({ preferredContact: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="contact-phone" />
                <Label htmlFor="contact-phone">Phone call</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="contact-email" />
                <Label htmlFor="contact-email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="contact-text" />
                <Label htmlFor="contact-text">Text message</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium text-foreground">
              What's the best time to contact you?
            </Label>
            <RadioGroup 
              value={formData.contactTime} 
              onValueChange={(value) => updateFormData({ contactTime: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="morning" id="time-morning" />
                <Label htmlFor="time-morning">Morning (9am - 12pm)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="afternoon" id="time-afternoon" />
                <Label htmlFor="time-afternoon">Afternoon (12pm - 5pm)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evening" id="time-evening" />
                <Label htmlFor="time-evening">Evening (5pm - 8pm)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="anytime" id="time-anytime" />
                <Label htmlFor="time-anytime">Anytime</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              By submitting this form, you consent to being contacted by Free Heating Control 
              regarding your application for a free boiler replacement. We will use your information 
              to assess your eligibility and arrange a free survey if applicable.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" size="lg">
          Previous
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={!canSubmit || isSubmitting}
          variant="hero"
          size="lg"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
};