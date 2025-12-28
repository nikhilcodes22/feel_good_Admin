import { UserPlus, Search, CalendarCheck, Heart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up and set your preferences - location, interests, availability, and the causes you care about most.",
    color: "primary",
  },
  {
    number: "02",
    icon: Search,
    title: "Discover Opportunities",
    description: "Browse events near you that match your preferences. Filter by distance, organization type, or time slots.",
    color: "secondary",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Enroll & Get Notified",
    description: "One-tap enrollment with instant confirmation. Receive reminders before the event so you're always prepared.",
    color: "accent",
  },
  {
    number: "04",
    icon: Heart,
    title: "Make an Impact",
    description: "Show up, contribute, and feel good about making a difference. Track your volunteer hours and impact.",
    color: "primary",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Start Volunteering in Minutes
          </h2>
          <p className="text-lg text-muted-foreground">
            Our simple process gets you connected with meaningful volunteer opportunities 
            faster than ever before.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/3 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-20" />
          
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="flex flex-col items-center text-center">
                {/* Step Number */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10 ${
                  step.color === "primary" ? "gradient-primary" :
                  step.color === "secondary" ? "gradient-secondary" :
                  "bg-accent"
                }`}>
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                
                {/* Number Badge */}
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center text-xs font-bold text-muted-foreground z-20">
                  {step.number}
                </span>

                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
