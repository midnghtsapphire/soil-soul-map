import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import InteractiveMap from "./InteractiveMap";

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

          {/* Interactive Map */}
          <InteractiveMap className="aspect-[4/3]" />
        </div>
      </div>
    </section>
  );
};

export default MapPreview;
