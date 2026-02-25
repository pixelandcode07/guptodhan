import { AnimatePresence } from 'framer-motion';
import BuySellCard from './BuySellCard';
import { ClassifiedAdListing } from '@/types/ClassifiedAdsType';

interface AdGridProps {
    ads: ClassifiedAdListing[];
}

export default function BuySellGrid({ ads }: AdGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-5 md:gap-6">
            <AnimatePresence mode="popLayout">
                {ads.map((ad, index) => (
                    <BuySellCard key={ad._id} ad={ad} index={index} />
                ))}
            </AnimatePresence>
        </div>
    );
}