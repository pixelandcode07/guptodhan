

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Shield,
  Share2,
  Heart,
  Flag,
  MessageCircle,
  Home,
  ChevronRight as ChevronRightIcon,
  Check,
  Copy
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import ReportDialog from '@/components/ReusableComponents/ReportDialog';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const { data: session, status } = useSession();

  const [selectedImage, setSelectedImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [chatError, setChatError] = useState('');

  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleStartChat = async () => {
    setChatError('');

    if (status !== 'authenticated' || !session?.user) {
      router.push('/login');
      return;
    }

    const userId = (session.user as any).id;
    const token = (session.user as any).accessToken;

    if (userId === ad.user._id) {
      setChatError('You cannot start conversation with yourself');
      return;
    }

    try {
      setIsStartingChat(true);
      const response = await fetch('/api/v1/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ adId: ad._id }),
      });

      if (!response.ok) throw new Error('Failed to start conversation');
      const data = await response.json();
      router.push(`/home/chat/${data.data._id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      setChatError('Failed to start conversation. Please try again.');
    } finally {
      setIsStartingChat(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Shadcn Breadcrumb */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1.5 hover:text-green-600">
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRightIcon className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="hover:text-green-600">
                    {ad.category.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRightIcon className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="hover:text-green-600">
                    {ad.subCategory.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRightIcon className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-gray-900 max-w-[200px] md:max-w-none truncate">
                  {ad.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Left Column */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden rounded-2xl shadow-2xl bg-white">
              <div className="relative bg-gradient-to-b from-black/10 to-transparent">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    className="aspect-square md:aspect-[4/3] lg:aspect-video relative w-full"
                  >
                    <Image
                      src={ad.images[selectedImage] || '/placeholder.png'}
                      alt={ad.title}
                      fill
                      className="object-contain p-6 md:p-10 lg:p-12"
                      priority={selectedImage === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {ad.images.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage((prev) => (prev - 1 + ad.images.length) % ad.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 rounded-full shadow-xl z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage((prev) => (prev + 1) % ad.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 rounded-full shadow-xl z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>

                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
                      {selectedImage + 1} / {ad.images.length}
                    </div>
                  </>
                )}
              </div>

              {ad.images.length > 1 && (
                <div className="bg-gray-50/80 p-4 border-t">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                    {ad.images.map((img, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedImage(i)}
                        className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden ring-4 transition-all ${selectedImage === i
                          ? 'ring-green-500 shadow-lg shadow-green-500/30'
                          : 'ring-transparent'
                          }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <Card className="p-6 md:p-8 rounded-2xl shadow-xl bg-white">
                <h2 className="text-2xl font-bold mb-5 text-gray-900">Description</h2>
                <div className={`text-gray-700 leading-relaxed text-base ${!expandedDesc && 'line-clamp-6'}`}>
                  <pre className="whitespace-pre-wrap font-sans">{ad.description}</pre>
                </div>
                {ad.description.length > 300 && (
                  <button
                    onClick={() => setExpandedDesc(!expandedDesc)}
                    className="mt-5 text-green-600 font-medium flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    {expandedDesc ? 'Show Less' : 'Show More'}
                    <ChevronRight className={`w-5 h-5 transition-transform ${expandedDesc ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </Card>
            </motion.div>
          </motion.div>

          {/* Right Sidebar - Sticky */}
          <motion.div variants={itemVariants} className="lg:sticky lg:top-6 h-fit">
            <Card className="p-6 md:p-8 rounded-2xl shadow-2xl bg-white">
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{ad.title}</h1>
                  {(ad.brand || ad.productModel || ad.edition) && (
                    <p className="text-lg text-gray-600 mt-1.5 font-medium">
                      {ad.brand} {ad.productModel} {ad.edition}
                    </p>
                  )}
                </div>

                <div className="flex items-end gap-3">
                  <p className="text-3xl md:text-4xl font-bold text-green-600">৳{ad.price.toLocaleString()}</p>
                  {ad.isNegotiable && (
                    <Badge className="px-3 py-1 bg-green-100 text-green-800 font-medium">Negotiable</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="px-3 py-1.5 capitalize font-medium">
                    {ad.condition}
                  </Badge>
                  <Badge className="px-3 py-1.5 bg-purple-100 text-purple-800 flex items-center gap-1.5 font-medium">
                    <Shield className="w-4 h-4" />
                    {ad.authenticity}
                  </Badge>
                </div>

                <Separator className="my-6" />

                {chatError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                  >
                    {chatError}
                  </motion.div>
                )}

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 shadow-md"
                    onClick={handleStartChat}
                    disabled={isStartingChat}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {isStartingChat ? 'Starting Chat...' : 'Message Seller'}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2"
                    onClick={() => setShowPhone(true)}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {showPhone || !ad.contactDetails.isPhoneHidden
                      ? ad.contactDetails.phone
                      : 'Show Phone Number'}
                  </Button>
                </div>

                <div className="flex gap-3">
                  {/* <Button variant="outline" className="flex-1">
                    <Heart className="w-5 h-5 mr-2" /> Save
                  </Button> */}
                  <Dialog open={openShareDialog} onOpenChange={setOpenShareDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="w-5 h-5 mr-2" /> Share
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share this ad</DialogTitle>
                        <DialogDescription>
                          Copy the link below to share this ad with others.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center space-x-2 mt-4">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">Link</Label>
                          <Input
                            id="link"
                            defaultValue={currentUrl}
                            readOnly
                            className="h-10"
                          />
                        </div>
                        <Button
                          size="sm"
                          className="px-3"
                          onClick={handleCopyLink}
                        >
                          <span className="sr-only">Copy</span>
                          {copied ? (
                            <Check className="h-4 w-4 text-white" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {copied && (
                        <p className="text-sm text-green-600 mt-2 text-center font-medium">
                          Link copied to clipboard!
                        </p>
                      )}
                    </DialogContent>
                  </Dialog>
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

                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 ring-4 ring-green-100">
                    <AvatarImage src={ad.user.profilePicture} />
                    <AvatarFallback className="font-semibold">{ad.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg">{ad.user.name}</p>
                    <p className="text-sm text-gray-600">Active on Guptodhan</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{ad.district}, {ad.division}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}