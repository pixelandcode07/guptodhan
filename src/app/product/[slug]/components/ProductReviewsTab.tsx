'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Star, UploadCloud, X, FileText, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'sonner';

// ✅ MAGIC FIX: Types added locally to avoid import errors
export interface Review {
  _id: string;
  rating: number;
  comment: string;
  userName: string;
  uploadedTime: string;
  reviewImages?: string[];
}

export interface Product {
  _id: string;
  productTitle: string;
}

interface ProductReviewsTabProps {
  product: Product;
  reviews: Review[];
  onReviewsUpdate: (reviews: Review[]) => void;
  isLoadingReviews?: boolean;
}

interface SessionUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  accessToken?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProductReviewsTab({
  product,
  reviews,
  onReviewsUpdate,
  isLoadingReviews = false,
}: ProductReviewsTabProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewFiles, setReviewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  const [canReview, setCanReview] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalReviews = reviews.length;
  
  const averageRating = useMemo(() => {
    if (totalReviews === 0) return '0';
    const total = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (total / totalReviews).toFixed(1);
  }, [reviews, totalReviews]);

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating as keyof typeof counts]++;
      }
    });
    return counts;
  }, [reviews]);


  useEffect(() => {
    const checkEligibility = async () => {
      if (!session?.user) {
        setIsCheckingEligibility(false);
        return;
      }

      try {
        const user = session.user as SessionUser;
        const userId = user.id || user._id || '';
        const token = user.accessToken;

        if (!userId) {
          setIsCheckingEligibility(false);
          return;
        }

        const res = await fetch(`/api/v1/product-order?userId=${userId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const json = await res.json();
        
        if (json.success && json.data) {
          const orders = json.data;
          
          const hasBoughtAndDelivered = orders.some((order: any) => {
            const isDelivered = order.orderStatus?.toLowerCase() === 'delivered';
            if (!isDelivered) return false;

            return order.orderDetails?.some((detail: any) => {
              const detailProductId = detail.productId?._id || detail.productId;
              return detailProductId === product._id;
            });
          });

          setCanReview(hasBoughtAndDelivered);
        }
      } catch (error) {
        console.error("Error checking review eligibility:", error);
      } finally {
        setIsCheckingEligibility(false);
      }
    };

    checkEligibility();
  }, [session, product._id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (reviewFiles.length + files.length > 3) {
        toast.error('You can upload maximum 3 images');
        return;
      }
      setReviewFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = reviewFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    URL.revokeObjectURL(previewUrls[index]);
    setReviewFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const handleSubmitReview = async () => {
    if (!canReview) return;

    if (newReviewRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!newReviewComment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setIsSubmittingReview(true);

    const formData = new FormData();
    const user = session?.user as SessionUser;

    const userId = user.id || user._id || '';
    const userName = user.name || 'Anonymous';
    const userEmail = user.email || '';
    const userImage = user.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

    formData.append('reviewId', `REV-${Date.now()}`);
    formData.append('productId', product._id);
    formData.append('userId', userId);
    formData.append('userName', userName);
    formData.append('userEmail', userEmail);
    formData.append('rating', newReviewRating.toString());
    formData.append('comment', newReviewComment);
    formData.append('userImage', userImage); 

    reviewFiles.forEach((file) => {
      formData.append('reviewImages', file);
    });

    try {
      const response = await fetch('/api/v1/product-review', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Review submitted successfully!');
        setNewReviewRating(0);
        setNewReviewComment('');
        setReviewFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = '';

        const reviewsResponse = await fetch(
          `/api/v1/product-review/product-review-product/${product._id}`
        );
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          if (reviewsData.success && reviewsData.data) {
            onReviewsUpdate(reviewsData.data);
          }
        }
      } else {
        toast.error(result.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error('Something went wrong! Check console for details.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderReviewFormArea = () => {
    if (!session?.user) {
      return (
        <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300 w-full">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
              <ShoppingBag size={28} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 font-medium mb-4 px-4">
            Please login to write a review. Only verified buyers can review this product.
          </p>
          <Button
            onClick={() => {
              const loginButton = document.getElementById('login-modal-btn') || document.getElementById('login-modal-btn-mobile');
              if (loginButton) {
                loginButton.click();
              } else {
                toast.info("Please login to continue.");
                router.push('/auth/login');
              }
            }}
            className="bg-[#EF4A23] hover:bg-[#d43d1a] text-white"
          >
            Login to Write Review
          </Button>
        </div>
      );
    }

    if (isCheckingEligibility) {
      return (
        <div className="flex justify-center items-center py-12 bg-white rounded-lg border border-gray-200 w-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#EF4A23]"></div>
          <span className="ml-3 text-gray-500 font-medium">Checking purchase history...</span>
        </div>
      );
    }

    if (!canReview) {
      return (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200 w-full">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
              <FileText size={28} className="text-orange-500" />
            </div>
          </div>
          <p className="text-gray-700 font-medium">
            You can only review this product after purchasing and receiving it.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            If you recently received your order, please wait for the status to update.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm w-full">
        <h4 className="font-bold text-gray-800 mb-4">
          {reviews.length === 0 ? "Be the first to write a review" : "Write a Review"}
        </h4>
        <div className="space-y-4">
          <div className="flex gap-2 justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setNewReviewRating(star)}
                className="focus:outline-none"
              >
                <Star
                  size={28}
                  fill={star <= newReviewRating ? '#facc15' : 'none'}
                  className={star <= newReviewRating ? 'text-yellow-400' : 'text-gray-300'}
                />
              </motion.button>
            ))}
          </div>

          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#EF4A23] focus:border-transparent outline-none resize-none bg-white"
            rows={3}
            placeholder="Share details of your own experience with this product..."
            value={newReviewComment}
            onChange={(e) => setNewReviewComment(e.target.value)}
          />

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors text-center">
            <input
              type="file"
              id="review-img-upload"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              ref={fileInputRef}
            />
            <label htmlFor="review-img-upload" className="cursor-pointer flex flex-col items-center gap-2">
              <UploadCloud size={24} className="text-gray-400" />
              <span className="text-xs font-medium text-[#00005E]">Click to upload photos</span>
              <span className="text-[10px] text-gray-400">Max 3 images</span>
            </label>
          </div>

          {previewUrls.length > 0 && (
            <div className="flex gap-2 mt-2">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 group">
                  <Image src={url} alt="preview" fill className="object-cover" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-black/50 text-white p-0.5 hover:bg-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={handleSubmitReview}
            disabled={isSubmittingReview}
            className="w-full bg-[#00005E] hover:bg-[#000040] text-white h-10 rounded-lg"
          >
            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6 w-full">
      <div className="bg-white p-5 sm:p-6 rounded-lg border border-gray-200 shadow-sm w-full">
        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-6">
          Ratings & Reviews of {product.productTitle}
        </h3>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start w-full">
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-medium text-gray-800">{averageRating}</span>
              <span className="text-2xl text-gray-400">/5</span>
            </div>
            
            <div className="flex gap-0.5 mt-2 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={24}
                  fill={s <= Math.round(Number(averageRating)) ? '#facc15' : '#e5e7eb'}
                  className={s <= Math.round(Number(averageRating)) ? 'text-yellow-400' : 'text-gray-200'}
                />
              ))}
            </div>
            
            <span className="text-sm text-gray-500">{totalReviews} Ratings</span>
          </div>

          <div className="flex flex-col w-full md:w-2/3 space-y-2">
            {[5, 4, 3, 2, 1].map((starLevel) => {
              const count = ratingCounts[starLevel as keyof typeof ratingCounts];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={starLevel} className="flex items-center gap-3 w-full">
                  <div className="flex gap-0.5 w-24 shrink-0 justify-end">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= starLevel ? '#facc15' : '#e5e7eb'}
                        className={s <= starLevel ? 'text-yellow-400' : 'text-gray-200'}
                      />
                    ))}
                  </div>
                  <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden w-full">
                    <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-500 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-lg border border-gray-200 shadow-sm w-full">
        <h4 className="font-bold text-gray-800 text-base mb-4">Product Reviews</h4>

        {reviews.length === 0 ? (
          <div className="text-center py-12 border-t border-gray-100 w-full">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">This product has no reviews.</p>
            <p className="text-gray-500 text-sm">Let others know what do you think and be the first to write a review.</p>
          </div>
        ) : (
          <div className="space-y-4 border-t border-gray-100 pt-6 w-full">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0 w-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <div className="flex text-yellow-400 text-xs mb-1 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < review.rating ? '#facc15' : '#e5e7eb'}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {review.userName}
                      </span>
                      <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-1.5 rounded">Verified Purchase</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">
                    {new Date(review.uploadedTime).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-800 text-sm leading-relaxed mt-2">{review.comment}</p>

                {review.reviewImages && review.reviewImages.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.reviewImages.map((img, i) => (
                      <div
                        key={i}
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded border border-gray-200 overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
                      >
                        <Image src={img} alt={`Review ${i}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {renderReviewFormArea()}
      
    </motion.div>
  );
}