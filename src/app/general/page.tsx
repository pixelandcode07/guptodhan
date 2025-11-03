import React from 'react'
import HomePage from './home/page'
import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata'

export async function generateMetadata() {
    return generateGuptodhanMetadata({
        title: "Dashboard | Guptodhan Marketplace",
        description:
            "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.",
        urlPath: "/general/home",
        imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
    })
}

export default function DashMain() {
    return (
        <div>
            <HomePage />
            {/* This is this */}
        </div>
    )
}
