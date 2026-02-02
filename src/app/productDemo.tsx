"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  MessageCircleMore,
  Store,
  Banknote,
  RefreshCcw,
  Truck,
} from "lucide-react";

// --- Mock Data for Similar Products ---
const similarProducts = [
  {
    id: 1,
    title: "Xpel Tea Tree Foaming Face Wash",
    price: 749,
    oldPrice: 999,
    discount: "25% OFF",
    image: "https://d62ipmwrm4ymk.cloudfront.net/medium/product/20251009/xpel-marketing-tea-tree-foaming-face-wash-for-acne-pimples-wash-200ml_1_7XDvYhsJSLU.jpg",
  },
  {
    id: 2,
    title: "Garnier Bright Complete Vitamin C",
    price: 520,
    oldPrice: 580,
    discount: "10% OFF",
    image: "https://d62ipmwrm4ymk.cloudfront.net/medium/product/20251009/garnier-bright-complete-vitamin-c-face-wash-100gm-india_1_gWAGT5M2Ajw.jpg",
  },
  {
    id: 3,
    title: "Mamaearth Beetroot Gentle Face Wash",
    price: 590,
    oldPrice: 690,
    discount: "14% OFF",
    image: "https://d62ipmwrm4ymk.cloudfront.net/medium/product/20251009/mamaearth-beetroot-gentle-face-wash-with-beetroot-hyaluronic-acid-100ml-india_1_MjzrLmwkshk.jpg",
  },
  {
    id: 4,
    title: "CeraVe Hydrating Cleanser",
    price: 2750,
    oldPrice: 3090,
    discount: "11% OFF",
    image: "https://d62ipmwrm4ymk.cloudfront.net/medium/product/20251009/cerave-hydrating-cleanser-for-normal-to-dry-skin-236-ml_1_4w35FfakvzM.jpg",
  },
];

