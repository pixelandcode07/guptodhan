"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LocationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get category & subcategory from previous step
    const category = searchParams?.get("category") ?? "";
    const subcategory = searchParams?.get("subcategory") ?? "";

    const [location, setLocation] = useState("");

    const handleSubmit = () => {
        if (!location) return alert("Please select a location");

        // Redirect to product form page with query params
        router.push(
            `/home/buyandsell/product-form?category=${category}&subcategory=${subcategory}&location=${location}`
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h1 className="text-xl font-bold mb-4 text-center">Select Location</h1>
                <p className="text-gray-600 mb-4 text-center">
                    Category: <span className="font-semibold">{category}</span> <br />
                    Subcategory: <span className="font-semibold">{subcategory}</span>
                </p>

                {/* Dropdown / Input for location */}
                <select
                    className="w-full border rounded-md p-2 mb-4"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">-- Select Location --</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                </select>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
