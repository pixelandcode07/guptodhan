"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, X, Upload } from 'lucide-react'

interface DonationCategory {
    _id: string;
    name: string;
}

interface DonationModalProps {
    categories?: DonationCategory[];
    onSuccess?: () => void;
}

const ITEM_TYPES = [
    { value: 'money', label: '💰 Money / Fund' },
    { value: 'clothes', label: '👕 Clothes / Apparel' },
    { value: 'food', label: '🍛 Food / Groceries' },
    { value: 'books', label: '📚 Books / Education' },
    { value: 'other', label: '📦 Other Items' }
];

export default function DonationModal({ categories = [], onSuccess }: DonationModalProps) {
    const router = useRouter()
    const search = useSearchParams()
    const { data: session, status } = useSession()
    
    // State Management
    const [isOpen, setIsOpen] = useState(false)
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [itemType, setItemType] = useState<string>('other')
    const [goalAmount, setGoalAmount] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    // Form field refs
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    })

    // ✅ Open/Close Modal Logic
    useEffect(() => {
        setIsOpen(search?.get('donate') === '1')
    }, [search])

    const close = () => {
        setIsOpen(false)
        
        setTimeout(() => {
            const params = new URLSearchParams(search?.toString() ?? '')
            params.delete('donate')
            const queryString = params.toString()
            router.replace(`/home/donation${queryString ? `?${queryString}` : ''}`, { 
                scroll: false 
            })
            
            // Reset form
            setFormData({ title: '', description: '' })
            setSelectedCategory('')
            setItemType('other')
            setGoalAmount('')
            setImageUrls([])
            setImageFiles([])
            setFormErrors({})
        }, 100)
    }

    // ✅ Validation Logic
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

        if (!selectedCategory) {
            errors.category = 'Category is required'
        }

        if (!formData.title || formData.title.trim().length < 10) {
            errors.title = 'Title must be at least 10 characters'
        } else if (formData.title.length > 200) {
            errors.title = 'Title must be less than 200 characters'
        }

        if (!formData.description || formData.description.trim().length < 50) {
            errors.description = 'Description must be at least 50 characters'
        }

        if (imageFiles.length === 0) {
            errors.images = 'Please upload at least one image'
        }

        if (itemType === 'money') {
            if (!goalAmount || parseFloat(goalAmount) <= 0) {
                errors.goalAmount = 'Please enter a valid goal amount'
            } else if (parseFloat(goalAmount) > 10000000) {
                errors.goalAmount = 'Goal amount cannot exceed 10,000,000'
            }
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // ✅ Image Upload Handler
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        
        if (!file) return

        // File validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('Image size must be less than 5MB')
            return
        }

        // Add image to array
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

        // Clear error for images
        if (formErrors.images) {
            setFormErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors.images
                return newErrors
            })
        }
    }

    // ✅ Remove Image
    const removeImage = (index: number) => {
        // Revoke object URL
        if (imageUrls[index]) {
            URL.revokeObjectURL(imageUrls[index])
        }

        setImageUrls(prev => {
            const newUrls = [...prev]
            newUrls.splice(index, 1)
            return newUrls
        })

        setImageFiles(prev => {
            const newFiles = [...prev]
            newFiles.splice(index, 1)
            return newFiles
        })
    }

    // ✅ Submit Handler
    const handleSubmit = async () => {
        // Check authentication
        if (status === 'unauthenticated') {
            toast.error('Please login to create a donation campaign')
            return
        }

        if (status === 'loading') {
            toast.loading('Checking authentication...')
            return
        }

        // Validate form
        if (!validateForm()) {
            toast.error('Please fix the errors in the form')
            return
        }

        try {
            setIsSubmitting(true)
            const token = (session as any)?.accessToken

            if (!token) {
                toast.error('Authentication token not found. Please login again.')
                return
            }

            // Prepare FormData
            const requestFormData = new FormData()
            requestFormData.append('category', selectedCategory)
            requestFormData.append('title', formData.title.trim())
            requestFormData.append('item', itemType)
            requestFormData.append('description', formData.description.trim())
            
            if (itemType === 'money' && goalAmount) {
                requestFormData.append('goalAmount', parseFloat(goalAmount).toString())
            }
            
            // Add only non-empty image files
            imageFiles.forEach((file) => {
                if (file) {
                    requestFormData.append('images', file)
                }
            })

            // API Call
            const response = await fetch('/api/v1/donation-campaigns', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: requestFormData,
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Failed to create campaign')
            }

            if (result.success) {
                toast.success('🎉 Campaign created successfully! Awaiting admin approval.')
                onSuccess?.()
                close()
            } else {
                throw new Error(result.message || 'Failed to create campaign')
            }
        } catch (error) {
            console.error('Campaign creation error:', error)
            
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('Something went wrong. Please try again.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    // ✅ Handle Input Changes
    const handleFormChange = (field: 'title' | 'description', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Clear error for this field
        if (formErrors[field]) {
            setFormErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    // ✅ Handle Category Change
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value)
        if (formErrors.category) {
            setFormErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors.category
                return newErrors
            })
        }
    }

    // ✅ Handle Goal Amount Change
    const handleGoalAmountChange = (value: string) => {
        setGoalAmount(value)
        if (formErrors.goalAmount) {
            setFormErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors.goalAmount
                return newErrors
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(v) => !v && close()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-2xl font-bold">Create Donation Campaign</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">Help others by creating a donation campaign</p>
                </DialogHeader>
                
                <div className="space-y-5 py-4">
                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Category <span className='text-red-500'>*</span>
                        </label>
                        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger className={`w-full ${formErrors.category ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories && categories.length > 0 ? (
                                    categories.map(cat => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-center text-gray-500">
                                        No categories available
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                        {formErrors.category && (
                            <p className="text-xs text-red-500">{formErrors.category}</p>
                        )}
                    </div>

                    {/* Donation Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            What are you donating? <span className='text-red-500'>*</span>
                        </label>
                        <Select value={itemType} onValueChange={setItemType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select donation type" />
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

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Campaign Title <span className='text-red-500'>*</span>
                        </label>
                        <Input
                            value={formData.title}
                            onChange={(e) => handleFormChange('title', e.target.value)}
                            placeholder="e.g., Winter Clothes for Underprivileged Children"
                            className={`${formErrors.title ? 'border-red-500' : ''}`}
                            maxLength={200}
                        />
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">Minimum 10 characters</p>
                            <p className="text-xs text-gray-500">{formData.title.length}/200</p>
                        </div>
                        {formErrors.title && (
                            <p className="text-xs text-red-500">{formErrors.title}</p>
                        )}
                    </div>

                    {/* Goal Amount (conditional) */}
                    {itemType === 'money' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-sm font-semibold text-gray-700">
                                Fundraising Goal (৳) <span className='text-red-500'>*</span>
                            </label>
                            <Input
                                type="number"
                                value={goalAmount}
                                onChange={(e) => handleGoalAmountChange(e.target.value)}
                                placeholder="e.g., 50000"
                                className={`${formErrors.goalAmount ? 'border-red-500' : ''}`}
                                min="0"
                                step="1000"
                            />
                            {formErrors.goalAmount && (
                                <p className="text-xs text-red-500">{formErrors.goalAmount}</p>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Campaign Description <span className='text-red-500'>*</span>
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                            placeholder="Describe your campaign in detail. Who needs help? Why are you starting this campaign?"
                            className={`min-h-[120px] resize-none ${formErrors.description ? 'border-red-500' : ''}`}
                        />
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">Minimum 50 characters</p>
                            <p className="text-xs text-gray-500">{formData.description.length}/1000</p>
                        </div>
                        {formErrors.description && (
                            <p className="text-xs text-red-500">{formErrors.description}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Upload Images <span className='text-red-500'>*</span>
                        </label>
                        <p className="text-xs text-gray-500">You can upload up to 5 images (Max 5MB each)</p>
                        
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-square border-2 border-dashed rounded-lg relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition cursor-pointer group"
                                >
                                    {imageUrls[i] ? (
                                        <>
                                            <img
                                                src={imageUrls[i]}
                                                alt={`upload-${i}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <Upload size={20} />
                                        </div>
                                    )}
                                    
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => handleImageUpload(e, i)}
                                    />
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                            {imageFiles.length > 0 && `${imageFiles.length} image(s) selected`}
                        </div>
                        
                        {formErrors.images && (
                            <p className="text-xs text-red-500">{formErrors.images}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 rounded-lg"
                        disabled={isSubmitting || status === 'loading'}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Campaign...
                            </>
                        ) : (
                            'Create Campaign'
                        )}
                    </Button>

                    {/* Info Text */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                            ℹ️ Your campaign will be reviewed by our admin team before it goes live. You'll be notified once it's approved.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}