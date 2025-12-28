import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export const useUserFavorites = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      return data as Favorite[];
    },
    enabled: !!userId,
  });
};

export interface FavoriteWithListing {
  id: string;
  listing_id: string;
  collection_id: string | null;
  listing: any;
}

export const useFavoriteListings = (userId: string | undefined, collectionId?: string | null) => {
  return useQuery({
    queryKey: ["favorite-listings", userId, collectionId],
    queryFn: async () => {
      if (!userId) return [];
      
      let query = supabase
        .from("favorites")
        .select(`
          id,
          listing_id,
          collection_id,
          listings (*)
        `)
        .eq("user_id", userId);

      if (collectionId === "uncategorized") {
        query = query.is("collection_id", null);
      } else if (collectionId && collectionId !== "all") {
        query = query.eq("collection_id", collectionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data?.map(f => ({
        id: f.id,
        listing_id: f.listing_id,
        collection_id: f.collection_id,
        listing: f.listings,
      })).filter(f => f.listing) ?? [];
    },
    enabled: !!userId,
  });
};

export const useIsFavorite = (listingId: string | undefined, userId: string | undefined) => {
  const { data: favorites = [] } = useUserFavorites(userId);
  return favorites.some(f => f.listing_id === listingId);
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, isFavorite }: { listingId: string; isFavorite: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (isFavorite) {
        // Remove favorite
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", listingId);
        if (error) throw error;
      } else {
        // Add favorite
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, listing_id: listingId });
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(variables.isFavorite ? "Removed from favorites" : "Added to favorites");
    },
    onError: (error) => {
      toast.error("Failed to update favorites: " + error.message);
    },
  });
};
