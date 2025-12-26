'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { TabsContent } from '@/components/ui/tabs';
import { ChevronRight, ChevronDown } from 'lucide-react';
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
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
    setExpandedCategory(null);

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

  const toggleExpand = (catId: string) => {
    setExpandedCategory(expandedCategory === catId ? null : catId);
  };

  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <TabsContent value="step1">
      <AnimatePresence mode="wait">
        <motion.div
          key="category-step"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-4"
        >
          {/* Mobile View: Accordion */}
          <div className="md:hidden space-y-2 px-2">
            <h3 className="font-semibold text-lg mb-3">Choose Category</h3>
            {loadingCategories ? (
              <p className="text-sm text-gray-500">Loading categories...</p>
            ) : (
              <div className="space-y-1">
                {categories.map((cat) => (
                  <div key={cat._id} className="border rounded-lg overflow-hidden">
                    {/* Main Category */}
                    <button
                      onClick={() => toggleExpand(cat._id)}
                      className={`
                        w-full flex items-center justify-between p-3 text-left
                        hover:bg-gray-50 transition-colors
                        ${selectedCategory?._id === cat._id ? 'bg-blue-50 font-medium' : ''}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {cat.icon && (
                          <Image src={cat.icon} alt={cat.name} width={20} height={20} className="rounded" />
                        )}
                        <span>{cat.name}</span>
                      </div>
                      {expandedCategory === cat._id ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>

                    {/* Subcategories (expanded) */}
                    <AnimatePresence>
                      {expandedCategory === cat._id && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t"
                        >
                          {loadingSubCategories && selectedCategory?._id === cat._id ? (
                            <p className="p-3 text-sm text-gray-500">Loading subcategories...</p>
                          ) : subCategories.length > 0 ? (
                            <div className="p-2 grid grid-cols-1 gap-0.5">
                              {subCategories.map((sub) => (
                                <button
                                  key={sub._id}
                                  onClick={() => onSelectSubCategory(sub)}
                                  className="flex items-center gap-2 p-2 text-sm rounded hover:bg-blue-50 transition-colors text-left"
                                >
                                  {sub.icon && typeof sub.icon === 'string' && (
                                    <Image src={sub.icon} alt={sub.name} width={16} height={16} className="rounded" />
                                  )}
                                  <span className="truncate">{sub.name}</span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="p-3 text-sm text-gray-500">No subcategories</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tablet + Desktop View: Sidebar + Grid */}
          <div className="hidden md:flex gap-6 md:px-28">
            <div className="w-1/3 border-r pr-4">
              <h3 className="font-semibold mb-3">Main Categories</h3>
              {loadingCategories ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
              ) : (
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li
                      key={cat._id}
                      className={`
                        cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors
                        ${selectedCategory?._id === cat._id ? 'bg-blue-50 border-l-4 border-blue-500 font-medium' : ''}
                      `}
                      onClick={() => handleCategorySelect(cat)}
                    >
                      {cat.icon && <Image src={cat.icon} alt={cat.name} width={24} height={24} className="rounded" />}
                      <span>{cat.name}</span>
                      <ChevronRight className="ml-auto w-4 h-4" />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex-1 pl-4">
              {selectedCategory && (
                <>
                  <h3 className="font-semibold mb-3">Subcategories of {selectedCategory.name}</h3>
                  {loadingSubCategories ? (
                    <p className="text-sm text-gray-500">Loading subcategories...</p>
                  ) : subCategories.length > 0 ? (
                    <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {subCategories.map((sub) => (
                        <li
                          key={sub._id}
                          className="p-3 border rounded flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => onSelectSubCategory(sub)}
                        >
                          {sub.icon && typeof sub.icon === 'string' && (
                            <Image src={sub.icon} alt={sub.name} width={20} height={20} className="rounded" />
                          )}
                          <span>{sub.name}</span>
                          <ChevronRight className="ml-auto w-4 h-4" />
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