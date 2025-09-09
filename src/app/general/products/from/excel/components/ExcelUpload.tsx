'use client';

import Image from 'next/image';
import Illustration from '../undraw_spreadsheets_383w.svg';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

export default function ExcelUpload() {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string>('No file chosen');

    return (
        <div className="bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs">
            <h2 className="text-base font-medium mb-4">Upload Products from Excel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className='w-full flex justify-center'>
                    <Image src={Illustration} alt="Excel Illustration" width={520} height={360} className='h-auto w-auto' />
                </div>
                <div>
                    <p className='text-sm text-gray-600 mb-4'>
                        You can upload products using an excel file, but the format must match our sample file. It is better to use our demo excel to feed data and then upload into our system.
                    </p>
                    <p className='text-sm mb-3'>Demo Excel File: <a href="#" className='text-blue-600 underline'>products.xlsx</a></p>

                    <label className='block text-sm font-medium mb-2'>Upload Excel File</label>
                    <div className='flex items-center gap-3 mb-4'>
                        <input ref={fileRef} type='file' accept='.xls,.xlsx' className='flex-1 h-10 border border-gray-300 rounded px-3'
                            onChange={(e) => setFileName(e.target.files?.[0]?.name || 'No file chosen')} />
                    </div>
                    <Button variant={'BlueBtn'} type='button' className='w-full md:w-auto'>
                        <Upload />
                        Upload Products
                    </Button>
                    <p className='text-xs text-gray-500 mt-3'>Please be patient, uploading products may take a few minutes depending on the volume of data.</p>
                </div>
            </div>
        </div>
    );
}


