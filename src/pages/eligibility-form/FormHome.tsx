import ContactCTA from '@/components/ContactCTA';
import EligibilitySection from '@/components/EligibilitySection';
import Header2 from '@/components/Header2';
import MultiStepForm from '@/components/MultiStepForm';
import ReferralForm from '@/components/ReferralForm';
import { Button } from '@/components/ui/button';
import React from 'react';

const FormHome = () => {
  return (
    <>
      <Header2 />
      <div className='flex justify-center mt-4'>
        <Button asChild variant="outline">
          <a
            href="#referral-form"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            Refer A friend
          </a>
        </Button>
      </div>
      <MultiStepForm />
      <ReferralForm />
      <ContactCTA />
    </>
  );
};

export default FormHome;