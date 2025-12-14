'use client';

import React, { useState } from "react";
import { X, Eye, Edit2, Trash2, Plus, Calendar, Clock, Loader2, UploadCloud, Link as LinkIcon, Check, ChevronsUpDown } from "lucide-react";
import { IStory } from "@/lib/modules/story/story.interface";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface StoryClientProps {
  initialStories: IStory[];
  productList: any[];
}

export default function StoryClient({ initialStories, productList }: StoryClientProps) {
  // ... (আপনার আগের সব স্টেট এবং লজিক অপরিবর্তিত থাকবে)
  // শুধুমাত্র StoryFormFields এ পরিবর্তন আসবে, তাই আমি উপরের লজিকগুলো রিপিট করছি না।
  // নিচের অংশটুকু আগের মতোই রাখুন:
  
  const [stories, setStories] = useState<IStory[]>(initialStories);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const router = useRouter();

  const refreshData = () => {
    router.refresh();
    toast.success("Stories re-fetched!");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return toast.error("Authentication required.");
    if (!imageFile) return toast.error("Image is required.");
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('imageUrl', imageFile);

    try {
      await axios.post('/api/v1/story', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Story created successfully!");
      setIsCreateModalOpen(false);
      refreshData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create story');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !selectedStory) return toast.error("Authentication required.");
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    if (imageFile) {
      formData.append('imageUrl', imageFile);
    }
    
    try {
      await axios.patch(`/api/v1/story/${selectedStory._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Story updated successfully!");
      setIsEditModalOpen(false);
      refreshData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update story');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !selectedStory) return toast.error("Authentication required.");
    setIsLoading(true);
    try {
      await axios.delete(`/api/v1/story/${selectedStory._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Story deleted successfully!");
      setIsDeleteModalOpen(false);
      refreshData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete story');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setImageFile(null);
    setImagePreview(null);
    setIsCreateModalOpen(true);
  };
  const openEditModal = (story: IStory) => {
    setSelectedStory(story);
    setImageFile(null);
    setImagePreview(story.imageUrl);
    setIsEditModalOpen(true);
  };
  const openViewModal = (story: IStory) => {
    setSelectedStory(story);
    setIsViewModalOpen(true);
  };
  const openDeleteModal = (story: IStory) => {
    setSelectedStory(story);
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <Button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-md shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Story
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={String(story._id)} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative h-56 group">
              <Image src={story.imageUrl} alt={story.title || 'Story Image'} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${story.status === "active" ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                  {story.status}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{story.title || "Untitled Story"}</h3>
              {story.productId && (
                 <div className="flex items-center gap-1 text-blue-600 text-xs font-medium mb-2 bg-blue-50 w-fit px-2 py-1 rounded">
                    <LinkIcon size={12} />
                    <span>Linked to Product</span>
                 </div>
              )}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{story.description || "No description."}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1"><Clock size={14} /><span>{story.duration}s</span></div>
                <div className="flex items-center gap-1"><Calendar size={14} /><span>Expires: {new Date(story.expiryDate).toLocaleDateString()}</span></div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => openViewModal(story)} variant="outline" size="sm" className="flex-1"><Eye size={16} className="mr-1"/> View</Button>
                <Button onClick={() => openEditModal(story)} variant="outline" size="sm" className="flex-1"><Edit2 size={16} className="mr-1"/> Edit</Button>
                <Button onClick={() => openDeleteModal(story)} variant="destructive" size="sm" className="flex-1"><Trash2 size={16} className="mr-1"/> Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Modals --- */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <DialogHeader><DialogTitle>Create New Story</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <StoryFormFields isEdit={false} formData={null} onImageChange={handleImageChange} imagePreview={imagePreview} productList={productList} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : "Create Story"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <DialogHeader><DialogTitle>Update Story</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <StoryFormFields isEdit={true} formData={selectedStory} onImageChange={handleImageChange} imagePreview={imagePreview} productList={productList} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : "Update Story"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Modal, Delete Modal... (আপনার আগের কোডই থাকবে) */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Story Details</DialogTitle></DialogHeader>
          {selectedStory && (
            <div className="space-y-4">
              <div className="relative w-full h-80 rounded-lg overflow-hidden bg-gray-100">
                <Image src={selectedStory.imageUrl} alt={selectedStory.title || ''} layout="fill" objectFit="cover" />
              </div>
              <h2 className="text-2xl font-bold">{selectedStory.title}</h2>
              
              {selectedStory.productId && (typeof selectedStory.productId === 'object') && (
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-sm flex gap-3 items-center">
                      <div className="w-10 h-10 relative rounded overflow-hidden">
                        <Image 
                            src={(selectedStory.productId as any).thumbnailImage || '/placeholder.png'} 
                            alt="product" 
                            fill 
                            className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-blue-700">Linked Product: </span> 
                        {(selectedStory.productId as any).productTitle || 'Product Info Unavailable'}
                      </div>
                  </div>
              )}

              <p>{selectedStory.description}</p>
              <div className="flex gap-4 text-sm">
                <span>Duration: <strong>{selectedStory.duration}s</strong></span>
                <span>Status: <strong>{selectedStory.status}</strong></span>
                <span>Expires: <strong>{new Date(selectedStory.expiryDate).toLocaleDateString()}</strong></span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Story?</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete this story?</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- NEW COMPONENT: Product Combobox ---
// এটি সার্চ এবং ছবি সাপোর্ট করে
const ProductCombobox = ({ productList, value, onChange }: { productList: any[], value: string, onChange: (val: string) => void }) => {
  const [open, setOpen] = useState(false);
  
  // Find selected product to show in the trigger button
  const selectedProduct = productList.find((p) => p._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto py-2" // h-auto allows image to fit
        >
          {selectedProduct ? (
            <div className="flex items-center gap-2 text-left">
               <div className="w-8 h-8 relative rounded overflow-hidden border border-gray-200 shrink-0">
                  <Image 
                    src={selectedProduct.thumbnailImage || '/placeholder.png'} 
                    alt={selectedProduct.productTitle} 
                    fill 
                    className="object-cover"
                  />
               </div>
               <span className="truncate max-w-[200px]">{selectedProduct.productTitle}</span>
            </div>
          ) : (
            "Select product..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search product by name..." />
          <CommandList>
             <CommandEmpty>No product found.</CommandEmpty>
             <CommandGroup>
                <CommandItem
                  value="null"
                  onSelect={() => {
                    onChange(""); // Clear selection
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  -- No Product Linked --
                </CommandItem>
                
                {productList.map((product) => (
                  <CommandItem
                    key={product._id}
                    value={product.productTitle} // This is what is searched
                    onSelect={() => {
                      onChange(product._id);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === product._id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="w-8 h-8 relative rounded overflow-hidden border border-gray-200 shrink-0">
                        <Image 
                          src={product.thumbnailImage || '/placeholder.png'} 
                          alt={product.productTitle} 
                          fill 
                          className="object-cover"
                        />
                    </div>
                    <span className="line-clamp-1">{product.productTitle}</span>
                  </CommandItem>
                ))}
             </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// --- UPDATED Form Fields Component ---
const StoryFormFields = ({ isEdit, formData, onImageChange, imagePreview, productList }: any) => {
  // Initial Product ID logic
  const initialProductId = formData?.productId 
      ? (typeof formData.productId === 'object' ? formData.productId._id : formData.productId) 
      : "";
  
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={formData?.title} placeholder="Story title (optional)" />
      </div>
      
      {/* ✅ NEW: Product Combobox with Search & Image */}
      <div>
        <Label className="mb-2 block">Link Product (Optional)</Label>
        
        {/* Combobox UI */}
        <ProductCombobox 
            productList={productList || []} 
            value={selectedProductId} 
            onChange={(val) => setSelectedProductId(val)} 
        />
        
        {/* ⚠️ IMPORTANT: Hidden input to pass value to FormData in handleCreate/Update */}
        <input type="hidden" name="productId" value={selectedProductId} />
        
        <p className="text-xs text-gray-500 mt-1">Search and select a product. Users will see a link to this product.</p>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={formData?.description} placeholder="Story description (optional)" />
      </div>
      <div>
        <Label htmlFor="imageUrl">Story Image *</Label>
        <label htmlFor="imageUpload" className="mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400 bg-gray-50">
          {imagePreview ? (
            <div className="relative w-full h-full">
                <Image src={imagePreview} alt="Preview" layout="fill" objectFit="contain" />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <UploadCloud className="mx-auto h-8 w-8" />
              <p>Click to upload or drag & drop</p>
            </div>
          )}
        </label>
        <Input id="imageUpload" name="imageUrl" type="file" className="hidden" onChange={onImageChange} accept="image/*" required={!isEdit} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input id="duration" name="duration" type="number" defaultValue={formData?.duration || 10} />
        </div>
        <div>
          <Label htmlFor="expiryDate">Expiry Date *</Label>
          <Input id="expiryDate" name="expiryDate" type="date" defaultValue={formData?.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ''} required />
        </div>
      </div>
      {isEdit && (
        <div>
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={formData?.status}>
            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};