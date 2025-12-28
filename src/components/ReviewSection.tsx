import { useState } from "react";
import { Star, User, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  useListingReviews, 
  useUserReviewForListing, 
  useCreateReview, 
  useUpdateReview, 
  useDeleteReview,
  useListingStats 
} from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface ReviewSectionProps {
  listingId: string;
}

const StarRating = ({ 
  rating, 
  onRatingChange, 
  interactive = false,
  size = "md"
}: { 
  rating: number; 
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md";
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={interactive ? "cursor-pointer" : "cursor-default"}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onRatingChange?.(star)}
        >
          <Star
            className={`${sizeClass} ${
              star <= (hoverRating || rating)
                ? "fill-accent text-accent"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewSection = ({ listingId }: ReviewSectionProps) => {
  const { user } = useAuth();
  const { data: reviews = [], isLoading: reviewsLoading } = useListingReviews(listingId);
  const { data: userReview } = useUserReviewForListing(listingId, user?.id);
  const { data: stats } = useListingStats(listingId);
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    if (isEditing && userReview) {
      await updateReview.mutateAsync({ id: userReview.id, rating, comment: comment || undefined });
      setIsEditing(false);
    } else {
      await createReview.mutateAsync({ listing_id: listingId, rating, comment: comment || undefined });
    }
    setRating(0);
    setComment("");
  };

  const handleEdit = () => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment || "");
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (userReview) {
      await deleteReview.mutateAsync(userReview.id);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setRating(0);
    setComment("");
  };

  const isSubmitting = createReview.isPending || updateReview.isPending;
  const showForm = user && (!userReview || isEditing);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reviews</CardTitle>
          {stats && stats.reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(stats.averageRating)} size="sm" />
              <span className="text-sm text-muted-foreground">
                {stats.averageRating.toFixed(1)} ({stats.reviewCount} review{stats.reviewCount !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Review Form */}
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg bg-muted/50">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Rating</label>
              <StarRating rating={rating} onRatingChange={setRating} interactive />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Review (optional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={rating === 0 || isSubmitting}>
                {isSubmitting ? "Submitting..." : isEditing ? "Update Review" : "Submit Review"}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        ) : user && userReview && !isEditing ? (
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Your Review</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDelete}
                  disabled={deleteReview.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
            <StarRating rating={userReview.rating} size="sm" />
            {userReview.comment && <p className="text-sm text-foreground">{userReview.comment}</p>}
          </div>
        ) : !user ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-3">Sign in to leave a review</p>
            <Button asChild variant="outline">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        ) : null}

        {/* Reviews List */}
        {reviewsLoading ? (
          <p className="text-muted-foreground text-center py-4">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews
              .filter((review) => review.user_id !== user?.id)
              .map((review) => (
                <div key={review.id} className="flex gap-4 py-4 border-t first:border-t-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {review.profiles?.display_name || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(review.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                    {review.comment && (
                      <p className="text-sm text-foreground mt-2">{review.comment}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
