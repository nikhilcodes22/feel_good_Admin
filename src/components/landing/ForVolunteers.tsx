import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MapPin, 
  Clock, 
  Star, 
  Trophy,
  ArrowRight
} from "lucide-react";

const ForVolunteers = () => {
  return (
    <section id="volunteers" className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual - Phone Mockup Style */}
          <div className="relative order-2 lg:order-1">
            <div className="relative max-w-sm mx-auto">
              {/* Phone Frame */}
              <div className="bg-card rounded-[2.5rem] p-3 shadow-medium border border-border/50">
                <div className="bg-muted rounded-[2rem] overflow-hidden">
                  {/* App Header */}
                  <div className="bg-primary px-6 py-8 text-primary-foreground">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="w-6 h-6 fill-current" />
                      <span className="font-display font-bold">FeelGood</span>
                    </div>
                    <h3 className="font-display font-bold text-xl mb-1">Good morning, Sarah!</h3>
                    <p className="text-sm opacity-90">3 events near you today</p>
                  </div>
                  
                  {/* Event Cards */}
                  <div className="p-4 space-y-3">
                    {[
                      { title: "Beach Cleanup Drive", org: "Green Earth Foundation", time: "9:00 AM", distance: "2.5 km" },
                      { title: "Food Distribution", org: "City Care NGO", time: "12:00 PM", distance: "1.8 km" },
                      { title: "Teaching Session", org: "Bright Future School", time: "3:00 PM", distance: "3.2 km" },
                    ].map((event, i) => (
                      <div key={i} className="bg-card rounded-xl p-4 shadow-soft border border-border/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground text-sm">{event.title}</h4>
                            <p className="text-xs text-muted-foreground">{event.org}</p>
                          </div>
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{event.distance} away</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -right-4 top-1/4 bg-card rounded-xl p-3 shadow-medium border border-border/50 animate-float">
                <div className="flex items-center gap-2">
                  <Trophy className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">This month</p>
                    <p className="font-display font-bold text-foreground">12 hrs</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-4 bottom-1/4 bg-card rounded-xl p-3 shadow-medium border border-border/50 animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-primary fill-primary" />
                  <span className="font-display font-bold text-foreground">4.9</span>
                  <span className="text-xs text-muted-foreground">rating</span>
                </div>
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              For Volunteers
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Find Purpose in Every Free Moment
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Download the FeelGood app and discover meaningful volunteer opportunities 
              that fit your schedule, interests, and location.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Local First</h4>
                  <p className="text-sm text-muted-foreground">Events near your location</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Flexible Hours</h4>
                  <p className="text-sm text-muted-foreground">Volunteer on your terms</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Match Interests</h4>
                  <p className="text-sm text-muted-foreground">Causes you care about</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Track Impact</h4>
                  <p className="text-sm text-muted-foreground">See your contribution</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="gradient-primary border-0 shadow-glow hover:shadow-medium transition-all">
              Download the App
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForVolunteers;
