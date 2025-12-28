import { useState } from "react";
import ListingCard from "./ListingCard";
import { Button } from "@/components/ui/button";
import { Sprout, Store, UtensilsCrossed } from "lucide-react";
import { useListings } from "@/hooks/useListings";

const categories = [
  { id: "all", name: "All", icon: null },
  { id: "farm", name: "Farms", icon: Sprout },
  { id: "market", name: "Markets", icon: Store },
  { id: "restaurant", name: "Restaurants", icon: UtensilsCrossed },
];

const defaultImages = {
  farm: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
  market: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
};

const FeaturedListings = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: listings = [], isLoading } = useListings();

  const filteredListings =
    activeCategory === "all"
      ? listings
      : listings.filter((listing) => listing.type === activeCategory);

  return (
    <section id="farms" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Discover Near You
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore farms, markets, and restaurants committed to regenerating
            our food systems and supporting local communities.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="gap-2"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">Loading listings...</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No listings found. Be the first to add one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.slice(0, 6).map((listing, index) => (
              <div
                key={listing.id}
                className="animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
              <ListingCard
                  id={listing.id}
                  type={listing.type}
                  name={listing.name}
                  location={`${listing.city}, ${listing.state}`}
                  distance="Nearby"
                  rating={4.5}
                  reviewCount={0}
                  tags={listing.practices?.slice(0, 3) || []}
                  image={listing.image_url || defaultImages[listing.type]}
                />
              </div>
            ))}
          </div>
        )}

        {/* View More CTA */}
        <div className="text-center mt-12">
          <Button variant="warm" size="lg">
            Explore All Listings
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
