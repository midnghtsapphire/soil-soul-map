import { useState } from "react";
import ListingCard from "./ListingCard";
import { Button } from "@/components/ui/button";
import { Sprout, Store, UtensilsCrossed } from "lucide-react";

const categories = [
  { id: "all", name: "All", icon: null },
  { id: "farm", name: "Farms", icon: Sprout },
  { id: "market", name: "Markets", icon: Store },
  { id: "restaurant", name: "Restaurants", icon: UtensilsCrossed },
];

const sampleListings = [
  {
    id: 1,
    type: "farm" as const,
    name: "Sunrise Valley Farm",
    location: "Boulder, CO",
    distance: "4.2 mi",
    rating: 4.9,
    reviewCount: 127,
    tags: ["Vegetables", "Pasture-Raised Eggs", "No-Till"],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
    hours: "Open Sat-Sun 8am-2pm",
  },
  {
    id: 2,
    type: "market" as const,
    name: "Green Valley Farmers Market",
    location: "Denver, CO",
    distance: "2.1 mi",
    rating: 4.7,
    reviewCount: 89,
    tags: ["Weekly Market", "Local Produce", "Artisan Goods"],
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop",
    hours: "Every Saturday 7am-1pm",
  },
  {
    id: 3,
    type: "restaurant" as const,
    name: "Root & Branch Kitchen",
    location: "Fort Collins, CO",
    distance: "5.8 mi",
    rating: 4.8,
    reviewCount: 203,
    tags: ["Farm-to-Table", "Seasonal Menu", "Organic Wine"],
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    hours: "Tue-Sun 5pm-10pm",
  },
  {
    id: 4,
    type: "farm" as const,
    name: "Heritage Meadows",
    location: "Longmont, CO",
    distance: "8.3 mi",
    rating: 4.6,
    reviewCount: 64,
    tags: ["Grass-Fed Beef", "Raw Dairy", "Cover Crops"],
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&h=400&fit=crop",
    hours: "By appointment",
  },
  {
    id: 5,
    type: "market" as const,
    name: "Mountain Fresh Co-op",
    location: "Golden, CO",
    distance: "6.5 mi",
    rating: 4.8,
    reviewCount: 156,
    tags: ["Organic", "Bulk Foods", "Local Meat"],
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
    hours: "Daily 9am-7pm",
  },
  {
    id: 6,
    type: "restaurant" as const,
    name: "Soil & Seed Café",
    location: "Boulder, CO",
    distance: "3.2 mi",
    rating: 4.9,
    reviewCount: 178,
    tags: ["Breakfast", "Vegan Options", "Zero Waste"],
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop",
    hours: "Daily 7am-3pm",
  },
];

const FeaturedListings = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredListings =
    activeCategory === "all"
      ? sampleListings
      : sampleListings.filter((listing) => listing.type === activeCategory);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing, index) => (
            <div
              key={listing.id}
              className="animate-fade-in-up opacity-0"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <ListingCard {...listing} />
            </div>
          ))}
        </div>

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
