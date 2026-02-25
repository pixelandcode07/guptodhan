'use client';

import React, { useState, useEffect, useCallback } from "react";
import { 
  Eye, Edit2, Trash2, Plus, Calendar, Clock, Loader2, 
  UploadCloud, Link as LinkIcon, Check, ChevronsUpDown 
} from "lucide-react";
import { IStory } from "@/lib/modules/story/story.interface";
import { useSession } from "next-auth/react";
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
  initialStories?: IStory[];
  productList?: any[];
}

export default function StoryClient({ initialStories = [], productList: initialProducts = [] }: StoryClientProps) {
  const [stories, setStories] = useState<IStory[]>(initialStories);
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [isLoadingData, setIsLoadingData] = useState(true);
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

  // --- API Data Fetching ---
  const fetchData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      
      // Story fetching
      const storyRes = await axios.get('/api/v1/story').catch(() => null);
      if (storyRes?.data?.success) {
        setStories(storyRes.data.data || []);
      }

      // Product fetching
      try {
        const productRes = await axios.get('/api/v1/product?limit=1000'); 
        if (productRes?.data?.success) {
          const receivedData = productRes.data.data;
          
          if (Array.isArray(receivedData)) {
             setProducts(receivedData);
          } else if (receivedData?.products && Array.isArray(receivedData.products)) {
             setProducts(receivedData.products);
          } else {
             setProducts([]);
          }
        }
      } catch (pErr) {
        console.error("Product access restricted or failed", pErr);
        setProducts([]); 
      }

    } catch (err: any) {
      toast.error("Failed to sync story data");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = () => fetchData();

  // --- Handlers ---
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
      toast.error(err.response?.data?.message || 'Failed to create');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !selectedStory) return toast.error("Auth error.");
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    if (imageFile) formData.append('imageUrl', imageFile);
    
    try {
      await axios.patch(`/api/v1/story/${selectedStory._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Story updated!");
      setIsEditModalOpen(false);
      refreshData();
    } catch (err: any) {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !selectedStory) return;
    setIsLoading(true);
    try {
      await axios.delete(`/api/v1/story/${selectedStory._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted!");
      setIsDeleteModalOpen(false);
      refreshData();
    } catch (err: any) {
      toast.error("Delete failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
        <h2 className="font-semibold text-gray-700">All Stories ({stories.length})</h2>
        <Button onClick={() => { setImagePreview(null); setImageFile(null); setIsCreateModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 h-9">
          <Plus className="w-4 h-4 mr-2" /> Add Story
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase font-medium">
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Title & Description</th>
              <th className="px-6 py-4">Linked Product</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stories.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">No stories found.</td>
              </tr>
            ) : (
              stories.map((story) => (
                <tr key={String(story._id)} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-16 rounded-md overflow-hidden border bg-gray-100 shadow-sm">
                      <Image src={story.imageUrl} alt="thumb" fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[200px]">
                      <p className="font-semibold text-gray-800 truncate">{story.title || "Untitled"}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{story.description || "No description provided."}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {story.productId ? (
                      <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 border border-blue-100 rounded-md w-fit">
                        <div className="w-6 h-6 relative rounded overflow-hidden flex-shrink-0">
                          <Image src={(story.productId as any).thumbnailImage || '/placeholder.png'} alt="p" fill className="object-cover" />
                        </div>
                        <span className="text-[11px] font-medium text-blue-700 truncate max-w-[100px]">
                          {(story.productId as any).productTitle}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Not linked</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs text-gray-600">
                      <span className="flex items-center gap-1"><Clock size={12}/> {story.duration}s</span>
                      <span className="flex items-center gap-1 mt-1"><Calendar size={12}/> {new Date(story.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      story.status === 'active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    )}>
                      {story.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => { setSelectedStory(story); setIsViewModalOpen(true); }} variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-100"><Eye size={16} /></Button>
                      <Button onClick={() => { setSelectedStory(story); setImagePreview(story.imageUrl); setIsEditModalOpen(true); }} variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-100"><Edit2 size={16} /></Button>
                      <Button onClick={() => { setSelectedStory(story); setIsDeleteModalOpen(true); }} variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-100"><Trash2 size={16} /></Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- CREATE MODAL --- */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] w-[95vw] overflow-y-auto max-h-[90vh]">
          <DialogHeader><DialogTitle>Create New Story</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            <StoryFormFields isEdit={false} productList={products} onImageChange={handleImageChange} imagePreview={imagePreview} />
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600">
                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Story"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- EDIT MODAL --- */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] w-[95vw] overflow-y-auto max-h-[90vh]">
          <DialogHeader><DialogTitle>Edit Story</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-4">
            <StoryFormFields isEdit={true} formData={selectedStory} productList={products} onImageChange={handleImageChange} imagePreview={imagePreview} />
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading} className="bg-amber-600">
                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Story"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-gray-500 py-4">Are you sure you want to delete this story? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>Delete Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const StoryFormFields = ({ isEdit, formData, onImageChange, imagePreview, productList }: any) => {
  const safeProductList = Array.isArray(productList) ? productList : [];
  
  const defaultPid = formData?.productId 
    ? (typeof formData.productId === 'object' ? formData.productId._id : formData.productId) 
    : "";

  const [selectedPid, setSelectedPid] = useState(defaultPid);

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input name="title" id="title" defaultValue={formData?.title} placeholder="e.g. Summer Sale" />
      </div>

      <div className="grid gap-2">
        <Label>Link Product (Optional)</Label>
        <ProductCombobox productList={safeProductList} value={selectedPid} onChange={setSelectedPid} />
        <input type="hidden" name="productId" value={selectedPid} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" id="description" defaultValue={formData?.description} className="h-20" />
      </div>

      <div className="grid gap-2">
        <Label>Story Media (Vertical Image Recommended)</Label>
        <div className="relative group border-2 border-dashed rounded-xl p-4 transition-colors hover:border-blue-400 flex flex-col items-center justify-center bg-gray-50 h-40 overflow-hidden">
          {imagePreview ? (
            <div className="absolute inset-0">
               <Image src={imagePreview} alt="p" fill className="object-contain" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-xs">Change Image</p>
               </div>
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <UploadCloud className="w-8 h-8 mb-1" />
              <p className="text-[10px]">Click to upload story media</p>
            </div>
          )}
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onImageChange} accept="image/*" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Duration (s)</Label>
          <Input name="duration" type="number" defaultValue={formData?.duration || 10} />
        </div>
        <div className="grid gap-2">
          <Label>Expiry Date</Label>
          <Input name="expiryDate" type="date" required defaultValue={formData?.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ""} />
        </div>
      </div>

      {isEdit && (
        <div className="grid gap-2">
          <Label>Status</Label>
          <Select name="status" defaultValue={formData?.status || "active"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
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

// 🔥 FIXED: ProductCombobox with Safe Array Handling and Search
const ProductCombobox = ({ productList, value, onChange }: any) => {
  const [open, setOpen] = useState(false);
  
  const safeList = Array.isArray(productList) ? productList : [];
  const selectedProduct = safeList.find((p: any) => p._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-10 font-normal">
          {selectedProduct ? (
            <div className="flex items-center gap-2 truncate text-sm">
              <div className="w-5 h-5 relative rounded-sm overflow-hidden border flex-shrink-0">
                <Image src={selectedProduct.thumbnailImage || '/placeholder.png'} alt="p" fill className="object-cover" />
              </div>
              <span className="truncate">{selectedProduct.productTitle}</span>
            </div>
          ) : <span className="text-gray-400">Select product to link...</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search product by title..." />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {/* ✅ Added a valid search value for "None" */}
              <CommandItem value="none remove link" onSelect={() => { onChange(""); setOpen(false); }} className="text-xs">
                <Check className={cn("mr-2 h-3 w-3", !value ? "opacity-100" : "opacity-0")} />
                None (Remove Link)
              </CommandItem>
              
              {safeList.map((product: any) => (
                <CommandItem 
                  key={product._id} 
                  // ✅ FIX: Combined Product Title and ID to ensure flawless searching and uniqueness
                  value={`${product.productTitle} ${product._id}`} 
                  onSelect={() => { onChange(product._id); setOpen(false); }} 
                  className="text-xs"
                >
                  <Check className={cn("mr-2 h-3 w-3", value === product._id ? "opacity-100" : "opacity-0")} />
                  <div className="flex items-center gap-2">
                      <div className="w-6 h-6 relative rounded overflow-hidden border">
                        <Image src={product.thumbnailImage || '/placeholder.png'} alt="p" fill className="object-cover" />
                      </div>
                      <span className="truncate">{product.productTitle}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};