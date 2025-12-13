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
    icon?: string;
    status: 'active' | 'inactive';
}

interface DonationModalProps {
    onSubmit?: (data: { title: string, description?: string, category?: string, image?: string }) => void;
    categories?: DonationCategory[];
    onSuccess?: () => void; // Callback to refresh campaigns
}

export default function DonationModal({ onSubmit, categories = [], onSuccess }: DonationModalProps) {
    const router = useRouter()
    const search = useSearchParams()
    const { data: session } = useSession()
    const open = (search?.get('donate') ?? '') === '1'
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [itemType, setItemType] = useState<'money' | 'clothes' | 'food' | 'books' | 'other'>('other')
    const [goalAmount, setGoalAmount] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Function to derive item type from category name
    const getItemTypeFromCategory = (categoryId: string): 'money' | 'clothes' | 'food' | 'books' | 'other' => {
        const category = categories.find(cat => cat._id === categoryId)
        if (!category) return 'other'
        
        const categoryName = category.name.toLowerCase()
        
        // Map category names to item types
        if (categoryName.includes('money') || categoryName.includes('fund') || categoryName.includes('donation')) {
            return 'money'
        }
        if (categoryName.includes('cloth') || categoryName.includes('wear') || categoryName.includes('apparel')) {
            return 'clothes'
        }
        if (categoryName.includes('food') || categoryName.includes('meal') || categoryName.includes('grocery')) {
            return 'food'
        }
        if (categoryName.includes('book') || categoryName.includes('education') || categoryName.includes('study')) {
            return 'books'
        }
        
        return 'other'
    }

    // Update item type when category changes
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId)
        const derivedItemType = getItemTypeFromCategory(categoryId)
        setItemType(derivedItemType)
    }

    const close = () => {
        const params = new URLSearchParams(search?.toString() ?? '')
        params.delete('donate')
        router.replace(`/home/donation?${params.toString()}`, { scroll: false })
        // Reset form
        setSelectedCategory('')
        setItemType('other')
        setGoalAmount('')
        setImageUrls([])
        setImageFiles([])
        if (document.getElementById('donation-title')) (document.getElementById('donation-title') as HTMLInputElement).value = ''
        if (document.getElementById('donation-description')) (document.getElementById('donation-description') as HTMLTextAreaElement).value = ''
    }

    const handleSubmit = async () => {
        if (!session) {
            toast.error('Please login to create a donation campaign')
            return
        }

        const title = (document.getElementById('donation-title') as HTMLInputElement | null)?.value || ''
        const description = (document.getElementById('donation-description') as HTMLTextAreaElement | null)?.value || ''

        // Validation
        if (!selectedCategory) {
            toast.error('Please select a category')
            return
        }
        if (!title || title.length < 10) {
            toast.error('Title must be at least 10 characters')
            return
        }
        if (!description || description.length < 50) {
            toast.error('Description must be at least 50 characters')
            return
        }
        if (imageFiles.length === 0) {
            toast.error('Please upload at least one image')
            return
        }

        try {
            setIsSubmitting(true)

            // Get access token from session
            const token = (session as any)?.accessToken
            if (!token) {
                toast.error('Authentication required. Please login again.')
                return
            }

            // Create FormData
            const formData = new FormData()
            formData.append('category', selectedCategory)
            formData.append('title', title)
            formData.append('item', itemType)
            formData.append('description', description)
            if (goalAmount && itemType === 'money') {
                formData.append('goalAmount', goalAmount)
            }
            
            // Append all image files
            imageFiles.forEach((file) => {
                formData.append('images', file)
            })

            // Submit to API
            const response = await fetch('/api/v1/donation-campaigns', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Donation campaign created successfully!')
                // Call onSuccess callback to refresh campaigns
                onSuccess?.()
                // Also call the old onSubmit for backward compatibility
                onSubmit?.({ title, category: selectedCategory, description, image: imageUrls[0] })
                close()
                router.push('/home/donation#browse-items')
            } else {
                toast.error(result.message || 'Failed to create campaign')
            }
        } catch (error: any) {
            console.error('Error creating campaign:', error)
            toast.error(error.message || 'Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) close() }}>
            <DialogContent className="max-w-lg p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Basic Information</DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-6 space-y-4">
                    <div className="space-y-1">
                        <div className="text-xs text-gray-600">Select category *</div>
                        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories
                                    .filter(cat => cat.status === 'active')
                                    .map(cat => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        {selectedCategory && (
                            <p className="text-xs text-gray-500 mt-1">
                                Item type: <span className="font-medium capitalize">{itemType}</span>
                            </p>
                        )}
                    </div>
                    {itemType === 'money' && (
                        <div className="space-y-1">
                            <div className="text-xs text-gray-600">Goal Amount (Optional)</div>
                            <Input 
                                id='donation-goal-amount' 
                                type='number'
                                placeholder="Enter goal amount" 
                                value={goalAmount}
                                onChange={(e) => setGoalAmount(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="space-y-1">
                        <div className="text-xs text-gray-600">Title * (min 10 characters)</div>
                        <Input id='donation-title' placeholder="Enter title" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs text-gray-600">Description * (min 50 characters)</div>
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
                                        setImageFiles(prev => {
                                            const newFiles = [...prev]
                                            newFiles[i] = file
                                            return newFiles
                                        })
                                    }
                                }}
                            />
                        ))}
                    </div>
                    <Button 
                        className='w-full bg-blue-500' 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


