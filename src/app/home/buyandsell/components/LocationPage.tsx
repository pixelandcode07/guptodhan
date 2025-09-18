"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function LocationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const category = searchParams?.get("category") ?? "";
    const subcategory = searchParams?.get("subcategory") ?? "";

    const [location, setLocation] = useState("");

    const handleSubmit = () => {
        if (!location) {
            alert("Please select a location");
            return;
        }
        // Redirect to the next step with all query params
        router.push(
            `/home/buyandsell/product-form?category=${category}&subcategory=${subcategory}&location=${location}`
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Select Your Location</CardTitle>
                    <CardDescription>
                        You are posting in: <span className="font-semibold text-primary">{category}</span> / <span className="font-semibold text-primary">{subcategory}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="location-select">Location</Label>
                            <Select onValueChange={setLocation} value={location}>
                                <SelectTrigger id="location-select">
                                    <SelectValue placeholder="-- Select a Location --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Dhaka">Dhaka</SelectItem>
                                    <SelectItem value="Chattogram">Chattogram</SelectItem>
                                    <SelectItem value="Sylhet">Sylhet</SelectItem>
                                    <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                                    <SelectItem value="Khulna">Khulna</SelectItem>
                                    <SelectItem value="Barishal">Barishal</SelectItem>
                                    <SelectItem value="Rangpur">Rangpur</SelectItem>
                                    <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleSubmit} className="w-full">
                            Continue
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}