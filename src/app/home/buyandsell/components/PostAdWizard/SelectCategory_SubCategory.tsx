'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { TabsContent } from '@/components/ui/tabs';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { getCategories, getSubCategories } from '@/hooks/category';
import { Category, SubCategory } from '@/types/category';

type Props = {
    onSelectCategory: (cat: Category) => void;
    onSelectSubCategory: (sub: SubCategory) => void;
};

export default function SelectCategory_SubCategory({ onSelectCategory, onSelectSubCategory }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingSubCategories, setLoadingSubCategories] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch {
                toast.error('Failed to load categories');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategorySelect = async (cat: Category) => {
        setSelectedCategory(cat);
        setSubCategories([]);
        onSelectCategory(cat);

        setLoadingSubCategories(true);
        try {
            const subs = await getSubCategories(cat._id);
            setSubCategories(subs);
        } catch {
            toast.error('Failed to load subcategories');
        } finally {
            setLoadingSubCategories(false);
        }
    };

    const variants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    return (
        <TabsContent value="step1">
            <AnimatePresence mode="wait">
                <motion.div key="category-step" variants={variants} initial="initial" animate="animate" exit="exit" className=''>
                    <div className="flex gap-6">
                        <div className="w-1/3 border-r pr-4">
                            <h3 className="font-semibold mb-2">Main Categories</h3>
                            {loadingCategories ? (
                                <p className="text-sm text-gray-500">Loading categories...</p>
                            ) : (
                                <ul>
                                    {categories.map(cat => (
                                        <li
                                            key={cat._id}
                                            className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-gray-100 ${selectedCategory?._id === cat._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                                }`}
                                            onClick={() => handleCategorySelect(cat)}
                                        >
                                            {cat.icon && <Image src={cat.icon} alt={cat.name} width={24} height={24} className="rounded" />}
                                            <span>{cat.name}</span>
                                            <ChevronRight className="ml-auto" />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="flex-1 pl-4">
                            {selectedCategory && (
                                <>
                                    <h3 className="font-semibold mb-2">Subcategories of {selectedCategory.name}</h3>
                                    {loadingSubCategories ? (
                                        <p className="text-sm text-gray-500">Loading subcategories...</p>
                                    ) : subCategories.length > 0 ? (
                                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {subCategories.map(sub => (
                                                <li
                                                    key={sub._id}
                                                    className="p-2 border rounded flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                                                    onClick={() => onSelectSubCategory(sub)}
                                                >
                                                    {sub.icon && typeof sub.icon === 'string' && (
                                                        <Image src={sub.icon} alt={sub.name} width={20} height={20} className="rounded" />
                                                    )}
                                                    <span>{sub.name}</span>
                                                    <ChevronRight className="ml-auto" />
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No subcategories found.</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </TabsContent>
    );
}
