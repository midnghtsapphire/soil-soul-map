import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export const useCollections = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["collections", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Collection[];
    },
    enabled: !!userId,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("collections")
        .insert({ user_id: user.id, name: name.trim() })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection created");
    },
    onError: (error) => {
      toast.error("Failed to create collection: " + error.message);
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from("collections")
        .update({ name: name.trim() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection updated");
    },
    onError: (error) => {
      toast.error("Failed to update collection: " + error.message);
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-listings"] });
      toast.success("Collection deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete collection: " + error.message);
    },
  });
};

export const useAssignToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ favoriteId, collectionId }: { favoriteId: string; collectionId: string | null }) => {
      const { error } = await supabase
        .from("favorites")
        .update({ collection_id: collectionId })
        .eq("id", favoriteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorite-listings"] });
      toast.success("Favorite updated");
    },
    onError: (error) => {
      toast.error("Failed to update favorite: " + error.message);
    },
  });
};
