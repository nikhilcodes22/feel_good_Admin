import { 
  MapPin, 
  Bell, 
  Calendar, 
  Users, 
  Shield, 
  Megaphone,
  Sparkles,
  Clock
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Location-Based Discovery",
    description: "Find volunteer opportunities near you. Our smart algorithm shows events within your preferred distance.",
    color: "primary",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get alerted about events matching your interests. Receive reminders 3 days before your enrolled events.",
    color: "secondary",
  },
  {
    icon: Calendar,
    title: "Recurring Events",
    description: "Automatic event creation for recurring programs. Never miss a regular volunteer opportunity.",
    color: "accent",
  },
  {
    icon: Users,
    title: "Volunteer Pool Management",
    description: "Organizations can manage their core volunteers and internal programs in one unified platform.",
    color: "primary",
  },
  {
    icon: Shield,
    title: "Private & Public Events",
    description: "Create internal events for your core team or public events to attract new volunteers.",
    color: "secondary",
  },
  {
    icon: Megaphone,
    title: "Free Marketing",
    description: "Get free publicity for your social service events. Reach thousands of potential volunteers.",
    color: "accent",
  },
  {
    icon: Sparkles,
    title: "Preference Matching",
    description: "Set your preferences for organization types, time slots, and causes. We'll match you perfectly.",
    color: "primary",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Volunteer on your own terms. Filter by time slots that fit your busy schedule.",
    color: "secondary",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Everything You Need to Make a Difference
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive platform designed for both volunteers and organizations to connect, 
            collaborate, and create lasting impact in their communities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                feature.color === "primary" ? "bg-primary/10" :
                feature.color === "secondary" ? "bg-secondary/10" :
                "bg-accent/10"
              }`}>
                <feature.icon className={`w-6 h-6 ${
                  feature.color === "primary" ? "text-primary" :
                  feature.color === "secondary" ? "text-secondary" :
                  "text-accent"
                }`} />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
