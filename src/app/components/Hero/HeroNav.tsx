"use client";

import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  HandCoins,
  House,
  ChevronDown,
  ChevronRight,
  Store,
} from "lucide-react";
import { MainCategory } from "@/types/navigation-menu";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroNavProps {
  categories: MainCategory[];
}

export function HeroNav({ categories }: HeroNavProps) {
  const isMobile = useIsMobile();
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
  const [isFixed, setIsFixed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerOffset =
    typeof window !== "undefined" ? window.innerHeight * 0.5 : 0;

  /* ---------- Resize ---------- */
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- Scroll → Fixed ---------- */
  useEffect(() => {
    const handleScroll = () => setIsFixed(window.scrollY > triggerOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerOffset]);

  /* ---------- Visible count ---------- */
  const getVisibleCount = () => {
    if (screenWidth < 768) return 0;
    if (screenWidth < 1024) return 7;
    if (screenWidth < 1440) return 3;
    return 5;
  };
  const visibleCount = getVisibleCount();
  const visibleCategories = categories.slice(0, visibleCount);
  const moreCategories = categories.slice(visibleCount);

  /* ---------- Hover helpers ---------- */
  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(id);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setOpenSubDropdown(null);
    }, 150);
  };

  const handleSubEnter = (subId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenSubDropdown(subId);
  };
  const handleSubLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenSubDropdown(null), 150);
  };

  return (
    <>
      <div />

      <motion.nav
        className={`
          w-full bg-[#00045e] text-white shadow-lg z-40
          ${isFixed ? "fixed top-0 left-0 right-0" : "relative"}
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="max-w-[80vw] xl:container mx-auto px-8">
          <div className="flex justify-between items-center">
            {/* ---------- MAIN MENU ---------- */}
            <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-4 xl:space-x-6">
              {/* Visible main categories */}
              {!isMobile &&
                visibleCategories.map((main) => (
                  <div
                    key={main.mainCategoryId}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(main.mainCategoryId)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <motion.button
                      className="hidden md:flex items-center px-3 py-2 text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="flex items-center">
                        <Link
                          href={`/category/${main.slug}`}
                          className=""
                        >
                          {main.name}
                        </Link>
                        <motion.div
                          animate={{
                            rotate:
                              openDropdown === main.mainCategoryId ? 180 : 0,
                          }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <ChevronDown className="ml-1 w-4 h-4" />
                        </motion.div>
                      </span>
                    </motion.button>
                    {/* ---- First level dropdown ---- */}
                    <AnimatePresence>
                      {openDropdown === main.mainCategoryId &&
                        main.subCategories &&
                        main.subCategories.length > 0 && (
                          <motion.div
                            key={`dropdown-${main.mainCategoryId}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 top-full mt-1 w-56 bg-white rounded-md shadow-lg border z-50"
                            onMouseEnter={() => handleMouseEnter(main.mainCategoryId)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className="py-2">
                              {main.subCategories.map((sub) => {
                                const hasChildren = sub.children && sub.children.length > 0;
                                return (
                                  <div
                                    key={sub.subCategoryId}
                                    className="relative flex items-center"
                                    onMouseEnter={() => hasChildren && handleSubEnter(sub.subCategoryId)}
                                    onMouseLeave={handleSubLeave}
                                  >
                                    <Link
                                      href={`/subcategory/${sub.slug}`}
                                      className="flex-1 block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-black font-medium transition-colors"
                                    >
                                      {sub.name}
                                    </Link>

                                    {/* ChevronRight when children exist */}
                                    {hasChildren && (
                                      <ChevronRight className="mr-2 w-4 h-4 text-gray-600" />
                                    )}

                                    {/* ---- Second level dropdown (children) ---- */}
                                    <AnimatePresence>
                                      {hasChildren && openSubDropdown === sub.subCategoryId && (
                                        <motion.div
                                          key={`sub-dropdown-${sub.subCategoryId}`}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -10 }}
                                          transition={{ duration: 0.2 }}
                                          className="absolute left-full top-0 ml-1 w-56 bg-white rounded-md shadow-lg border z-50"
                                        >
                                          <div className="py-2">
                                            {sub.children!.map((child) => (
                                              <Link
                                                key={child.childCategoryId}
                                                href={`/childcategory/${child.slug}`}
                                                className="block px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                                              >
                                                {child.name}
                                              </Link>
                                            ))}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                ))}

              {/* ---------- MORE BUTTON ---------- */}
              {moreCategories.length > 0 && !isMobile && (
                <div
                  className="relative hidden md:block"
                  onMouseEnter={() => handleMouseEnter("more")}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.button
                    className="flex items-center px-3 py-2 text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center">
                      More
                      <motion.div
                        animate={{ rotate: openDropdown === "more" ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <ChevronDown className="ml-1 w-4 h-4" />
                      </motion.div>
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {openDropdown === "more" && (
                      <motion.div
                        key="more-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-1 w-56 bg-white rounded-md shadow-lg border z-50"
                        onMouseEnter={() => handleMouseEnter("more")}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="py-2">
                          {moreCategories.map((main) => (
                            <Link
                              key={main.mainCategoryId}
                              href={`/category/${main.slug}`}
                              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-black font-medium transition-colors"
                            >
                              {main.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ---------- ACTION BUTTONS ---------- */}
            <div className="hidden lg:flex items-center space-x-2 h-full">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/home/vendor-shops"
                  className="flex items-center h-full px-6 py-3 bg-[#2befe5b8]  text-white hover:bg-[#0097E9] cursor-pointer transition-colors"
                >
                  <Store size={20} className="mr-2" />
                  Vendor Shops
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/home/buyandsell"
                  className="flex items-center h-full px-6 py-3 bg-[#0097E9] text-white hover:bg-red-500 cursor-pointer transition-colors"
                >
                  <House size={20} className="mr-2" />
                  Buy & Sale
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/home/donation"
                  className="flex items-center h-full px-6 py-3 bg-green-700 text-white font-medium hover:bg-green-800 transition-colors"
                >
                  <HandCoins size={20} className="mr-2" />
                  Donation
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile hint */}
        {isMobile && (
          <div className="max-w-[90vw] mx-auto px-4 py-2 border-t border-white/20">
            <p className="text-sm text-gray-300">
              Use desktop for full navigation
            </p>
          </div>
        )}
      </motion.nav>
    </>
  );
}