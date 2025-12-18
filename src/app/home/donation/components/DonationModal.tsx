"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface DonationCategory {
    _id: string;
    name: string;
}

interface DonationModalProps {
    categories?: DonationCategory[];
    onSuccess?: () => void;
}

const ITEM_TYPES = [
    { value: 'money', label: 'Money / Fund' },
    { value: 'clothes', label: 'Clothes / Apparel' },
    { value: 'food', label: 'Food / Groceries' },
    { value: 'books', label: 'Books / Education' },
    { value: 'other', label: 'Other Items' }
];

export default function DonationModal({ categories = [], onSuccess }: DonationModalProps) {
    const router = useRouter()
    const search = useSearchParams()
    const { data: session } = useSession()
    
    const open = (search?.get('donate') ?? '') === '1'
    
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [itemType, setItemType] = useState<string>('other')
    const [goalAmount, setGoalAmount] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const close = () => {
        const params = new URLSearchParams(search?.toString() ?? '')
        params.delete('donate')
        router.replace(`/home/donation?${params.toString()}`, { scroll: false })
        
        setSelectedCategory('')
        setItemType('other')
        setGoalAmount('')
        setImageUrls([])
        setImageFiles([])
    }

    const handleSubmit = async () => {
        if (!session) {
            toast.error('Please login to donate')
            return
        }

        const title = (document.getElementById('donation-title') as HTMLInputElement)?.value
        const description = (document.getElementById('donation-description') as HTMLTextAreaElement)?.value

        // 🔥 Frontend Validation Logic
        if (!selectedCategory) {
            toast.error('Please select a category')
            return
        }

        // ✅ Title Length Check
        if (!title || title.length < 10) {
            toast.error('Title is too short. It must be at least 10 characters.')
            return
        }

        // ✅ Description Length Check
        if (!description || description.length < 50) {
            toast.error('Description is too short. Please provide at least 50 characters.')
            return
        }

        if (imageFiles.length === 0) {
            toast.error('Please upload at least one image')
            return
        }

        if (itemType === 'money' && !goalAmount) {
            toast.error('Please enter goal amount')
            return
        }

        try {
            setIsSubmitting(true)
            const token = (session as any)?.accessToken

            const formData = new FormData()
            formData.append('category', selectedCategory)
            formData.append('title', title)
            formData.append('item', itemType)
            formData.append('description', description)
            if (itemType === 'money' && goalAmount) formData.append('goalAmount', goalAmount)
            
            imageFiles.forEach((file) => formData.append('images', file))

            const response = await fetch('/api/v1/donation-campaigns', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Campaign created successfully!')
                onSuccess?.() 
                close()
            } else {
                // Show server-side validation error if any
                toast.error(result.message || 'Failed to create campaign')
            }
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setImageUrls(prev => {
                const newUrls = [...prev]
                newUrls[index] = url
                return newUrls
            })
            setImageFiles(prev => {
                const newFiles = [...prev]
                newFiles[index] = file
                return newFiles
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && close()}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Donation Campaign</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Category <span className='text-red-500'>*</span></label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.length > 0 ? (
                                    categories.map(cat => (
                                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-center text-gray-500">No categories available</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Donation Type <span className='text-red-500'>*</span></label>
                        <Select value={itemType} onValueChange={setItemType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="What are you donating?" />
                            </SelectTrigger>
                            <SelectContent>
                                {ITEM_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Title <span className='text-red-500'>*</span> (Min 10 chars)</label>
                        <Input id="donation-title" placeholder="e.g. Winter Clothes for Poor" />
                    </div>

                    {itemType === 'money' && (
                        <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-medium">Goal Amount (Tk) <span className='text-red-500'>*</span></label>
                            <Input 
                                type="number" 
                                value={goalAmount} 
                                onChange={(e) => setGoalAmount(e.target.value)} 
                                placeholder="5000" 
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Description <span className='text-red-500'>*</span> (Min 50 chars)</label>
                        <Textarea id="donation-description" placeholder="Describe your campaign in detail..." className="min-h-[100px]" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Images (Max 5) <span className='text-red-500'>*</span></label>
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="aspect-square border rounded-md relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => handleImageUpload(e, i)}
                                    />
                                    {imageUrls[i] ? (
                                        <img src={imageUrls[i]} alt="upload" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-2xl">+</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Campaign'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}