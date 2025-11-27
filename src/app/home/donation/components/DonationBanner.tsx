"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface DonationConfig {
    title: string;
    image: string;
    shortDescription: string;
    buttonText: string;
    buttonUrl: string;
}

export default function DonationBanner() {
    const [config, setConfig] = useState<DonationConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch('/api/v1/public/donation-configs');
                const result = await response.json();
                if (result.success && result.data) {
                    setConfig(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch donation config:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    if (loading) {
        return (
            <div className="banner py-5">
                <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-md"></div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="banner py-5">
                <Image src="/img/banner.png" width={1000} height={300} alt="Donation banner" className='w-full' />
            </div>
        );
    }

    return (
        <div>
            <div className="banner py-5">
                <Image 
                    src={config.image || "/img/banner.png"} 
                    width={1000} 
                    height={300} 
                    alt={config.title || "Donation banner"} 
                    className='w-full' 
                />
            </div>
        </div>
    )
}


