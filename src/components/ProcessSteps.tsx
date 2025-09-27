import applyIcon from "@/assets/apply-online-icon.jpg";
import surveyIcon from "@/assets/survey-icon.jpg";
import installIcon from "@/assets/install-icon.jpg";
import warmthIcon from "@/assets/warmth-icon.jpg";

const ProcessSteps = () => {
  const steps = [
    {
      icon: applyIcon,
      title: "Apply online in 60 seconds",
      description: "Quick and easy online application form"
    },
    {
      icon: surveyIcon,
      title: "Book your FREE survey",
      description: "Professional assessment of your property"
    },
    {
      icon: installIcon,
      title: "Have your new boiler fitted",
      description: "Expert installation by certified engineers"
    },
    {
      icon: warmthIcon,
      title: "Enjoy reliable warmth",
      description: "Efficient heating for your home"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-[var(--shadow-card)] flex items-center justify-center p-4">
                <img 
                  src={step.icon} 
                  alt={step.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;