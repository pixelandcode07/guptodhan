// components/PageHeader.tsx
"use client"; // Client Component because it has interactive elements

import { Button } from "@/components/ui/button";

interface PageHeaderProps {
    title: string;
    buttonLabel?: string;        // optional button
    onButtonClick?: () => void;  // optional click handler
}

export default function PageHeader({
    title,
    buttonLabel,
    onButtonClick,
}: PageHeaderProps) {
    // default click handler if none is provided
    const handleClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            console.log(`${buttonLabel || "Button"} clicked`);
        }
    };

    return (
        <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-medium text-[#00005E]">{title}</h1>
            {buttonLabel && (
                <Button onClick={handleClick}>
                    {buttonLabel}
                </Button>
            )}
        </div>
    );
}
