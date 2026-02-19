'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Star, UploadCloud, X, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'sonner';
import { fadeInUp } from './constants';
import { Review, Product } from './types';

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
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const averageRating =
    reviews.length === 0
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
    if (!session?.user) {
      toast.error('Please login to submit a review');
      router.push('/auth/login');
      return;
    }
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
    const user = session.user as SessionUser;

    const userId = user.id || user._id || '';
    const userName = user.name || 'Anonymous';
    const userEmail = user.email || '';
    const userImage = user.image || '';

    console.log('📸 Review Submit Debug:', {
      userId,
      userName,
      userEmail,
      userImage,
      rating: newReviewRating,
      commentLength: newReviewComment.length,
    });

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

      console.log('📤 API Response:', result);

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
        console.error('Server Error:', result);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error('Something went wrong! Check console for details.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoadingReviews) {
    return (
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EF4A23]"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading reviews...</p>
      </motion.div>
    );
  }

  if (reviews.length === 0) {
    return (
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
        {session?.user ? (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4">Be the first to write a review</h4>
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
                      className={
                        star <= newReviewRating ? 'text-yellow-400' : 'text-gray-300'
                      }
                    />
                  </motion.button>
                ))}
              </div>

              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#EF4A23] focus:border-transparent outline-none resize-none bg-white"
                rows={3}
                placeholder="Write your experience..."
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
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText size={32} className="text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 font-medium mb-6">
              This product has no reviews yet, be the first one to write a review.
            </p>
            <Button
              onClick={() => {
                router.push('/auth/login');
              }}
              className="bg-[#EF4A23] hover:bg-[#d43d1a] text-white"
            >
              Login to Write Review
            </Button>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      {session?.user && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4">Write a Review</h4>
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
                    className={
                      star <= newReviewRating ? 'text-yellow-400' : 'text-gray-300'
                    }
                  />
                </motion.button>
              ))}
            </div>

            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#EF4A23] focus:border-transparent outline-none resize-none bg-white"
              rows={3}
              placeholder="Write your experience..."
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
      )}

      <div className="flex items-center gap-2 py-4 border-b border-gray-200">
        <h4 className="font-bold text-gray-800">Customer Reviews</h4>
        <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </span>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0 border border-gray-300">
                  {review.userImage && review.userImage.includes('http') ? (
                    <Image
                      src={review.userImage}
                      alt={review.userName}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-sm bg-gray-200">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-gray-800 text-sm truncate">{review.userName}</h5>
                  <div className="flex text-yellow-400 text-xs mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                        className={i >= review.rating ? 'text-gray-300' : ''}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400 shrink-0 ml-2">
                {new Date(review.uploadedTime).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>

            {review.reviewImages && review.reviewImages.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.reviewImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded border border-gray-100 overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
                  >
                    <Image src={img} alt={`Review ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}