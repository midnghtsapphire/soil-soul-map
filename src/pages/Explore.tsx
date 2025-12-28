import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ListingCard from "@/components/ListingCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useListings, ListingType } from "@/hooks/useListings";

const PRACTICE_OPTIONS = [
  "No-till farming",
  "Cover crops",
  "Rotational grazing",
  "Holistic management",
  "Silvopasture",
  "Composting",
  "Permaculture",
  "Biodynamic",
  "Organic certified",
  "Agroforestry",
];

const defaultImages = {
  farm: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
  market: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
};

const Explore = () => {
  const { data: listings = [], isLoading } = useListings();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("all");

  // Get unique states from listings
  const availableStates = useMemo(() => {
    const states = [...new Set(listings.map(l => l.state))].filter(Boolean).sort();
    return states;
  }, [listings]);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Search query (name, city, description, products)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        listing.name.toLowerCase().includes(searchLower) ||
        listing.city.toLowerCase().includes(searchLower) ||
        listing.state.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower) ||
        listing.products?.some(p => p.toLowerCase().includes(searchLower));

      // Type filter
      const matchesType = selectedType === "all" || listing.type === selectedType;

      // State filter
      const matchesState = selectedState === "all" || listing.state === selectedState;

      // Practices filter (must have ALL selected practices)
      const matchesPractices = selectedPractices.length === 0 || 
        selectedPractices.every(practice => listing.practices?.includes(practice));

      return matchesSearch && matchesType && matchesState && matchesPractices;
    });
  }, [listings, searchQuery, selectedType, selectedState, selectedPractices]);

  const togglePractice = (practice: string) => {
    setSelectedPractices(prev => 
      prev.includes(practice) 
        ? prev.filter(p => p !== practice)
        : [...prev, practice]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedState("all");
    setSelectedPractices([]);
  };

  const hasActiveFilters = searchQuery || selectedType !== "all" || selectedState !== "all" || selectedPractices.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Explore Listings
          </h1>
          <p className="text-muted-foreground text-lg">
            Find regenerative farms, markets, and restaurants near you
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="farm">Farms</SelectItem>
              <SelectItem value="market">Markets</SelectItem>
              <SelectItem value="restaurant">Restaurants</SelectItem>
            </SelectContent>
          </Select>

          {/* State Filter */}
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-full md:w-[160px]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <SelectValue placeholder="State" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {availableStates.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Practices Filter (Mobile Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Practices
                {selectedPractices.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedPractices.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter by Practices</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {PRACTICE_OPTIONS.map(practice => (
                  <div key={practice} className="flex items-center space-x-3">
                    <Checkbox
                      id={practice}
                      checked={selectedPractices.includes(practice)}
                      onCheckedChange={() => togglePractice(practice)}
                    />
                    <Label htmlFor={practice} className="cursor-pointer">
                      {practice}
                    </Label>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </Badge>
            )}
            {selectedType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedType}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedType("all")} />
              </Badge>
            )}
            {selectedState !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedState}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedState("all")} />
              </Badge>
            )}
            {selectedPractices.map(practice => (
              <Badge key={practice} variant="secondary" className="gap-1">
                {practice}
                <X className="w-3 h-3 cursor-pointer" onClick={() => togglePractice(practice)} />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `${filteredListings.length} listing${filteredListings.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">Loading listings...</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No listings match your filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, index) => (
              <div
                key={listing.id}
                className="animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${Math.min(index, 8) * 50}ms`,
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
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
