"use client";

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Star, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface StoreReview {
  _id: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function StoreReviewClient({ initialReviews, token }: { initialReviews: StoreReview[], token: string }) {
  const [reviews, setReviews] = useState<StoreReview[]>(initialReviews);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      setLoadingId(id);
      const res = await axios.delete(`/api/v1/store-review/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        toast.success("Review deleted successfully!");
        setReviews(prev => prev.filter(r => r._id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete review");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-800 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Rating</th>
              <th className="p-4 font-semibold w-1/2">Comment</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Star className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="text-base font-medium text-gray-600">No Store Reviews Yet</p>
                    <p className="text-sm mt-1">Customers haven't reviewed your store yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              reviews.map(review => (
                <tr key={review._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
                        <Image 
                          src={review.userImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                          alt={review.userName} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-800">{review.userName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < review.rating ? '#facc15' : '#e5e7eb'} 
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'} 
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {review.comment}
                    </p>
                  </td>
                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(review._id)} 
                      disabled={loadingId === review._id}
                      className="inline-flex items-center justify-center text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors disabled:opacity-50"
                      title="Delete Review"
                    >
                      {loadingId === review._id ? (
                        <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}