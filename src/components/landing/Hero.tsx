import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">World's First Social Platform for Volunteers</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-tight mb-6 animate-fade-in-up text-balance" style={{ animationDelay: "0.1s" }}>
            Turn Your Free Time Into{" "}
            <span className="text-primary">Meaningful Impact</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Connect with organizations that need your help. Whether you have an hour or a day, 
            discover volunteer opportunities that match your skills, location, and schedule.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="gradient-primary border-0 shadow-glow hover:shadow-medium transition-all text-base px-8 py-6 h-auto">
              Start Volunteering
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6 h-auto border-2">
              Register Organization
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card shadow-soft border border-border/50">
              <Users className="w-8 h-8 text-primary mb-3" />
              <span className="font-display font-bold text-3xl text-foreground">10K+</span>
              <span className="text-sm text-muted-foreground">Active Volunteers</span>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card shadow-soft border border-border/50">
              <Building2 className="w-8 h-8 text-secondary mb-3" />
              <span className="font-display font-bold text-3xl text-foreground">500+</span>
              <span className="text-sm text-muted-foreground">Organizations</span>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card shadow-soft border border-border/50">
              <Sparkles className="w-8 h-8 text-accent mb-3" />
              <span className="font-display font-bold text-3xl text-foreground">50K+</span>
              <span className="text-sm text-muted-foreground">Volunteer Hours</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
