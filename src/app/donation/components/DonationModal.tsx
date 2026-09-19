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
    
    const [isOpen, setIsOpen] = useState(false)
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [itemType, setItemType] = useState<string>('other')
    
    // Form States
    const [goalAmount, setGoalAmount] = useState<string>('')
    const [quantity, setQuantity] = useState<string>('1') // ✅ Default 1
    const [endDate, setEndDate] = useState<string>('')    // ✅ Date field

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        title: '',
        description: ''
    })

    useEffect(() => {
        setIsOpen(search?.get('donate') === '1')
    }, [search])

    const close = () => {
        setIsOpen(false)
        setTimeout(() => {
            const params = new URLSearchParams(search?.toString() ?? '')
            params.delete('donate')
            const queryString = params.toString()
            router.replace(`/donation${queryString ? `?${queryString}` : ''}`, { scroll: false })
            
            setFormData({ title: '', description: '' })
            setSelectedCategory('')
            setItemType('other')
            setGoalAmount('')
            setQuantity('1')
            setEndDate('')
            setImageUrls([])
            setImageFiles([])
            setFormErrors({})
        }, 100)
    }

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

        if (!selectedCategory) errors.category = 'Category is required'

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
            }
        } else {
            // ✅ Validation for non-money items
            if (!quantity || parseInt(quantity) < 1) {
                errors.quantity = 'Quantity must be at least 1'
            }
            if (!endDate) {
                errors.endDate = 'Please select a valid expiry date'
            } else {
                const selectedDate = new Date(endDate);
                const today = new Date();
                today.setHours(0,0,0,0);
                if (selectedDate < today) {
                    errors.endDate = 'Expiry date cannot be in the past'
                }
            }
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB')
            return
        }

        const url = URL.createObjectURL(file)
        setImageUrls(prev => { const newUrls = [...prev]; newUrls[index] = url; return newUrls })
        setImageFiles(prev => { const newFiles = [...prev]; newFiles[index] = file; return newFiles })

        if (formErrors.images) {
            setFormErrors(prev => { const newErrors = { ...prev }; delete newErrors.images; return newErrors })
        }
    }

    const removeImage = (index: number) => {
        if (imageUrls[index]) URL.revokeObjectURL(imageUrls[index])
        setImageUrls(prev => { const newUrls = [...prev]; newUrls.splice(index, 1); return newUrls })
        setImageFiles(prev => { const newFiles = [...prev]; newFiles.splice(index, 1); return newFiles })
    }

    const handleSubmit = async () => {
        if (status === 'unauthenticated') {
            toast.error('Please login to create a donation campaign')
            return
        }

        if (!validateForm()) {
            toast.error('Please fix the errors in the form')
            return
        }

        try {
            setIsSubmitting(true)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session as any)?.accessToken

            const requestFormData = new FormData()
            requestFormData.append('category', selectedCategory)
            requestFormData.append('title', formData.title.trim())
            requestFormData.append('item', itemType)
            requestFormData.append('description', formData.description.trim())
            
            if (itemType === 'money' && goalAmount) {
                requestFormData.append('goalAmount', parseFloat(goalAmount).toString())
            } else {
                // ✅ Append Quantity and Date for physical items
                requestFormData.append('quantity', quantity.toString())
                requestFormData.append('endDate', endDate)
            }
            
            imageFiles.forEach((file) => {
                if (file) requestFormData.append('images', file)
            })

            const response = await fetch('/api/v1/donation-campaigns', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: requestFormData,
            })

            const result = await response.json()

            if (result.success) {
                toast.success('🎉 Campaign created successfully! Awaiting admin approval.')
                onSuccess?.()
                close()
            } else {
                throw new Error(result.message || 'Failed to create campaign')
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
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
                        <label className="text-sm font-semibold text-gray-700">Category <span className='text-red-500'>*</span></label>
                        <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setFormErrors(p => ({...p, category: ''})) }}>
                            <SelectTrigger className={`w-full ${formErrors.category ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map(cat => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
                    </div>

                    {/* Item Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">What are you donating? <span className='text-red-500'>*</span></label>
                        <Select value={itemType} onValueChange={setItemType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select donation type" />
                            </SelectTrigger>
                            <SelectContent>
                                {ITEM_TYPES.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Campaign Title <span className='text-red-500'>*</span></label>
                        <Input
                            value={formData.title}
                            onChange={(e) => { setFormData(p => ({...p, title: e.target.value})); setFormErrors(p => ({...p, title: ''})) }}
                            placeholder="e.g., Winter Clothes for Underprivileged Children"
                            className={formErrors.title ? 'border-red-500' : ''}
                            maxLength={200}
                        />
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Minimum 10 characters</span>
                            <span>{formData.title.length}/200</span>
                        </div>
                        {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
                    </div>

                    {/* ✅ CONDITIONAL FIELDS: Money vs Physical Items */}
                    {itemType === 'money' ? (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-sm font-semibold text-gray-700">Fundraising Goal (৳) <span className='text-red-500'>*</span></label>
                            <Input
                                type="number"
                                value={goalAmount}
                                onChange={(e) => { setGoalAmount(e.target.value); setFormErrors(p => ({...p, goalAmount: ''})) }}
                                placeholder="e.g., 50000"
                                className={formErrors.goalAmount ? 'border-red-500' : ''}
                            />
                            {formErrors.goalAmount && <p className="text-xs text-red-500">{formErrors.goalAmount}</p>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Quantity (Pieces) <span className='text-red-500'>*</span></label>
                                <Input
                                    type="number"
                                    value={quantity}
                                    min="1"
                                    onChange={(e) => { setQuantity(e.target.value); setFormErrors(p => ({...p, quantity: ''})) }}
                                    className={formErrors.quantity ? 'border-red-500' : ''}
                                />
                                {formErrors.quantity && <p className="text-xs text-red-500">{formErrors.quantity}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Valid Until (Expiry Date) <span className='text-red-500'>*</span></label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => { setEndDate(e.target.value); setFormErrors(p => ({...p, endDate: ''})) }}
                                    className={formErrors.endDate ? 'border-red-500' : ''}
                                />
                                {formErrors.endDate && <p className="text-xs text-red-500">{formErrors.endDate}</p>}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Campaign Description <span className='text-red-500'>*</span></label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => { setFormData(p => ({...p, description: e.target.value})); setFormErrors(p => ({...p, description: ''})) }}
                            placeholder="Describe your campaign in detail..."
                            className={`min-h-[120px] resize-none ${formErrors.description ? 'border-red-500' : ''}`}
                        />
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Minimum 50 characters</span>
                            <span>{formData.description.length}/1000</span>
                        </div>
                        {formErrors.description && <p className="text-xs text-red-500">{formErrors.description}</p>}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Upload Images <span className='text-red-500'>*</span></label>
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="aspect-square border-2 border-dashed rounded-lg relative bg-gray-50 group overflow-hidden">
                                    {imageUrls[i] ? (
                                        <>
                                            <img src={imageUrls[i]} alt={`upload-${i}`} className="w-full h-full object-cover" />
                                            <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X size={14} /></button>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400"><Upload size={20} /></div>
                                    )}
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => handleImageUpload(e, i)} />
                                </div>
                            ))}
                        </div>
                        {formErrors.images && <p className="text-xs text-red-500">{formErrors.images}</p>}
                    </div>

                    {/* Submit */}
                    <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Campaign'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}