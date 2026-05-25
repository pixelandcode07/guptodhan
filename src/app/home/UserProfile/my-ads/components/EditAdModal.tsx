"use client"
import React, { useState, useRef } from 'react'
import { X, Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'

export default function EditAdModal({ ad, onClose, onSuccess }: any) {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)

    // Form States (Pre-filled with existing Ad data)
    const [title, setTitle] = useState(ad.title || '')
    const [price, setPrice] = useState(ad.price || '')
    const [isNegotiable, setIsNegotiable] = useState(ad.isNegotiable || false)
    const [condition, setCondition] = useState(ad.condition || 'used')
    const [authenticity, setAuthenticity] = useState(ad.authenticity || 'original')
    const [description, setDescription] = useState(ad.description || '')
    const [brand, setBrand] = useState(ad.brand || '')
    const [productModel, setProductModel] = useState(ad.productModel || '')
    const [edition, setEdition] = useState(ad.edition || '')
    const [features, setFeatures] = useState<string>(ad.features ? ad.features.join(', ') : '')

    // Location States
    const [division, setDivision] = useState(ad.division || '')
    const [district, setDistrict] = useState(ad.district || '')
    const [upazila, setUpazila] = useState(ad.upazila || '')

    // Contact States
    const [contactName, setContactName] = useState(ad.contactDetails?.name || '')
    const [contactPhone, setContactPhone] = useState(ad.contactDetails?.phone || '')
    const [contactEmail, setContactEmail] = useState(ad.contactDetails?.email || '')
    const [isPhoneHidden, setIsPhoneHidden] = useState(ad.contactDetails?.isPhoneHidden || false)

    // Category (Assuming we keep IDs, frontend category fetch logic can be added here)
    const [categoryId, setCategoryId] = useState(ad.category?._id || ad.category || '')
    const [subCategoryId, setSubCategoryId] = useState(ad.subCategory?._id || ad.subCategory || '')

    // Image States
    const [existingImages, setExistingImages] = useState<string[]>(ad.images || [])
    const [newImages, setNewImages] = useState<File[]>([])
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Image Handlers
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            if (existingImages.length + newImages.length + files.length > 5) {
                toast.error('You can upload maximum 5 images total.')
                return
            }
            setNewImages(prev => [...prev, ...files])
            const previews = files.map(file => URL.createObjectURL(file))
            setNewImagePreviews(prev => [...prev, ...previews])
        }
    }

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index))
        const newPreviews = [...newImagePreviews]
        URL.revokeObjectURL(newPreviews[index])
        newPreviews.splice(index, 1)
        setNewImagePreviews(newPreviews)
    }

    // Submit Handler
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (existingImages.length === 0 && newImages.length === 0) {
            toast.error("Please provide at least one image.")
            return;
        }

        setLoading(true)
        try {
            const token = (session as any)?.accessToken
            const formData = new FormData()

            // Append Text Fields
            formData.append('title', title)
            formData.append('price', price.toString())
            formData.append('isNegotiable', isNegotiable.toString())
            formData.append('condition', condition)
            formData.append('authenticity', authenticity)
            formData.append('description', description)
            formData.append('brand', brand)
            formData.append('productModel', productModel)
            formData.append('edition', edition)
            
            // Append Location
            formData.append('division', division)
            formData.append('district', district)
            formData.append('upazila', upazila)

            // Append Categories
            if (categoryId) formData.append('category', categoryId)
            if (subCategoryId) formData.append('subCategory', subCategoryId)

            // Append Contact Details
            formData.append('contactName', contactName)
            formData.append('contactPhone', contactPhone)
            if (contactEmail) formData.append('contactEmail', contactEmail)
            formData.append('isPhoneHidden', isPhoneHidden.toString())

            // Append Features (Comma separated string to array)
            if (features.trim()) {
                const featureArray = features.split(',').map(f => f.trim()).filter(f => f !== '')
                featureArray.forEach(f => formData.append('features', f))
            }

            // Append Images
            existingImages.forEach(img => formData.append('existingImages', img))
            newImages.forEach(file => formData.append('newImages', file))

            // API Call
            const res = await api.patch(`/classifieds/ads/${ad._id}`, formData, { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                } 
            })

            if (res.data.success) {
                toast.success("Ad updated successfully! Waiting for admin review.")
                onSuccess()
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update ad.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                    <h2 className="font-bold text-xl text-gray-800">Edit Advertisement</h2>
                    <button onClick={onClose} className="p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Area */}
                <div className="overflow-y-auto p-5 sm:p-6 flex-1 custom-scrollbar">
                    <form id="editAdForm" onSubmit={handleUpdate} className="space-y-8">
                        
                        {/* 1. Basic Details */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2 text-[#00005E]">Basic Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Ad Title *</label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Price (৳) *</label>
                                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                </div>
                                <div className="flex items-center gap-2 mt-6">
                                    <input type="checkbox" id="isNegotiable" checked={isNegotiable} onChange={(e) => setIsNegotiable(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#EF4A23] focus:ring-[#EF4A23]" />
                                    <label htmlFor="isNegotiable" className="text-sm font-medium text-gray-700">Price is Negotiable</label>
                                </div>
                            </div>
                        </section>

                        {/* 2. Product Specifications */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2 text-[#00005E]">Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Condition *</label>
                                    <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0097E9]">
                                        <option value="new">New</option>
                                        <option value="used">Used</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Authenticity *</label>
                                    <select value={authenticity} onChange={(e) => setAuthenticity(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0097E9]">
                                        <option value="original">Original</option>
                                        <option value="copy">Copy/Replica</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Brand</label>
                                    <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Samsung" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Model</label>
                                    <Input value={productModel} onChange={(e) => setProductModel(e.target.value)} placeholder="e.g. Galaxy S23" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Edition</label>
                                    <Input value={edition} onChange={(e) => setEdition(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Features (Comma separated)</label>
                                    <Input value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="e.g. 8GB RAM, 128GB ROM, 5G" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
                                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required placeholder="Describe your item in detail..." />
                                </div>
                            </div>
                        </section>

                        {/* 3. Location & Contact */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2 text-[#00005E]">Location & Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Division *</label>
                                    <Input value={division} onChange={(e) => setDivision(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">District *</label>
                                    <Input value={district} onChange={(e) => setDistrict(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Upazila *</label>
                                    <Input value={upazila} onChange={(e) => setUpazila(e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Contact Name *</label>
                                    <Input value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Contact Phone *</label>
                                    <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
                                </div>
                                <div className="flex items-center gap-2 md:col-span-2">
                                    <input type="checkbox" id="isPhoneHidden" checked={isPhoneHidden} onChange={(e) => setIsPhoneHidden(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#0097E9] focus:ring-[#0097E9]" />
                                    <label htmlFor="isPhoneHidden" className="text-sm font-medium text-gray-700">Hide phone number from public</label>
                                </div>
                            </div>
                        </section>

                        {/* 4. Images */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2 text-[#00005E]">Images *</h3>
                            
                            <div className="flex flex-wrap gap-4">
                                {/* Display Existing Images */}
                                {existingImages.map((img, idx) => (
                                    <div key={`exist-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                        <Image src={img} alt="Existing" fill className="object-cover" />
                                        <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 shadow-sm transition">
                                            <X size={14} />
                                        </button>
                                        <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] text-center py-0.5">Existing</div>
                                    </div>
                                ))}

                                {/* Display New Image Previews */}
                                {newImagePreviews.map((url, idx) => (
                                    <div key={`new-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                        <Image src={url} alt="New" fill className="object-cover" />
                                        <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 shadow-sm transition">
                                            <X size={14} />
                                        </button>
                                        <div className="absolute bottom-0 w-full bg-green-500/80 text-white text-[10px] text-center py-0.5">New</div>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                {(existingImages.length + newImages.length) < 5 && (
                                    <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-[#0097E9] hover:text-[#0097E9] transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <UploadCloud size={24} />
                                        <span className="text-[10px] mt-1 font-medium text-center px-1">Add Image</span>
                                        <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">You must provide at least 1 image. Max 5 images allowed.</p>
                        </section>
                    </form>
                </div>

                {/* Footer / Actions */}
                <div className="p-5 border-t bg-gray-50 flex justify-between items-center">
                    <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md font-medium border border-amber-100 hidden sm:block">
                        Status changes to Pending after update.
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="w-full sm:w-auto">Cancel</Button>
                        <Button type="submit" form="editAdForm" disabled={loading} className="w-full sm:w-auto bg-[#EF4A23] hover:bg-[#d43d1a] text-white">
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
                        </Button>
                    </div>
                </div>
                
            </div>
        </div>
    )
}