import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, MapPin, ArrowUpDown, Heart } from "lucide-react";
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
import { useFavoriteListings } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useAllListingStats } from "@/hooks/useReviews";
import { Link } from "react-router-dom";

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

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: listings = [], isLoading } = useFavoriteListings(user?.id);
  const { data: statsMap = {} } = useAllListingStats();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Get unique states from listings
  const availableStates = useMemo(() => {
    const states = [...new Set(listings.map((l: any) => l.state))].filter(Boolean).sort();
    return states as string[];
  }, [listings]);

  // Filter listings
  const filteredListings = useMemo(() => {
    let result = listings.filter((listing: any) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        listing.name.toLowerCase().includes(searchLower) ||
        listing.city.toLowerCase().includes(searchLower) ||
        listing.state.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower) ||
        listing.products?.some((p: string) => p.toLowerCase().includes(searchLower));

      const matchesType = selectedType === "all" || listing.type === selectedType;
      const matchesState = selectedState === "all" || listing.state === selectedState;
      const matchesPractices = selectedPractices.length === 0 || 
        selectedPractices.every(practice => listing.practices?.includes(practice));

      return matchesSearch && matchesType && matchesState && matchesPractices;
    });

    switch (sortBy) {
      case "rating":
        result = [...result].sort((a: any, b: any) => {
          const ratingA = statsMap[a.id]?.averageRating || 0;
          const ratingB = statsMap[b.id]?.averageRating || 0;
          return ratingB - ratingA;
        });
        break;
      case "name":
        result = [...result].sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result = [...result].sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return result;
  }, [listings, searchQuery, selectedType, selectedState, selectedPractices, sortBy, statsMap]);

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

  // Not logged in state
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
              Sign in to view your favorites
            </h1>
            <p className="text-muted-foreground mb-6">
              Save and organize your favorite farms, markets, and restaurants
            </p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              My Favorites
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your saved regenerative farms, markets, and restaurants
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

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
                      id={`fav-${practice}`}
                      checked={selectedPractices.includes(practice)}
                      onCheckedChange={() => togglePractice(practice)}
                    />
                    <Label htmlFor={`fav-${practice}`} className="cursor-pointer">
                      {practice}
                    </Label>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[160px]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `${filteredListings.length} favorite${filteredListings.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Listings Grid */}
        {isLoading || authLoading ? (
          <div className="text-center text-muted-foreground py-12">Loading favorites...</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16">
            {listings.length === 0 ? (
              <>
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-4">You haven't saved any favorites yet</p>
                <Button asChild>
                  <Link to="/explore">Explore Listings</Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-lg mb-4">No favorites match your filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing: any, index: number) => {
              const stats = statsMap[listing.id] || { averageRating: 0, reviewCount: 0 };
              return (
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
                    rating={stats.averageRating}
                    reviewCount={stats.reviewCount}
                    tags={listing.practices?.slice(0, 3) || []}
                    image={listing.image_url || defaultImages[listing.type as keyof typeof defaultImages]}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
