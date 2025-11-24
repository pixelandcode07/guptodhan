'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, MapPin, Phone, Mail,
  Shield, Share2, Heart, Flag, ShoppingCart, AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// shadcn/ui Dialog Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
// import { useToast } from '@/components/ui/use-toast';

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
  createdAt: string;
  contactDetails: {
    name: string;
    phone: string;
    email?: string;
    isPhoneHidden: boolean;
  };
  isNegotiable?: boolean;
}

export default function AdDetailsClient({ ad }: { ad: Ad }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const { toast } = useToast();

  const handleReportSubmit = () => {
    if (!reportMessage.trim()) {
      toast({
        title: "Error",
        description: "Please write a reason for reporting this ad.",
        variant: "destructive",
      });
      return;
    }

    // Here you can send the report to your backend
    console.log("Report Submitted:", {
      adId: ad._id,
      adTitle: ad.title,
      reportedUser: ad.user.name,
      reason: reportMessage,
    });

    toast({
      title: "Report Submitted",
      description: "Thank you! We will review this ad shortly.",
    });

    setIsDialogOpen(false);
    setReportMessage('');
  };

  const breadcrumb = ['Home', ad.category.name, ad.subCategory.name, ad.title];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 text-sm">
          <nav className="flex items-center gap-2 flex-wrap text-gray-600">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center">
                {i > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />}
                {i === breadcrumb.length - 1 ? (
                  <span className="font-semibold text-gray-900">{crumb}</span>
                ) : (
                  <Link href="#" className="hover:text-green-600 transition">
                    {crumb}
                  </Link>
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
                    alt={`${ad.title} - Image ${selectedImage + 1}`}
                    fill
                    className="object-contain object-center p-4 lg:p-8"
                    priority={selectedImage === 0}
                    sizes="(max-width: 1024px) 100vw, 70vw"
                  />
                </div>

                {ad.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((i) => (i - 1 + ad.images.length) % ad.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all hover:scale-110 z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((i) => (i + 1) % ad.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all hover:scale-110 z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
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
                        className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all duration-200 ${
                          selectedImage === i
                            ? 'ring-4 ring-green-600 ring-offset-2'
                            : 'ring-2 ring-gray-300 hover:ring-gray-400'
                        }`}
                      >
                        <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="96px" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <div className={`prose max-w-none text-gray-700 ${!expandedDesc && 'line-clamp-6'}`}>
                <pre className="whitespace-pre-wrap font-sans">{ad.description}</pre>
              </div>
              {ad.description.length > 300 && (
                <button
                  onClick={() => setExpandedDesc(!expandedDesc)}
                  className="mt-3 text-green-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {expandedDesc ? 'Show Less' : 'Show More'}
                  <ChevronRight className={`w-5 h-5 transition-transform ${expandedDesc ? 'rotate-90' : ''}`} />
                </button>
              )}
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 shadow-xl border-0">
              <h1 className="text-2xl font-bold mb-3">{ad.title}</h1>
              {ad.brand && (
                <p className="text-lg text-gray-600 mb-2">
                  {ad.brand} {ad.productModel} {ad.edition}
                </p>
              )}

              <div className="flex items-center gap-4 mb-4">
                <p className="text-4xl font-bold text-green-600">৳{ad.price.toLocaleString()}</p>
                {ad.isNegotiable && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">Negotiable</Badge>
                )}
              </div>

              <div className="flex gap-3 mb-6">
                <Badge variant="outline" className="capitalize">{ad.condition}</Badge>
                <Badge className="bg-purple-100 text-purple-800 capitalize flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {ad.authenticity}
                </Badge>
              </div>

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-lg font-semibold">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
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

                {ad.contactDetails.email && (
                  <Button variant="outline" size="lg" className="w-full">
                    <Mail className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-5 h-5 mr-2" /> Save
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-5 h-5 mr-2" /> Share
                </Button>

                {/* Report Button with Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Flag className="w-5 h-5 text-red-600" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-6 h-6" />
                        Report This Ad
                      </DialogTitle>
                      <DialogDescription>
                        Help us keep Guptodhan safe. Tell us why you think this ad should be removed.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Ad Title</Label>
                        <p className="text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {ad.title}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Seller Name</Label>
                        <p className="text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {ad.user.name}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="report-reason">Reason for Reporting</Label>
                        <Textarea
                          id="report-reason"
                          placeholder="Please explain why you're reporting this ad (e.g., fake product, inappropriate content, spam, etc.)"
                          value={reportMessage}
                          onChange={(e) => setReportMessage(e.target.value)}
                          className="min-h-32 resize-none"
                        />
                      </div>
                    </div>

                    <DialogFooter className="flex gap-3 sm:justify-between">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleReportSubmit}
                      >
                        Submit Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                  <p className="text-sm text-gray-600">Member since 2024</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{ad.district}, {ad.division}</span>
              </div>

              {/* Extra Report Button (below) */}
              <Button
                variant="ghost"
                className="w-full mt-4 text-red-600 hover:bg-red-50"
                onClick={() => setIsDialogOpen(true)}
              >
                <Flag className="w-4 h-4 mr-2" />
                Report this Ad
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}