"use client"
import React, { useState, useRef } from 'react'
import { X, Loader2, UploadCloud } from 'lucide-react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'

export default function EditCampaignModal({ campaign, onClose, onSuccess }: any) {
    const { data: session } = useSession()
    
    // States
    const [title, setTitle] = useState(campaign.title || '')
    const [item, setItem] = useState(campaign.item || 'money')
    const [description, setDescription] = useState(campaign.description || '')
    const [goalAmount, setGoalAmount] = useState(campaign.goalAmount || 0)
    
    // Image States
    const [existingImages, setExistingImages] = useState<string[]>(campaign.images || [])
    const [newImages, setNewImages] = useState<File[]>([])
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const [loading, setLoading] = useState(false)

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...files]);
            const previews = files.map(file => URL.createObjectURL(file));
            setNewImagePreviews(prev => [...prev, ...previews]);
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = (session as any)?.accessToken
            const formData = new FormData()

            formData.append('title', title)
            formData.append('item', item)
            formData.append('description', description)
            formData.append('goalAmount', goalAmount.toString())
            formData.append('category', campaign.category?._id || campaign.category)
            
            existingImages.forEach(img => formData.append('existingImages', img))
            newImages.forEach(file => formData.append('newImages', file))

            const res = await api.patch(`/donation-campaigns/${campaign._id}`, formData, { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                } 
            })

            if (res.data.success) {
                toast.success("Campaign updated! Waiting for admin review.")
                onSuccess()
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update campaign.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 my-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">Edit Campaign</h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleUpdate} className="space-y-4">
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                    
                    <select value={item} onChange={(e) => setItem(e.target.value)} className="w-full border p-2 rounded">
                        {['money', 'clothes', 'food', 'books', 'other'].map(type => (
                            <option key={type} value={type}>{type.toUpperCase()}</option>
                        ))}
                    </select>

                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
                    <Input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} placeholder="Goal Amount" required />

                    {/* Image Upload Area */}
                    <div className="flex flex-wrap gap-2">
                        {existingImages.map((url, i) => (
                            <div key={i} className="relative w-16 h-16 border rounded">
                                <Image src={url} alt="img" fill className="object-cover" />
                                <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full"><X size={12}/></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-16 h-16 border-2 border-dashed flex items-center justify-center"><UploadCloud /></button>
                        <input type="file" className="hidden" ref={fileInputRef} multiple onChange={handleImageSelect} />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
                    </Button>
                </form>
            </div>
        </div>
    )
}