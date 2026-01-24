// components/StoreTabs/AboutTab.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Store, MapPin, Info, Calendar } from "lucide-react";

interface AboutTabProps {
    store: {
        storeName: string;
        vendorShortDescription?: string;
        fullDescription?: string;
        storeAddress?: string;
        createdAt?: string;
    };
}

export default function AboutTab({ store }: AboutTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Store Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Store Intro */}
                <Card className="md:col-span-2 border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Store className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">About Our Store</h2>
                        </div>
                        
                        <div className="prose prose-slate max-w-none">
                            {store?.fullDescription ? (
                                <div 
                                    className="text-slate-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: store.fullDescription }} 
                                />
                            ) : (
                                <p className="text-slate-500 italic">No description available for this store.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Info Sidebar */}
                <div className="space-y-6">
                    {/* Location Card */}
                    <Card className="border-none shadow-sm bg-slate-50 rounded-3xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="w-5 h-5 text-red-500" />
                                <h3 className="font-bold text-slate-800">Location</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {store?.storeAddress || "Address not provided"}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Store Stats/Meta */}
                    <Card className="border-none shadow-sm bg-blue-50 rounded-3xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-slate-800">Member Since</h3>
                            </div>
                            <p className="text-sm text-slate-600">
                                {store?.createdAt ? new Date(store.createdAt).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }) : "Joined recently"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}