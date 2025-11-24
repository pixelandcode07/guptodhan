'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Star, UploadCloud, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'sonner';
import { fadeInUp } from './constants';
import { Review, Product } from './types';

interface ProductReviewsTabProps {
  product: Product;
  reviews: Review[];
  onReviewsUpdate: (reviews: Review[]) => void;
}

export default function ProductReviewsTab({ product, reviews, onReviewsUpdate }: ProductReviewsTabProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewFiles, setReviewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const averageRating = reviews.length === 0 
    ? 0 
    : (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (reviewFiles.length + files.length > 3) {
        toast.error('You can upload maximum 3 images');
        return;
      }
      setReviewFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
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

  const fetchReviews = useCallback(async () => {
    setIsReviewsLoading(true);
    try {
      const response = await fetch(`/api/v1/product-review/product-review-product/${product._id}`);
      const data = await response.json();
      if (data.success) {
        onReviewsUpdate(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsReviewsLoading(false);
    }
  }, [product._id, onReviewsUpdate]);

  const handleSubmitReview = async () => {
    if (!session?.user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (newReviewRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmittingReview(true);

    const formData = new FormData();
    formData.append('reviewId', `REV-${Date.now()}`);
    formData.append('productId', product._id);
    formData.append('userId', (session.user as any).id || (session.user as any)._id);
    formData.append('userName', session.user.name || 'Anonymous');
    formData.append('userEmail', session.user.email || '');
    formData.append('rating', newReviewRating.toString());
    formData.append('comment', newReviewComment);
    formData.append('userImage', session.user.image || 'https://placehold.co/100x100?text=User');

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
        fetchReviews();
      } else {
        toast.error(result.message || 'Failed to submit review');
        console.error('Server Error:', result);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error('Something went wrong! Check console for details.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Review Input */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
            <div className="text-6xl font-bold text-gray-800 mb-2">{averageRating}</div>
            <div className="flex justify-center gap-1 text-orange-400 mb-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} fill={s <= Math.round(Number(averageRating)) ? "currentColor" : "none"} />
              ))}
            </div>
            <p className="text-sm text-gray-400">{reviews.length} Verified Reviews</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4">Write a Review</h4>
            {!session?.user ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-4">Please sign in to write a review</p>
                <Button onClick={() => router.push('/auth/login')} variant="outline" className="w-full">
                  Sign In
                </Button>
              </div>
            ) : (
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
                        fill={star <= newReviewRating ? "#facc15" : "none"} 
                        className={star <= newReviewRating ? "text-yellow-400" : "text-gray-300"} 
                      />
                    </motion.button>
                  ))}
                </div>
                
                <textarea 
                  className="w-full p-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099cc] focus:border-transparent outline-none resize-none bg-white"
                  rows={3}
                  placeholder="Write your experience..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                />

                {/* Image Upload Box */}
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
                    <span className="text-xs font-medium text-[#0099cc]">Click to upload photos</span>
                    <span className="text-[10px] text-gray-400">Max 3 images</span>
                  </label>
                </div>

                {/* Previews */}
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
                  className="w-full bg-[#0e1133] hover:bg-[#2a2d5c] text-white h-10 rounded-lg"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-8">
          {isReviewsLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              No reviews yet. Be the first to review!
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                        {review.userImage?.includes('http') ? (
                          <Image src={review.userImage} alt={review.userName} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                            {review.userName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-800 text-sm">{review.userName}</h5>
                        <div className="flex text-orange-400 text-xs mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < review.rating ? "currentColor" : "none"} 
                              className={i >= review.rating ? "text-gray-300" : ""} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.uploadedTime).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm pl-[52px]">{review.comment}</p>

                  {/* Display Review Images */}
                  {review.reviewImages && review.reviewImages.length > 0 && (
                    <div className="flex gap-2 mt-3 pl-[52px]">
                      {review.reviewImages.map((img, i) => (
                        <div 
                          key={i} 
                          className="relative w-20 h-20 rounded border border-gray-100 overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
                        >
                          <Image src={img} alt="Review Image" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

