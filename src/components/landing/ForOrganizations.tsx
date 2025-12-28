import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Calendar, 
  Bell, 
  BarChart3, 
  Shield,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const benefits = [
  "Free event promotion to thousands of volunteers",
  "Manage public and private volunteer pools",
  "Automatic recurring event scheduling",
  "Real-time volunteer enrollment notifications",
  "Volunteer tracking and analytics",
  "WhatsApp and email notifications",
];

const ForOrganizations = () => {
  return (
    <section id="organizations" className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              For Organizations
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Reach Volunteers Who Want to Help
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're a temple, NGO, orphanage, or any social service institution, 
              FeelGood connects you with passionate volunteers ready to support your cause.
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" className="gradient-secondary border-0 shadow-soft hover:shadow-medium transition-all">
              Register Your Organization
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Visual Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
                  <Building2 className="w-10 h-10 text-secondary mb-4" />
                  <h4 className="font-display font-semibold text-foreground mb-2">Easy Setup</h4>
                  <p className="text-sm text-muted-foreground">Register and start posting events in minutes</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
                  <Calendar className="w-10 h-10 text-primary mb-4" />
                  <h4 className="font-display font-semibold text-foreground mb-2">Event Management</h4>
                  <p className="text-sm text-muted-foreground">Create, schedule, and manage all your events</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
                  <Users className="w-10 h-10 text-accent mb-4" />
                  <h4 className="font-display font-semibold text-foreground mb-2">Volunteer Pool</h4>
                  <p className="text-sm text-muted-foreground">Build and manage your dedicated volunteer base</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
                  <BarChart3 className="w-10 h-10 text-secondary mb-4" />
                  <h4 className="font-display font-semibold text-foreground mb-2">Analytics</h4>
                  <p className="text-sm text-muted-foreground">Track engagement and volunteer participation</p>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForOrganizations;
