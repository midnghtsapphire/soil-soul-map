import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, MapPin, ArrowUpDown, Heart, FolderPlus, Folder, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ListingCard from "@/components/ListingCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFavoriteListings } from "@/hooks/useFavorites";
import { useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection, useAssignToCollection } from "@/hooks/useCollections";
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
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const { data: favoritesData = [], isLoading } = useFavoriteListings(user?.id, selectedCollection);
  const { data: collections = [] } = useCollections(user?.id);
  const { data: statsMap = {} } = useAllListingStats();
  
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();
  const assignToCollection = useAssignToCollection();

  // Collection form state
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingCollection, setEditingCollection] = useState<{ id: string; name: string } | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Extract listings from favorites data
  const listings = useMemo(() => favoritesData.map(f => f.listing), [favoritesData]);

  // Get unique states from listings
  const availableStates = useMemo(() => {
    const states = [...new Set(listings.map((l: any) => l?.state))].filter(Boolean).sort();
    return states as string[];
  }, [listings]);

  // Filter listings
  const filteredFavorites = useMemo(() => {
    let result = favoritesData.filter((fav) => {
      const listing = fav.listing;
      if (!listing) return false;
      
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
        result = [...result].sort((a, b) => {
          const ratingA = statsMap[a.listing?.id]?.averageRating || 0;
          const ratingB = statsMap[b.listing?.id]?.averageRating || 0;
          return ratingB - ratingA;
        });
        break;
      case "name":
        result = [...result].sort((a, b) => (a.listing?.name || "").localeCompare(b.listing?.name || ""));
        break;
      case "newest":
      default:
        result = [...result].sort((a, b) => 
          new Date(b.listing?.created_at || 0).getTime() - new Date(a.listing?.created_at || 0).getTime()
        );
        break;
    }

    return result;
  }, [favoritesData, searchQuery, selectedType, selectedState, selectedPractices, sortBy, statsMap]);

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

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection.mutate({ name: newCollectionName }, {
        onSuccess: () => {
          setNewCollectionName("");
          setCreateDialogOpen(false);
        }
      });
    }
  };

  const handleUpdateCollection = () => {
    if (editingCollection && editingCollection.name.trim()) {
      updateCollection.mutate({ id: editingCollection.id, name: editingCollection.name }, {
        onSuccess: () => {
          setEditingCollection(null);
          setEditDialogOpen(false);
        }
      });
    }
  };

  const handleDeleteCollection = (id: string) => {
    deleteCollection.mutate(id, {
      onSuccess: () => {
        if (selectedCollection === id) {
          setSelectedCollection("all");
        }
      }
    });
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

        {/* Collections Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-medium text-foreground flex items-center gap-2">
              <Folder className="w-5 h-5" />
              Collections
            </h2>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <FolderPlus className="w-4 h-4" />
                  New Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Collection</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="collection-name">Collection Name</Label>
                  <Input
                    id="collection-name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g., Weekend trips, Local picks"
                    className="mt-2"
                    maxLength={50}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleCreateCollection} 
                    disabled={!newCollectionName.trim() || createCollection.isPending}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCollection === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCollection("all")}
            >
              All Favorites
            </Button>
            <Button
              variant={selectedCollection === "uncategorized" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCollection("uncategorized")}
            >
              Uncategorized
            </Button>
            {collections.map((collection) => (
              <div key={collection.id} className="flex items-center gap-1">
                <Button
                  variant={selectedCollection === collection.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCollection(collection.id)}
                >
                  {collection.name}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingCollection({ id: collection.id, name: collection.name });
                        setEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete "{collection.name}". Favorites in this collection will become uncategorized.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCollection(collection.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Collection Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Collection</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="edit-collection-name">Collection Name</Label>
              <Input
                id="edit-collection-name"
                value={editingCollection?.name || ""}
                onChange={(e) => setEditingCollection(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Collection name"
                className="mt-2"
                maxLength={50}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleUpdateCollection} 
                disabled={!editingCollection?.name.trim() || updateCollection.isPending}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
            {isLoading ? "Loading..." : `${filteredFavorites.length} favorite${filteredFavorites.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Listings Grid */}
        {isLoading || authLoading ? (
          <div className="text-center text-muted-foreground py-12">Loading favorites...</div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-16">
            {favoritesData.length === 0 ? (
              <>
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-4">
                  {selectedCollection === "all" 
                    ? "You haven't saved any favorites yet" 
                    : selectedCollection === "uncategorized"
                    ? "No uncategorized favorites"
                    : "No favorites in this collection"}
                </p>
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
            {filteredFavorites.map((fav, index: number) => {
              const listing = fav.listing;
              const stats = statsMap[listing.id] || { averageRating: 0, reviewCount: 0 };
              return (
                <div
                  key={fav.id}
                  className="animate-fade-in-up opacity-0 relative"
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
                  {/* Collection assignment dropdown */}
                  {collections.length > 0 && (
                    <div className="absolute bottom-4 right-4 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="gap-1 shadow-md">
                            <Folder className="w-3 h-3" />
                            {fav.collection_id 
                              ? collections.find(c => c.id === fav.collection_id)?.name || "Move"
                              : "Add to..."}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          {fav.collection_id && (
                            <DropdownMenuItem onClick={() => assignToCollection.mutate({ favoriteId: fav.id, collectionId: null })}>
                              Remove from collection
                            </DropdownMenuItem>
                          )}
                          {collections.filter(c => c.id !== fav.collection_id).map((collection) => (
                            <DropdownMenuItem 
                              key={collection.id}
                              onClick={() => assignToCollection.mutate({ favoriteId: fav.id, collectionId: collection.id })}
                            >
                              {collection.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
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
