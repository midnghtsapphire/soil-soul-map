import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Review {
  id: string;
  listing_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface ReviewInsert {
  listing_id: string;
  rating: number;
  comment?: string;
}

export const useListingReviews = (listingId: string | undefined) => {
  return useQuery({
    queryKey: ["reviews", listingId],
    queryFn: async () => {
      if (!listingId) return [];
      
      // Get reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // Get unique user IDs and fetch profiles
      const userIds = [...new Set(reviews.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);

      // Merge profiles into reviews
      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return reviews.map(review => ({
        ...review,
        profiles: profilesMap.get(review.user_id) || null
      })) as Review[];
    },
    enabled: !!listingId,
  });
};

export const useUserReviewForListing = (listingId: string | undefined, userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-review", listingId, userId],
    queryFn: async () => {
      if (!listingId || !userId) return null;
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("listing_id", listingId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data as Review | null;
    },
    enabled: !!listingId && !!userId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: ReviewInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("reviews")
        .insert({ ...review, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.listing_id] });
      queryClient.invalidateQueries({ queryKey: ["user-review"] });
      queryClient.invalidateQueries({ queryKey: ["listing-stats"] });
      toast.success("Review submitted!");
    },
    onError: (error) => {
      toast.error("Failed to submit review: " + error.message);
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Review> & { id: string }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-review"] });
      queryClient.invalidateQueries({ queryKey: ["listing-stats"] });
      toast.success("Review updated!");
    },
    onError: (error) => {
      toast.error("Failed to update review: " + error.message);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-review"] });
      queryClient.invalidateQueries({ queryKey: ["listing-stats"] });
      toast.success("Review deleted!");
    },
    onError: (error) => {
      toast.error("Failed to delete review: " + error.message);
    },
  });
};

export const useListingStats = (listingId: string | undefined) => {
  return useQuery({
    queryKey: ["listing-stats", listingId],
    queryFn: async () => {
      if (!listingId) return { averageRating: 0, reviewCount: 0 };
      
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("listing_id", listingId);

      if (error) throw error;
      
      const reviewCount = data.length;
      const averageRating = reviewCount > 0 
        ? data.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
        : 0;

      return { averageRating, reviewCount };
    },
    enabled: !!listingId,
  });
};
