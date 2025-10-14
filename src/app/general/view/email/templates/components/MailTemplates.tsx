"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import TemplateCard from "./TemplateCard";
import Image from "next/image";

export type Template = {
    id: string;
    name: string;
    img: string;
};

const templates: Template[] = [
    { id: "regular", name: "Regular", img: "/img/regular.png" },
    { id: "classic", name: "Classic", img: "/img/classic.png" },
];

export default function MailTemplates() {
    const [activeTemplate, setActiveTemplate] = useState<string>("regular");
    const [previewImg, setPreviewImg] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">
                Choose Your Default Order Placed Mail Templates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        active={activeTemplate === template.id}
                        onActivate={() => setActiveTemplate(template.id)}
                        onPreview={() => setPreviewImg(template.img)}
                    />
                ))}
            </div>

            {/* Modal for image preview */}
            <Dialog open={!!previewImg} onOpenChange={() => setPreviewImg(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Template Preview</DialogTitle>
                    </DialogHeader>
                    {previewImg && (
                        <Image
                            src={previewImg}
                            alt="Template Preview"
                            width={400}
                            height={100}
                            className="object-contain"
                        // className="w-full rounded-lg border"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
