"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function DonationModal({ onSubmit }: { onSubmit?: (data: { title: string, description?: string, category?: string, image?: string }) => void }) {
    const router = useRouter()
    const search = useSearchParams()
    const open = (search?.get('donate') ?? '') === '1'
    const [imageUrls, setImageUrls] = React.useState<string[]>([])

    const close = () => {
        const params = new URLSearchParams(search?.toString() ?? '')
        params.delete('donate')
        router.replace(`/home/donation?${params.toString()}`, { scroll: false })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) close() }}>
            <DialogContent className="max-w-lg p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Basic Information</DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-6 space-y-4">
                    <div className="space-y-1">
                        <div className="text-xs text-gray-600">Select category</div>
                        <select id='donation-category' className='w-full h-9 border rounded-md px-3 text-sm'>
                            <option value="">Select an option</option>
                            <option value="clothes">Clothes</option>
                            <option value="food">Food</option>
                            <option value="books">Books</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-gray-600">Title</div>
                        <Input id='donation-title' placeholder="Enter title" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-gray-600">Description</div>
                        <Textarea id='donation-description' placeholder="Write details..." className='min-h-24' />
                    </div>
                    <div className="space-y-2">
                        <div className="text-xs text-gray-600">Upload Images (max 5)</div>
                        <div className='grid grid-cols-5 gap-2'>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className='h-20 border rounded-md flex items-center justify-center overflow-hidden bg-gray-50'>
                                    {imageUrls[i] ? (
                                        <img src={imageUrls[i]} alt={`Preview ${i + 1}`} className='h-full w-full object-cover' />
                                    ) : (
                                        <label htmlFor={`donation-image-${i}`} className='cursor-pointer w-full h-full flex items-center justify-center'>
                                            <span className='text-xs text-gray-500'>+</span>
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <input
                                key={i}
                                id={`donation-image-${i}`}
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        const url = URL.createObjectURL(file)
                                        setImageUrls(prev => {
                                            const newUrls = [...prev]
                                            newUrls[i] = url
                                            return newUrls
                                        })
                                    }
                                }}
                            />
                        ))}
                    </div>
                    <Button className='w-full bg-blue-500' onClick={() => {
                        const title = (document.getElementById('donation-title') as HTMLInputElement | null)?.value || ''
                        const category = (document.getElementById('donation-category') as HTMLSelectElement | null)?.value || undefined
                        const description = (document.getElementById('donation-description') as HTMLTextAreaElement | null)?.value || undefined
                        onSubmit?.({ title, category, description, image: imageUrls[0] })
                        router.push('/home/donation#browse-items')
                        const params = new URLSearchParams(search?.toString() ?? '')
                        params.delete('donate')
                        router.replace(`/home/donation?${params.toString()}`, { scroll: false })
                    }}>Submit</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


