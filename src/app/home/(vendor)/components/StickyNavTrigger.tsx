'use client';

import { HeroNav } from "@/app/components/Hero/HeroNav";
import { useEffect, useState } from "react";

type StickyNavTriggerProps = {
    categories: any[];
};

export default function StickyNavTrigger({ categories }: StickyNavTriggerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const threshold = window.innerHeight * 0.5; // 50% of viewport height
            setIsVisible(window.scrollY > threshold);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isVisible
                    ? "translate-y-0 opacity-100 shadow-xl"
                    : "-translate-y-full opacity-0 pointer-events-none"
                }`}
        >
            <div className="bg-white border-b">
                <HeroNav categories={categories} />
            </div>
        </div>
    );
}