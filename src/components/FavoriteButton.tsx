import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  listingId: string;
  variant?: "icon" | "default";
  className?: string;
}

const FavoriteButton = ({ listingId, variant = "icon", className }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { data: favorites = [] } = useUserFavorites(user?.id);
  const toggleFavorite = useToggleFavorite();
  
  const isFavorite = favorites.some(f => f.listing_id === listingId);

  if (!user) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite.mutate({ listingId, isFavorite });
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={toggleFavorite.isPending}
        className={cn(
          "p-2 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 transition-all hover:scale-110",
          isFavorite && "bg-destructive/10 border-destructive/50",
          className
        )}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-colors",
            isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
          )}
        />
      </button>
    );
  }

  return (
    <Button
      variant={isFavorite ? "destructive" : "outline"}
      onClick={handleClick}
      disabled={toggleFavorite.isPending}
      className={cn("gap-2", className)}
    >
      <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
      {isFavorite ? "Saved" : "Save"}
    </Button>
  );
};

export default FavoriteButton;
