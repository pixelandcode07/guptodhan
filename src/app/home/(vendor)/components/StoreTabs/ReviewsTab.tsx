import { Star } from "lucide-react";

export default function ReviewsTab({ storeId }: { storeId: string }) {
    // এখানে আপনি চাইলে আলাদাভাবে রিভিউ ফেচ করতে পারেন অথবা প্রপস হিসেবে পাঠাতে পারেন
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                <div className="text-4xl font-black text-yellow-600">4.8</div>
                <div>
                    <div className="flex gap-1 text-yellow-500 mb-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on 120+ customer reviews</p>
                </div>
            </div>
            {/* রিভিউ লিস্ট ম্যাপ করুন এখানে */}
        </div>
    );
}