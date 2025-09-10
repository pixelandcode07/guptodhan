import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";
import { Template } from "./MailTemplates";


export default function TemplateCard({
    template,
    active,
    onActivate,
    onPreview,
}: {
    template: Template;
    active: boolean;
    onActivate: () => void;
    onPreview: () => void;
}) {

    const [hovered, setHovered] = useState(false);
    return (
        <Card
            className={`relative transition-all rounded-xl shadow-md cursor-pointer ${active ? "border-2 border-green-500" : "border"
                }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-md font-semibold">
                    📧 {template.name}
                </CardTitle>
                <Switch checked={active} onCheckedChange={onActivate} />
            </CardHeader>
            <CardContent className="relative">
                <Image
                    src={template.img}
                    alt={template.name}
                    // className="rounded-md w-full border"
                    width={100}
                    height={100}
                    objectFit="cover"
                />

                {/* Eye button on hover */}
                {hovered && (
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-20 left-70 rounded-full shadow-md cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview();
                        }}
                    >
                        <Eye className="w-5 h-5" />
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
