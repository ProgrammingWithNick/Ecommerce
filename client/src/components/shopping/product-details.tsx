import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import StarRatingComponent from "../common/star-rating";
import { Pencil, Trash2, Star, AlertCircle } from "lucide-react";

import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addReview, getReviews, updateReview, deleteReview } from "@/store/shop/review-slice";
import { AppDispatch, RootState } from "@/store/store";

interface ProductDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  productDetails: {
    _id?: string;
    title: string;
    description: string;
    image: string;
    price: number;
    salePrice: number;
    totalStock: number;
  } | null;
  onClose: () => void;
}

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
  onClose,
}: ProductDetailsDialogProps) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewActionLoading, setReviewActionLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRef = useRef(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const cartState = useSelector((state: RootState) => state.shopCart);
  const { reviews } = useSelector((state: RootState) => state.shopReview);
  const [localLoading, setLocalLoading] = useState(true);

  const handleRatingChange = (value: number) => setRating(value);

  const handleAddToCart = (productId: string | undefined, totalStock: number) => {
    if (!productId) return;
    if (!user?.id) {
      toast.error("Please login to add items to cart");
      return;
    }
    const cartItems = cartState.cartItems || [];
    const existing = cartItems.find((item) => item.productId === productId);
    if (existing && existing.quantity + 1 > totalStock) {
      toast.error(`Only ${totalStock} quantity available for this item`);
      return;
    }
    dispatch(addToCart({ userId: user.id, productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        dispatch(fetchCartItems(user.id));
        toast.success("Product added to cart!");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add to cart");
      });
  };

  const handleDialogClose = () => {
    setOpen(false);
    onClose();
    setRating(0);
    setReviewMsg("");
    setEditingReviewId(null);
  };

  const handleAddReview = async () => {
    if (!productDetails?._id || !user) {
      toast.error("Please login to add a review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setReviewActionLoading(true);
    try {
      if (editingReviewId) {
        await dispatch(
          updateReview({
            reviewId: editingReviewId,
            productId: productDetails._id,
            userId: user.id,
            userName: user.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating,
          })
        ).unwrap();
        toast.success("Review updated successfully!");
      } else {
        await dispatch(
          addReview({
            productId: productDetails._id,
            userId: user.id,
            userName: user.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating,
          })
        ).unwrap();
        toast.success("Review added successfully!");
      }
      setRating(0);
      setReviewMsg("");
      setEditingReviewId(null);
      if (productDetails._id) {
        dispatch(getReviews(productDetails._id));
      }
    } catch (error: any) {
      toast.error(error.message || (editingReviewId ? "Failed to update review" : "Failed to add review"));
    } finally {
      setReviewActionLoading(false);
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReviewId(review._id);
    setReviewMsg(review.reviewMessage);
    setRating(review.reviewValue);
  };

  const openDeleteConfirmation = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    setReviewActionLoading(true);
    try {
      await dispatch(deleteReview(reviewToDelete)).unwrap();
      toast.success("Review deleted successfully!");
      if (productDetails?._id) {
        dispatch(getReviews(productDetails._id));
      }
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete review");
    } finally {
      setReviewActionLoading(false);
    }
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setReviewMsg("");
    setRating(0);
  };

  useEffect(() => {
    if (open && productDetails?._id) {
      setLocalLoading(true);
      fetchedRef.current = true;
      
      dispatch(getReviews(productDetails._id))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            setLocalLoading(false);
          }, 300);
        })
        .catch(() => {
          setLocalLoading(false);
        });
    } else if (!open) {
      fetchedRef.current = false;
      setLocalLoading(false);
    }
  }, [productDetails?._id, dispatch, open]);

  const averageReview =
    reviews?.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  if (!productDetails) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 p-3 sm:p-6 w-full max-w-[95vw] sm:max-w-[85vw] lg:max-w-[75vw]">
          {/* LEFT: Image */}
          <div className="relative overflow-hidden rounded-lg w-full h-fit">
            <img
              src={productDetails.image || ""}
              alt={productDetails.title}
              className="aspect-square w-full object-cover"
            />
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col w-full overflow-y-auto pb-4">
            <h1 className="text-xl sm:text-2xl font-bold">{productDetails.title}</h1>
            <p className="text-muted-foreground text-sm sm:text-base my-2">
              {productDetails.description}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-2 mt-1">
              <p className={`text-xl sm:text-2xl font-bold text-primary ${productDetails.salePrice > 0 ? "line-through" : ""}`}>
                ₹{productDetails.price.toFixed(2)}
              </p>
              {productDetails.salePrice > 0 && (
                <p className="text-lg sm:text-xl font-bold text-muted-foreground">
                  ₹{productDetails.salePrice.toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium">{averageReview.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground text-sm">
                ({reviews?.length || 0} {reviews?.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            <div className="my-3">
              <Button
                disabled={productDetails.totalStock === 0}
                className="w-full"
                onClick={() =>
                  handleAddToCart(productDetails._id, productDetails.totalStock)
                }
              >
                {productDetails.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            <Separator className="my-2" />

            {/* Reviews Section */}
            <div className="mt-3">
              <h2 className="text-base sm:text-lg font-bold mb-2">Customer Reviews</h2>

              {/* Reviews List */}
              <div className="flex flex-col gap-4 max-h-[200px] overflow-y-auto pr-1 mb-3">
                {localLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Loading reviews...</span>
                  </div>
                ) : !reviews ? (
                  <p className="text-muted-foreground text-sm">Failed to load reviews.</p>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="flex gap-2 pb-2 border-b border-gray-100 last:border-0">
                      <Avatar className="w-8 h-8 border flex-shrink-0">
                        <AvatarFallback>
                          {review.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1 flex-grow min-w-0">
                        <div className="flex justify-between items-start flex-wrap">
                          <h3 className="font-semibold text-sm">{review.userName}</h3>
                          {user && user.id === review.userId && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditReview(review)}
                                className="h-6 w-6"
                                disabled={reviewActionLoading}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteConfirmation(review._id)}
                                className="h-6 w-6 text-red-500 hover:text-red-700"
                                disabled={reviewActionLoading}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <StarRatingComponent rating={review.reviewValue} />
                        <p className="text-muted-foreground text-xs sm:text-sm break-words">{review.reviewMessage}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No reviews yet.</p>
                )}
              </div>

              {/* Add/Edit Review Form */}
              {user ? (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm">{editingReviewId ? "Edit Your Review" : "Write a Review"}</Label>
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(e) => setReviewMsg(e.target.value)}
                    placeholder="Share your thoughts..."
                    disabled={reviewActionLoading}
                    className="text-sm"
                  />
                  <div className="flex flex-col xs:flex-row gap-2 mt-1">
                    <Button
                      onClick={handleAddReview}
                      disabled={reviewMsg.trim() === "" || rating === 0 || reviewActionLoading}
                      className="flex-1 text-xs sm:text-sm py-1 h-8"
                      size="sm"
                    >
                      {reviewActionLoading ? "Submitting..." : editingReviewId ? "Update Review" : "Submit Review"}
                    </Button>
                    {editingReviewId && (
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                        disabled={reviewActionLoading}
                        className="text-xs sm:text-sm py-1 h-8"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-muted-foreground text-center text-sm">Please login to leave a review.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Review Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-4 sm:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              Delete Review
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} size="sm">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReview} disabled={reviewActionLoading} size="sm">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductDetailsDialog;