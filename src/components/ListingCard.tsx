import { Link } from "react-router-dom";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FavoriteButton from "@/components/FavoriteButton";

interface ListingCardProps {
  id?: string;
  type: "farm" | "market" | "restaurant";
  name: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  image: string;
  hours?: string;
}

const ListingCard = ({
  id,
  type,
  name,
  location,
  distance,
  rating,
  reviewCount,
  tags,
  image,
  hours,
}: ListingCardProps) => {
  const typeConfig = {
    farm: { badge: "Farm", variant: "farm" as const },
    market: { badge: "Market", variant: "market" as const },
    restaurant: { badge: "Restaurant", variant: "restaurant" as const },
  };

  const cardContent = (
    <>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={typeConfig[type].variant}>
            {typeConfig[type].badge}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {id && <FavoriteButton listingId={id} />}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-sm">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Title & Location */}
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {location}
          </span>
          <span className="text-border">•</span>
          <span>{distance}</span>
        </div>

        {/* Hours */}
        {hours && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <Clock className="w-4 h-4" />
            <span>{hours}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="muted" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="muted" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        {/* CTA */}
        <Button variant="ghost" className="w-full justify-between group/btn">
          View Details
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </>
  );

  if (id) {
    return (
      <Link to={`/listing/${id}`}>
        <Card variant="elevated" className="overflow-hidden group cursor-pointer">
          {cardContent}
        </Card>
      </Link>
    );
  }

  return (
    <Card variant="elevated" className="overflow-hidden group cursor-pointer">
      {cardContent}
    </Card>
  );
};

export default ListingCard;
