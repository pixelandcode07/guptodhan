"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";

interface Category {
    _id: string;
    name: string;
    icon: string;
    status: string;
}

interface Props {
    categories: Category[];
    selectedCategory: string | null;
    onSelect: (id: string | null) => void;
}

export default function DonationCategoryFilter({ categories, selectedCategory, onSelect }: Props) {
    const activeCategories = categories.filter((c) => c.status === "active");

    return (
        <div className="w-full overflow-x-auto scrollbar-hide py-2">
            <div className="flex gap-3 min-w-max px-1">

                {/* All Button */}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelect(null)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-6 py-4 min-w-[110px] transition-all duration-200 border
                        ${selectedCategory === null
                            ? "bg-[#00005E] text-white border-[#00005E] shadow-lg shadow-blue-900/20"
                            : "bg-[#eef0f8] text-[#00005E] border-transparent hover:border-[#00005E]/20 hover:shadow-md"
                        }`}
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                        ${selectedCategory === null ? "bg-white/20" : "bg-white"}`}
                    >
                        <LayoutGrid className={`w-5 h-5 ${selectedCategory === null ? "text-white" : "text-[#00005E]"}`} />
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap">All</span>
                </motion.button>

                {/* Category Buttons */}
                {activeCategories.map((cat) => {
                    const isSelected = selectedCategory === cat._id;
                    return (
                        <motion.button
                            key={cat._id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onSelect(isSelected ? null : cat._id)}
                            className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-6 py-4 min-w-[110px] transition-all duration-200 border
                                ${isSelected
                                    ? "bg-[#00005E] text-white border-[#00005E] shadow-lg shadow-blue-900/20"
                                    : "bg-[#eef0f8] text-[#00005E] border-transparent hover:border-[#00005E]/20 hover:shadow-md"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden
                                ${isSelected ? "bg-white/20" : "bg-white"}`}
                            >
                                <Image
                                    src={cat.icon}
                                    alt={cat.name}
                                    width={28}
                                    height={28}
                                    className={`object-contain transition-all duration-200 ${isSelected ? "brightness-0 invert" : ""}`}
                                />
                            </div>
                            <span className="text-xs font-bold whitespace-nowrap line-clamp-1 max-w-[90px] text-center">
                                {cat.name}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}