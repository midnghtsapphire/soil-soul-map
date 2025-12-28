import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapPreview = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Explore the{" "}
              <span className="text-primary">Interactive Map</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our interactive map makes it easy to discover regenerative farms,
              farmers' markets, and farm-to-table restaurants in your area.
              Filter by distance, product type, and farming practices.
            </p>
            <ul className="space-y-4">
              {[
                "Real-time availability and seasonal updates",
                "Verified regenerative practices badges",
                "Direct contact with farmers and producers",
                "Save favorites and plan your visits",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="gap-2">
              <MapPin className="w-5 h-5" />
              Open Full Map
            </Button>
          </div>

          {/* Map Preview */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card bg-card border border-border">
            {/* Map Placeholder with styled design */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage/30 via-muted to-wheat/30">
              {/* Grid Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Sample Markers */}
              <div className="absolute top-[30%] left-[25%] animate-pulse-soft">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              <div className="absolute top-[45%] left-[55%] animate-pulse-soft" style={{ animationDelay: "300ms" }}>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4 text-secondary-foreground" />
                </div>
              </div>
              <div className="absolute top-[60%] left-[35%] animate-pulse-soft" style={{ animationDelay: "600ms" }}>
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4 text-accent-foreground" />
                </div>
              </div>
              <div className="absolute top-[25%] left-[70%] animate-pulse-soft" style={{ animationDelay: "450ms" }}>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              <div className="absolute top-[70%] left-[65%] animate-pulse-soft" style={{ animationDelay: "150ms" }}>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4 text-secondary-foreground" />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-6 p-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Farms</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-muted-foreground">Markets</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-muted-foreground">Restaurants</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapPreview;
