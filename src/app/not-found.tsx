"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNotFound } from "@/contexts/NotFoundContext";
import { useEffect } from "react";

export default function GlobalNotFound() {
  const { setIsNotFound } = useNotFound();

  useEffect(() => {
    setIsNotFound(true);
    return () => setIsNotFound(false);
  }, [setIsNotFound]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="relative w-80 h-80 mx-auto mb-8">
          <Image
            src="/img/error-page.png"
            alt="404 - Page not found"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* <h1 className="text-6xl font-black text-gray-800 mb-4">404</h1> */}
        <p className="text-2xl font-bold text-gray-700 mb-3">Page Not Found</p>
        <p className="text-gray-600 mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Link href="/">Back to Home</Link>
        </Button>

        <p className="mt-12 text-sm text-gray-500">
          © 2025 <span className="font-bold text-purple-600">Guptodhan</span>
        </p>
      </motion.div>
    </div>
  );
}