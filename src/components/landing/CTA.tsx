import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8">
            <Heart className="w-4 h-4 text-primary-foreground fill-current" />
            <span className="text-sm font-medium text-primary-foreground">Join the Movement</span>
          </div>

          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-primary-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 md:mb-9">
            Join thousands of volunteers and organizations already using FeelGood 
            to create positive change in their communities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Pre-launch: previous CTA buttons hidden */}
            {/**
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-medium text-base px-8 py-6 h-auto"
            >
              <Users className="w-5 h-5 mr-2" />
              I Want to Volunteer
            </Button>
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-medium text-base px-8 py-6 h-auto"
            >
              Register Organization
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            */}

            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-medium text-base px-8 py-6 h-auto"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
