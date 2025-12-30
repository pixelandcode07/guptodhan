import { SquareDashedMousePointer } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function SeeAllCard() {
    return (
        <Button
            asChild
            variant="ghost"
            className="relative flex h-auto justify-start items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.04] p-0"
        >
            <div>
                {/* Icon Container */}
                <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-gray-50 transition-all duration-300 group-hover:bg-purple-50 group-hover:scale-110">
                    <SquareDashedMousePointer
                        size={48}
                        className="text-gray-600 transition-all duration-300 group-hover:text-purple-600 group-hover:scale-110"
                    />
                </div>

                {/* Text */}
                <div className="px-4 py-5 flex-1 text-left">
                    <h6 className="text-[#00005E] font-semibold text-base leading-tight">
                        See All Services
                    </h6>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
        </Button>
        // <Button>See</Button>
    );
}