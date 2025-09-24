// 'use client';

import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import Image from 'next/image'
// import { useState } from 'react';


interface UploadImageBtnProps {
    value: File | null
    onChange: (file: File | null) => void
}

export default function UploadImageBtn({ value, onChange }: UploadImageBtnProps) {

    // const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
        }
    };
    return (
        <div className="mt-2">
            <label
                htmlFor="image"
                className="flex flex-col items-center justify-center h-52 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition"
            >
                {!value ? (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-400">PNG, JPG (max 1MB)</p>
                    </div>
                ) : (
                    <Image
                        src={URL.createObjectURL(value)}
                        alt="Preview"
                        width={500}
                        height={200}
                        className="w-full h-full object-cover rounded-lg"
                    />
                )}
            </label>
            <Input
                id="image"
                name="image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
            />
        </div>
    )
}
