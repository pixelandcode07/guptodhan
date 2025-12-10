"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNotFound } from "@/contexts/NotFoundContext";
import { useEffect } from "react";

export default function VendorNotFound() {
  const { setIsNotFound } = useNotFound();

  useEffect(() => {
    setIsNotFound(true);
    return () => setIsNotFound(false);
  }, [setIsNotFound]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* 404 Image */}
        <div className="relative w-80 h-80 mx-auto mb-8">
          <Image
            src="/img/error-page.png"
            alt="Page not found"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <p className="text-xl font-semibold text-gray-700 mb-3">
          Oops! This page doesn't exist in your vendor panel.
        </p>
        <p className="text-gray-600 mb-10">
          It might have been moved, deleted, or you may have mistyped the URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </Button>
        </div>

        <p className="mt-12 text-sm text-gray-500">
          © 2025 <span className="font-bold text-indigo-600">Guptodhan Vendor</span>
        </p>
      </motion.div>
    </div>
  );
}