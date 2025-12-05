'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Store, Facebook, Instagram, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface StoreData {
  _id: string;
  storeName: string;
  storeLogo: string;
  storeBanner: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  vendorShortDescription: string;
  fullDescription: string;
  commission?: number;
  storeSocialLinks?: {
    facebook?: string;
    whatsapp?: string;
    linkedIn?: string;
    tiktok?: string;
    twitter?: string;
    instagram?: string;
  };
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  productTitle: string;
  thumbnailImage: string;
  productPrice: number;
  discountPrice?: number;
  stock?: number;
  status: 'active' | 'inactive';
  brand?: { _id: string; name: string } | string;
  category?: { _id: string; name: string } | string;
}

interface StoreDetailsClientProps {
  storeData: StoreData;
  products?: Product[];
}

export default function StoreDetailsClient({ storeData, products = [] }: StoreDetailsClientProps) {
  const socialLinks = storeData.storeSocialLinks || {};
  const activeProducts = products.filter(p => p.status === 'active');

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-12"
    >
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-500 to-blue-600">
          {storeData.storeBanner ? (
            <Image
              src={storeData.storeBanner}
              alt={`${storeData.storeName} banner`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
        </div>

        {/* Store Info */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Logo */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg border-4 border-white shadow-lg -mt-12 sm:-mt-16">
              {storeData.storeLogo ? (
                <Image
                  src={storeData.storeLogo}
                  alt={storeData.storeName}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <Store className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Store Details */}
            <div className="flex-1 mt-4 sm:mt-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{storeData.storeName}</h1>
                <Badge 
                  variant={storeData.status === 'active' ? 'default' : 'secondary'}
                  className={storeData.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {storeData.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              {storeData.vendorShortDescription && (
                <p className="text-gray-600 mb-4">{storeData.vendorShortDescription}</p>
              )}

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {storeData.storeAddress && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0099cc]" />
                    <span>{storeData.storeAddress}</span>
                  </div>
                )}
                {storeData.storePhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0099cc]" />
                    <a href={`tel:${storeData.storePhone}`} className="hover:text-[#0099cc]">
                      {storeData.storePhone}
                    </a>
                  </div>
                )}
                {storeData.storeEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0099cc]" />
                    <a href={`mailto:${storeData.storeEmail}`} className="hover:text-[#0099cc]">
                      {storeData.storeEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {(socialLinks.facebook || socialLinks.instagram || socialLinks.twitter || socialLinks.linkedIn || socialLinks.whatsapp) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Follow Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {socialLinks.facebook && (
                <Link
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  <span>Facebook</span>
                </Link>
              )}
              {socialLinks.instagram && (
                <Link
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Instagram</span>
                </Link>
              )}
              {socialLinks.twitter && (
                <Link
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </Link>
              )}
              {socialLinks.linkedIn && (
                <Link
                  href={socialLinks.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </Link>
              )}
              {socialLinks.whatsapp && (
                <Link
                  href={`https://wa.me/${socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      {storeData.fullDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About Store</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: storeData.fullDescription }}
            />
          </CardContent>
        </Card>
      )}

      {/* Store Products */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Products from {storeData.storeName}
            {activeProducts.length > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({activeProducts.length} {activeProducts.length === 1 ? 'product' : 'products'})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Store className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No products available from this store</p>
              <p className="text-sm mt-2">Check back later for new products</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {activeProducts.map((product) => {
                const brandName = typeof product.brand === 'object' && product.brand !== null
                  ? product.brand.name
                  : 'No Brand';
                const categoryName = typeof product.category === 'object' && product.category !== null
                  ? product.category.name
                  : 'Category';
                const finalPrice = product.discountPrice || product.productPrice;
                const originalPrice = product.discountPrice ? product.productPrice : null;
                const discountPercent = product.discountPrice && product.productPrice
                  ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
                  : 0;

                return (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-[#0099cc]"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={product.thumbnailImage || '/placeholder-product.png'}
                        alt={product.productTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {discountPercent > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{discountPercent}%
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-[#0099cc] transition-colors">
                        {product.productTitle}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-[#0099cc]">
                          ৳{finalPrice.toLocaleString()}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ৳{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate">{brandName}</span>
                        {product.stock !== undefined && (
                          <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

