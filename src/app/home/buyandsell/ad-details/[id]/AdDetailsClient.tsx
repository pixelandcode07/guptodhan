// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\home\buyandsell\ad-details\[id]\AdDetailsClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // ✅ Use NextAuth
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, MapPin, Phone, Mail,
  Shield, Share2, Heart, Flag, ShoppingCart, MessageCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import ReportDialog from '@/components/ReusableComponents/ReportDialog';

interface Ad {
  _id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  condition: string;
  authenticity: string;
  features: string[];
  brand?: string;
  productModel?: string;
  edition?: string;
  category: { name: string };
  subCategory: { name: string };
  division: string;
  district: string;
  upazila: string;
  user: { _id: string; name: string; profilePicture?: string };
  contactDetails: {
    name: string;
    phone: string;
    email?: string;
    isPhoneHidden: boolean;
  };
  isNegotiable?: boolean;
}

export default function AdDetailsClient({ ad }: { ad: Ad }) {
  const router = useRouter();
  const { data: session, status } = useSession(); // ✅ Get NextAuth session

  const [selectedImage, setSelectedImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [chatError, setChatError] = useState('');

  // ==========================================
  // HANDLE START CHAT
  // ==========================================
  const handleStartChat = async () => {
    setChatError('');

    // ✅ Check if user is authenticated with NextAuth
    if (status !== 'authenticated' || !session?.user) {
      router.push('/login'); // Redirect to login
      return;
    }

    // ✅ Get user ID from NextAuth session
    const userId = (session.user as any).id;
    const token = (session.user as any).accessToken;

    // Check if user is trying to chat with themselves
    if (userId === ad.user._id) {
      setChatError('You cannot start conversation with yourself');
      return;
    }

    try {
      setIsStartingChat(true);

      // Call API to start/get conversation
      const response = await fetch('/api/v1/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ✅ Use NextAuth token
        },
        body: JSON.stringify({
          adId: ad._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }

      const data = await response.json();
      const conversationId = data.data._id;

      // Navigate to chat page
      router.push(`/home/chat/${conversationId}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      setChatError('Failed to start conversation. Please try again.');
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 text-sm">
          <nav className="flex items-center gap-2 text-gray-600 flex-wrap">
            {['Home', ad.category.name, ad.subCategory.name, ad.title].map((crumb, i, arr) => (
              <span key={i} className="flex items-center">
                {i > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
                {i === arr.length - 1 ? (
                  <span className="font-semibold text-gray-900">{crumb}</span>
                ) : (
                  <Link href="#" className="hover:text-green-600">{crumb}</Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Images + Description */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            <Card className="overflow-hidden shadow-lg">
              <div className="relative bg-black">
                <div className="aspect-square lg:aspect-video w-full">
                  <Image
                    src={ad.images[selectedImage] || '/placeholder.png'}
                    alt={ad.title}
                    fill
                    className="object-contain p-4 lg:p-8"
                    priority={selectedImage === 0}
                    sizes="(max-width: 1024px) 100vw, 70vw"
                  />
                </div>

                {ad.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((i) => (i - 1 + ad.images.length) % ad.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-xl hover:scale-110 z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((i) => (i + 1) % ad.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-xl hover:scale-110 z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm z-10">
                      {selectedImage + 1} / {ad.images.length}
                    </div>
                  </>
                )}
              </div>

              {ad.images.length > 1 && (
                <div className="bg-gray-50 p-4 border-t">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    {ad.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`relative w-24 h-24 rounded-lg overflow-hidden ring-4 transition-all ${selectedImage === i ? 'ring-green-600' : 'ring-gray-300'
                          }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <div className={`text-gray-700 ${!expandedDesc && 'line-clamp-6'}`}>
                <pre className="whitespace-pre-wrap font-sans">{ad.description}</pre>
              </div>
              {ad.description.length > 300 && (
                <button
                  onClick={() => setExpandedDesc(!expandedDesc)}
                  className="mt-3 text-green-600 font-medium flex items-center gap-1"
                >
                  {expandedDesc ? 'Show Less' : 'Show More'}
                  <ChevronRight className={`w-5 h-5 transition ${expandedDesc ? 'rotate-90' : ''}`} />
                </button>
              )}
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 shadow-xl">
              <h1 className="text-2xl font-bold">{ad.title}</h1>
              {(ad.brand || ad.productModel || ad.edition) && (
                <p className="text-lg text-gray-600 mt-1">
                  {ad.brand} {ad.productModel} {ad.edition}
                </p>
              )}

              <div className="flex items-center gap-4 my-4">
                <p className="text-4xl font-bold text-green-600">৳{ad.price.toLocaleString()}</p>
                {ad.isNegotiable && <Badge>Negotiable</Badge>}
              </div>

              <div className="flex gap-3 mb-6">
                <Badge variant="outline" className="capitalize">{ad.condition}</Badge>
                <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {ad.authenticity}
                </Badge>
              </div>

              <Separator className="my-6" />

              {/* Error Message */}
              {chatError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {chatError}
                </div>
              )}

              <div className="space-y-3">
                {/* MESSAGE SELLER BUTTON (CHAT) */}
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleStartChat}
                  disabled={isStartingChat}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isStartingChat ? 'Starting Chat...' : 'Message Seller'}
                </Button>

                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="w-5 h-5 mr-2" /> Buy Now
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPhone(true)}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {showPhone || !ad.contactDetails.isPhoneHidden ? ad.contactDetails.phone : 'Show Phone Number'}
                </Button>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="flex-1"><Heart className="w-5 h-5 mr-2" /> Save</Button>
                <Button variant="outline" className="flex-1"><Share2 className="w-5 h-5 mr-2" /> Share</Button>

                {/* Report Dialog */}
                <ReportDialog
                  adId={ad._id}
                  adTitle={ad.title}
                  sellerName={ad.user.name}
                  trigger={
                    <Button variant="outline" size="icon">
                      <Flag className="w-5 h-5 text-red-600" />
                    </Button>
                  }
                />
              </div>

              <Separator className="my-6" />

              {/* Seller Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={ad.user.profilePicture} />
                  <AvatarFallback>{ad.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{ad.user.name}</p>
                  <p className="text-sm text-gray-600">Active on Guptodhan</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-5 h-5" />
                {ad.district}, {ad.division}
              </div>

              {/* Report Dialog Full Button */}
              <ReportDialog
                adId={ad._id}
                adTitle={ad.title}
                sellerName={ad.user.name}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}