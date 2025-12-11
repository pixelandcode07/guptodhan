// src/components/VendorLoading.tsx
"use client";

import { motion } from "framer-motion";
import { Package, Store, TrendingUp, Sparkles } from "lucide-react";

export default function VendorLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-r from-indigo-300 to-purple-400 opacity-30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-l from-pink-300 to-purple-400 opacity-30 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center space-y-10 text-center"
      >
        {/* Logo + Icon */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <div className="relative p-6 rounded-full bg-white/80 backdrop-blur-lg shadow-2xl border border-white/50">
              <Store className="h-20 w-20 text-indigo-600" />
              <Sparkles className="absolute -top-3 -right-3 h-10 w-10 text-purple-500 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Brand Name */}
        <div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-5xl md:text-6xl font-black tracking-tight text-transparent"
          >
            Guptodhan Vendor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-lg font-medium text-gray-600"
          >
            Loading your store dashboard...
          </motion.p>
        </div>

        {/* Floating Icons Around */}
        <div className="relative h-40 w-80">
          <motion.div
            animate={{ y: [-20, 20, -20], rotate: [0, 360, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute left-0 top-10"
          >
            <Package className="h-12 w-12 text-indigo-500" />
          </motion.div>
          <motion.div
            animate={{ y: [20, -20, 20], rotate: [0, -360, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            className="absolute right-0 top-16"
          >
            <TrendingUp className="h-14 w-14 text-purple-500" />
          </motion.div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-96 max-w-full px-8">
          <div className="h-2 overflow-hidden rounded-full bg-white/50 backdrop-blur shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-4 text-sm text-gray-600 font-medium"
          >
            Preparing your sales, orders & analytics
          </motion.p>
        </div>

        {/* Pulsating Dots */}
        <div className="flex space-x-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}