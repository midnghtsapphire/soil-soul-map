import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Clock, CheckCircle, Sprout, Store, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useListing } from "@/hooks/useListings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";

const defaultImages = {
  farm: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=600&fit=crop",
  market: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=600&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop",
};

const typeConfig = {
  farm: { label: "Farm", icon: Sprout, color: "text-primary" },
  market: { label: "Farmers Market", icon: Store, color: "text-accent" },
  restaurant: { label: "Restaurant", icon: UtensilsCrossed, color: "text-warm" },
};

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading, error } = useListing(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Listing Not Found</h1>
          <p className="text-muted-foreground mb-6">The listing you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </main>
      </div>
    );
  }

  const TypeIcon = typeConfig[listing.type].icon;
  const imageUrl = listing.image_url || defaultImages[listing.type];
  const mapUrl = `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link to="/" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </Link>
        </Button>

        {/* Hero Image */}
        <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
          <img
            src={imageUrl}
            alt={listing.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge variant={listing.type === "farm" ? "farm" : listing.type === "market" ? "market" : "restaurant"} className="gap-1.5">
              <TypeIcon className="w-4 h-4" />
              {typeConfig[listing.type].label}
            </Badge>
            {listing.is_verified && (
              <Badge variant="secondary" className="gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Location */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
                {listing.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>{listing.address}, {listing.city}, {listing.state} {listing.zip_code}</span>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Practices */}
            {listing.practices && listing.practices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regenerative Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {listing.practices.map((practice) => (
                      <Badge key={practice} variant="muted">
                        {practice}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products */}
            {listing.products && listing.products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Products & Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {listing.products.map((product) => (
                      <Badge key={product} variant="secondary">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <ReviewSection listingId={listing.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {listing.phone && (
                  <a href={`tel:${listing.phone}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    {listing.phone}
                  </a>
                )}
                {listing.email && (
                  <a href={`mailto:${listing.email}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    {listing.email}
                  </a>
                )}
                {listing.website && (
                  <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    Visit Website
                  </a>
                )}
                {!listing.phone && !listing.email && !listing.website && (
                  <p className="text-muted-foreground text-sm">No contact information provided.</p>
                )}
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-4">
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${listing.latitude},${listing.longitude}&zoom=14`}
                  />
                </div>
                <Button asChild variant="outline" className="w-full gap-2">
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ListingDetail;
