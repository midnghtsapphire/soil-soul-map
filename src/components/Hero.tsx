import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-farm.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Regenerative farm with rolling green hills and sustainable crops"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-sm font-medium border border-primary-foreground/20">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
              Discover 2,500+ Regenerative Farms Near You
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up opacity-0 font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-primary-foreground leading-tight" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            Find Food That{" "}
            <span className="italic text-wheat">Heals the Earth</span>
          </h1>

          {/* Subheading */}
          <p className="animate-fade-in-up opacity-0 text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            Connect with local farms, farmers' markets, and restaurants practicing
            regenerative agriculture. Support soil health, biodiversity, and your
            community.
          </p>

          {/* Search Bar */}
          <div className="animate-fade-in-up opacity-0 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter your city or zip code..."
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card/95 backdrop-blur-sm text-foreground placeholder:text-muted-foreground border-0 shadow-card focus:outline-none focus:ring-2 focus:ring-primary font-body text-base"
              />
            </div>
            <Button variant="hero" className="w-full sm:w-auto h-14">
              <Search className="w-5 h-5" />
              Find Farms
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up opacity-0 flex flex-wrap justify-center gap-8 pt-8" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
            {[
              { value: "2,500+", label: "Farms Listed" },
              { value: "850+", label: "Markets" },
              { value: "400+", label: "Restaurants" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-semibold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/60 animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
