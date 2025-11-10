

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Phone, Mail, Shield, Star, MessageCircle, Share2, Heart, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface Ad {
  _id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  condition: string;
  authenticity: string;
  features: string[];
  district: string;
  division: string;
  upazila: string;
  brand?: { name: string };
  subCategory?: { name: string };
  user: { _id: string; name: string; profilePicture?: string };
  createdAt: string;
  contactDetails: {
    name: string;
    phone: string;
    email?: string;
    isPhoneHidden: boolean;
  };
}

export default function AdDetailsClient({ ad }: { ad: Ad }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedDesc, setExpandedDesc] = useState(false);

  const breadcrumb = ['Home', 'Buy & Sell', ad.subCategory?.name || 'Category', ad.title];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2 text-xs sm:text-sm text-gray-600">
          <nav className="flex items-center gap-1 flex-wrap">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center">
                {i > 0 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1" />}
                {i === breadcrumb.length - 1 ? (
                  <span className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">{crumb}</span>
                ) : (
                  <Link href="#" className="hover:text-green-600 truncate">{crumb}</Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Images + Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-square sm:aspect-video bg-gray-100">
                <Image
                  src={ad.images[selectedImage] || '/placeholder.png'}
                  alt={ad.title}
                  fill
                  className="object-cover"
                />
                {ad.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((i) => (i - 1 + ad.images.length) % ad.images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((i) => (i + 1) % ad.images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {ad.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {ad.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === i ? 'border-green-600' : 'border-gray-300'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Description */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <div className={`text-sm text-gray-700 ${!expandedDesc && 'line-clamp-4'}`}>
                {ad.description}
              </div>
              {ad.description.length > 200 && (
                <button
                  onClick={() => setExpandedDesc(!expandedDesc)}
                  className="text-green-600 text-sm font-medium mt-2 flex items-center gap-1"
                >
                  {expandedDesc ? 'See Less' : 'See More'}
                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedDesc ? 'rotate-90' : ''}`} />
                </button>
              )}
            </Card>

            {/* Features */}
            {ad.features?.length > 0 && (
              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {ad.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-green-600 rounded-full" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Reviews & Q&A Tabs */}
            <Tabs defaultValue="reviews" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
                <TabsTrigger value="qa">Questions (1234)</TabsTrigger>
              </TabsList>

              <TabsContent value="reviews" className="mt-4">
                <Card className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <p className="text-3xl font-bold">4.5</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">539 reviews</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span>{star}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: star === 5 ? '80%' : '60%' }} />
                          </div>
                          <span className="text-gray-600">4.28k</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-6">
                    {[
                      {
                        name: 'Vertric honer',
                        verified: true,
                        rating: 5,
                        date: '1 year ago',
                        text: 'I was a bit nervous to be buying a secondhand phone from Amazon, but I couldn\'t be happier with my purchase!! It was super easy to set up and the phone works and looks great. It truly was in excellent condition. Highly recommend!!!',
                        images: ['/review1.jpg', '/review2.jpg', '/review3.jpg'],
                        sellerReply: 'Thank you very much on behalf of Larkspur Shop. Keep following Larkspur Shop to get better products in the future too.',
                      },
                    ].map((review, i) => (
                      <div key={i} className="border-b pb-4 last:border-0">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>VH</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{review.name}</p>
                              {review.verified && <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>}
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{review.text}</p>
                            {review.images && (
                              <div className="flex gap-2 mt-2">
                                {review.images.map((img, k) => (
                                  <div key={k} className="w-16 h-16 rounded-lg overflow-hidden">
                                    <Image src={img} alt="" width={64} height={64} className="object-cover" />
                                  </div>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                            {review.sellerReply && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs font-medium flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" /> Seller Response
                                </p>
                                <p className="text-xs text-gray-700 mt-1">{review.sellerReply}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="link" className="mt-4">See More 1289 reviews</Button>
                </Card>
              </TabsContent>

              <TabsContent value="qa" className="mt-4">
                <Card className="p-4">
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Enter your questions here"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <Button className="bg-blue-600">Ask Question</Button>
                  </div>

                  <div className="space-y-4">
                    {['There appears to be a discrepancy in the serving information?'].map((q, i) => (
                      <div key={i} className="border-b pb-4">
                        <div className="flex gap-2">
                          <MessageCircle className="w-5 h-5 text-blue-600 shrink-0" />
                          <div>
                            <p className="font-medium text-sm">{q}</p>
                            <p className="text-xs text-gray-500">Riya Sharma • 6 months ago</p>
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs font-medium">Question Answered by - ABC Shop</p>
                              <p className="text-xs text-gray-700 mt-1">{q}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Price, Seller, Actions */}
          <div className="space-y-4">
            <Card className="p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold mb-2">{ad.title}</h1>

              <div className="flex items-baseline gap-2 mb-3">
                <p className="text-3xl font-bold text-green-600">৳{ad.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500 line-through">৳{(ad.price * 1.2).toLocaleString()}</p>
                <Badge variant="destructive">-20%</Badge>
              </div>

              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">{ad.condition}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {ad.authenticity}
                </Badge>
              </div>

              <Separator className="my-4" />

              {/* Seller Info */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Sold by</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={ad.user.profilePicture} />
                    <AvatarFallback>{ad.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{ad.user.name}</p>
                    <div className="flex gap-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> 100% Positive
                      </span>
                      <span>|</span>
                      <span>Ship on Time 90%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{ad.district}, {ad.division}</span>
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-4">
                <Button className="w-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  {ad.contactDetails.isPhoneHidden ? 'Show Phone' : ad.contactDetails.phone}
                </Button>
                {ad.contactDetails.email && (
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-1" /> Save
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </Button>
              </div>
            </Card>

            {/* Delivery Info */}
            <Card className="p-4 text-sm">
              <h3 className="font-semibold mb-2">Delivery Options</h3>
              <p className="text-green-600 mb-1">Available Delivery Area: All over Bangladesh</p>
              <p className="mb-1">Delivery Time: 1-7 working days</p>
              <p className="mb-1">Shipping Charge: Tk 70</p>
              <p className="text-green-600">Free Shipping Over Order Amount: Tk 10,000</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}