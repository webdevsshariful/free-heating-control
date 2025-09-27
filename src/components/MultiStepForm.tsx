import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Step1 } from "./form-steps/Step1";
import { Step2 } from "./form-steps/Step2";
import { Step3 } from "./form-steps/Step3";

export interface FormData {
  // Step 1
  propertyRelationship: string;
  benefits: string[];
  adults: string;
  children: string;
  
  // Step 2
  postcode: string;
  address: string;
  hasGas: string;
  currentHeating: string;
  boilerAge: string;
  
  // Step 3
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: string;
  contactTime: string;
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
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredContact: "",
  contactTime: "",
};

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    
    try {
      // Format the form data for email
      const emailContent = `
        Free Heating Control - New Application
        
        STEP 1 - ABOUT YOU
        Property Relationship: ${formData.propertyRelationship}
        Benefits: ${formData.benefits.join(', ') || 'None'}
        Adults in Property: ${formData.adults}
        Children in Property: ${formData.children}
        
        STEP 2 - PROPERTY DETAILS
        Postcode: ${formData.postcode}
        Address: ${formData.address}
        Mains Gas Available: ${formData.hasGas}
        Current Heating: ${formData.currentHeating}
        Boiler Age: ${formData.boilerAge}
        
        STEP 3 - CONTACT DETAILS
        Name: ${formData.firstName} ${formData.lastName}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Preferred Contact: ${formData.preferredContact}
        Best Time to Call: ${formData.contactTime}
        
        Submitted: ${new Date().toLocaleString()}
      `;

      // Using a simple mailto approach for now
      // In production, you'd want to use a proper email service
      const mailtoLink = `mailto:sharifulhridoy01@gmail.com?subject=Free Heating Control - New Application from ${formData.firstName} ${formData.lastName}&body=${encodeURIComponent(emailContent)}`;
      
      // Open default email client
      window.location.href = mailtoLink;
      
      toast({
        title: "Application Submitted!",
        description: "Thank you for your application. We'll be in touch within 24 hours.",
      });

      // Reset form
      setFormData(initialFormData);
      setCurrentStep(1);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
      case 2:
        return <Step2 formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <Step3 formData={formData} updateFormData={updateFormData} onPrev={prevStep} onSubmit={submitForm} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <section id="eligibility-form" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-[var(--shadow-card)] border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">Apply for Free Boiler</CardTitle>
              <div className="space-y-2">
                <p className="text-muted-foreground">Step {currentStep} of {totalSteps}</p>
                <Progress value={progress} className="w-full" />
              </div>
            </CardHeader>
            <CardContent>
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MultiStepForm;