// --- Sub-Component: Product Card ---
const ProductCard = ({ product }) => (
  <div className="group relative bg-white md:rounded-lg shadow-md shadow-primary/10 hover:shadow-lg transition-transform duration-300 overflow-hidden flex flex-col w-full cursor-pointer rounded-none border border-transparent hover:border-primary/20">
    <div className="relative overflow-hidden w-full aspect-square">
      <Image
        src={product.image}
        alt={product.title}
        width={300}
        height={300}
        className="object-cover object-center group-hover:scale-105 transition-transform duration-300 w-full h-full"
      />
      <button className="absolute bottom-2.5 right-1 z-10 p-1.5 rounded-full bg-white/50 hover:bg-white transition-all text-primary">
        <Heart className="w-5 h-5 text-[#E2136E]" />
      </button>
    </div>
    <div className="p-2 flex flex-col justify-between flex-1">
      <h3 className="text-left font-medium truncate text-[12px] md:text-[14px] w-full" title={product.title}>
        {product.title}
      </h3>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-[#E2136E] font-[600] text-[14px]">৳{product.price}</p>
        <p className="line-through font-[400] text-[12px] text-gray-500">৳{product.oldPrice}</p>
        <span className="text-orange-500 text-[10px] font-medium">({product.discount})</span>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---
export default function ProductDetailsPage() {
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type) => {
    if (type === "minus" && quantity > 1) setQuantity(quantity - 1);
    if (type === "plus") setQuantity(quantity + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white text-slate-900">
      
      {/* --- Breadcrumb / Mobile Back --- */}
      <div className="md:hidden mb-4">
        <ChevronLeft className="w-6 h-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- Left Column: Image Gallery --- */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-100">
            <Image
              src="https://d62ipmwrm4ymk.cloudfront.net/product/20251009/nivea-men-dark-spot-reduction-face-wash-100gm_1_dGe9RDT2Vho.jpg"
              alt="Main Product"
              fill
              className="object-contain"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="w-20 h-20 relative border rounded cursor-pointer hover:border-primary">
                <Image
                  src="https://d62ipmwrm4ymk.cloudfront.net/product/20251009/nivea-men-dark-spot-reduction-face-wash-100gm_1_dGe9RDT2Vho.jpg"
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* --- Right Column: Product Info --- */}
        <div className="flex flex-col gap-4">
          {/* Title & Stats */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#191919]">
              NIVEA MEN Dark Spot Reduction Face Wash - 100gm
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[#E2136E] text-[#E2136E]" />
                ))}
                <span className="font-medium ml-1">2 Reviews</span>
              </div>
              <span className="w-[1px] h-4 bg-gray-300"></span>
              <span>160 Sold</span>
              <span className="w-[1px] h-4 bg-gray-300"></span>
              <span>Stock: 993</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-[#E2136E]">৳499</span>
            <span className="text-xl text-gray-400 line-through">৳599</span>
            <span className="text-orange-500 font-medium">(17% OFF)</span>
            <div className="ml-auto">
                <Share2 className="w-6 h-6 text-gray-500 cursor-pointer hover:text-black" />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-2">
            <span className="font-bold text-base">Quantity</span>
            <div className="flex items-center border rounded bg-white">
              <button
                onClick={() => handleQuantityChange("minus")}
                className="p-2 hover:bg-gray-100 disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                readOnly
                className="w-12 text-center border-none outline-none"
              />
              <button
                onClick={() => handleQuantityChange("plus")}
                className="p-2 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <button className="flex-1 bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-gray-800 transition">
              <ShoppingBag className="w-5 h-5" /> Buy Now
            </button>
            <button className="flex-1 bg-[#E2136E] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-[#c2105e] transition">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="hidden md:flex p-3 border rounded-lg hover:bg-gray-50 text-[#E2136E]">
               <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Delivery & Service Info */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm mt-4 text-[#191919]">
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              <span className="font-bold">Return:</span> 3 Days
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              <span className="font-bold">Exchange:</span> 3 Days
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span className="font-bold">Delivery:</span> 2 Days
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              <span className="font-bold">Payment:</span> COD Available
            </div>
          </div>

          {/* Seller Info */}
          <div className="mt-4 p-3 border rounded-lg bg-gray-50 flex items-center gap-3 w-fit">
            <Store className="w-5 h-5 text-primary" />
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden relative">
                    <Image src="https://d62ipmwrm4ymk.cloudfront.net/seller/3ced6351-a8d6-40ab-9349-e6b3091ca1a0.png" alt="seller" fill />
                </div>
                <span className="font-medium text-sm">Beauty Mart</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Description & Reviews Tabs --- */}
      <div className="mt-12">
        <div className="flex gap-6 border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "description"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 relative ${
              activeTab === "reviews"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            Product Reviews <span className="bg-[#E2136E]/10 text-[#E2136E] text-[10px] px-1.5 py-0.5 rounded-full ml-1">2</span>
          </button>
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="border rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>The face wash helps to get rid of dark spots and gives clean clear skin.</li>
                <li>This face wash effectively removes accumulated dirt, residue and impurities.</li>
                <li>It cleanses skin leaving it feeling fresh</li>
              </ul>
              <p className="font-bold mb-2">How To Use:</p>
              <p>Step 1 – Squeeze a pea-sized amount onto your palm and lather up</p>
              <p>Step 2 – Massage over wet face avoiding the eye area</p>
              <p>Step 3 – Rinse off with clean water and pat dry</p>
              <p>Step 3 – Use twice daily for best results</p>
            </div>
          )}
          
          {activeTab === "reviews" && (
            <div className="flex flex-col gap-4">
                {/* Sample Review Card */}
                <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-medium">Ahmed</h4>
                            <span className="text-xs text-gray-500">28-10-2025 | 6.20pm</span>
                        </div>
                        <div className="flex"><Star className="w-3 h-3 fill-[#E2136E] text-[#E2136E]" /></div>
                    </div>
                    <p className="text-sm text-gray-700">Packaging was so good. Product 100% authentic.</p>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Similar Products Section --- */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Similar Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Duplicating for demo purposes to match the dense grid in your design */}
          {similarProducts.map((product) => (
            <ProductCard key={`dup-${product.id}`} product={product} />
          ))}
        </div>
      </div>

      {/* --- Mobile Bottom Nav (Fixed) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 z-50 flex items-center justify-between gap-2 shadow-upper">
        <div className="flex flex-col items-center justify-center px-2">
            <ShoppingCart className="w-5 h-5 text-gray-600"/>
            <span className="text-[10px]">Cart</span>
        </div>
        <div className="flex flex-col items-center justify-center px-2 border-r pr-4">
            <MessageCircleMore className="w-5 h-5 text-gray-600"/>
            <span className="text-[10px]">Chat</span>
        </div>
        <button className="flex-1 bg-black text-white py-2 rounded text-sm font-medium">Buy Now</button>
        <button className="flex-1 bg-[#E2136E] text-white py-2 rounded text-sm font-medium">Add to Cart</button>
      </div>

    </div>
  );
}