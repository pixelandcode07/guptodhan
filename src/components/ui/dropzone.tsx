'use client';

import React, { useCallback, useRef, useState } from 'react';

type DropzoneProps = {
    onFiles: (files: FileList) => void;
    accept?: string;
    label?: string;
};

export default function Dropzone({ onFiles, accept = 'image/*', label }: DropzoneProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = useCallback((files: FileList | null) => {
        if (files && files.length > 0) {
            onFiles(files);
        }
    }, [onFiles]);

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    return (
        <div className='w-full'>
            {label && <p className='mb-2 text-sm'>{label}</p>}
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => inputRef.current?.click()}
                className={`flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-md cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h10a4 4 0 004-4V9a4 4 0 00-4-4h-3.5m-2-2L7 9m0 0l-4-4m4 4v12" />
                </svg>
                <p className='text-xs mt-2 text-gray-500'>Drag and drop a file here or click</p>
            </div>
            <input
                ref={inputRef}
                type='file'
                accept={accept}
                className='hidden'
                onChange={(e) => handleFiles(e.target.files)}
            />
        </div>
    );
}


