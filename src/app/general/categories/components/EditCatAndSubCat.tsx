'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Loader2, SaveIcon, PlusCircle, Edit, Trash2 } from 'lucide-react';
import FancyLoadingPage from '@/app/general/loading';
import { SubCategoryType } from '@/components/TableHelper/view_buy_sell_columns';
import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn';

// Type Definitions
interface Category {
    _id: string;
    name: string;
    slug: string;
    status: 'active' | 'inactive';
    icon?: string;
}

export default function EditCatAndSubCat() {
    const { data: session } = useSession();
    const token = (session?.user as { accessToken?: string; role?: string })?.accessToken
    const params = useParams();
    const categoryId = params?.id as string;
    const router = useRouter();

    const [parentCategory, setParentCategory] = useState<Category | null>(null);
    const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
    const [editingSubCategory, setEditingSubCategory] = useState<SubCategoryType | null | 'new'>(null);
    const [currentIcon, setCurrentIcon] = useState<string | File | null>(null);
    const [currentSubIcon, setCurrentSubIcon] = useState<string | File | null>(null);

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Data Fetching ---
    const fetchData = async () => {
        if (!categoryId) return;
        try {
            setLoading(true);
            const [catRes, subCatRes] = await Promise.all([
                axios.get(`/api/v1/public/classifieds-categories/${categoryId}`),
                axios.get(`/api/v1/public/classifieds-categories/${categoryId}/subcategories`)
            ]);

            if (catRes.data.success) {
                setParentCategory(catRes.data.data);
                setCurrentIcon(catRes.data.data.icon || null);
            }
            if (subCatRes.data.success) setSubCategories(subCatRes.data.data);

        } catch (err) {
            toast.error("Failed to fetch category data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    useEffect(() => {
        if (editingSubCategory === 'new') {
            setCurrentSubIcon(null);
        } else if (editingSubCategory) {
            setCurrentSubIcon(editingSubCategory.icon || null);
        }
    }, [editingSubCategory]);

    // --- API Handlers ---
    const handleParentUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!parentCategory) return;
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.delete('image');
        if (currentIcon instanceof File) {
            formData.append('icon', currentIcon);
        }
        try {
            const res = await axios.patch(`/api/v1/classifieds-categories/${parentCategory._id}`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Parent category updated!");
            setParentCategory(res.data.data); // Update state with new data
            setCurrentIcon(res.data.data.icon || null);
            router.push('/general/categories?page=view');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Update failed.");
            } else {
                toast.error("Update failed.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubCategorySubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        formData.delete('image');
        if (currentSubIcon instanceof File) {
            formData.append('icon', currentSubIcon);
        }

        try {
            if (editingSubCategory === 'new') {
                formData.append('category', categoryId); // Add parent ID for new sub-category
                await axios.post(`/api/v1/classifieds-subcategories`, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Sub-category created!");
            } else if (editingSubCategory) {
                await axios.patch(`/api/v1/classifieds-subcategories/${editingSubCategory._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Sub-category updated!");
            }
            setEditingSubCategory(null); // Close the modal
            fetchData(); // Refresh sub-category list
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Operation failed.");
            } else {
                toast.error("Operation failed.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubCategoryDelete = async (subCatId: string) => {
        if (!confirm('Are you sure you want to delete this sub-category?')) return;
        setIsSubmitting(true);
        try {
            await axios.delete(`/api/v1/classifieds-subcategories/${subCatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Sub-category deleted!");
            fetchData();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Delete failed.");
            } else {
                toast.error("Delete failed.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    if (loading) return <FancyLoadingPage />;
    if (!parentCategory) return <div className="p-8 text-center">Category not found or failed to load.</div>;

    return (
        <div className="p-4 sm:p-8">
            {/* Page Heading */}
            <h1 className="text-center text-3xl font-bold mb-8">Update: {parentCategory.name}</h1>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Parent Category Edit Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Edit Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleParentUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input id="name" name="name" defaultValue={parentCategory.name} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue={parentCategory.status}>
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Change Icon</Label>
                                <UploadImageBtn
                                    value={currentIcon}
                                    onChange={setCurrentIcon}
                                    onRemove={() => setCurrentIcon(null)}
                                />
                            </div>
                            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <SaveIcon className="mr-2 h-4 w-4" />}
                                Update Category
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Right Side: Sub-Category Management Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Found sub-categories for {parentCategory.name}</CardTitle>
                        </div>
                        <div>
                            <Button onClick={() => setEditingSubCategory('new')} size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {subCategories.length > 0 ? subCategories.map(sub => (
                                <div key={sub._id} className="flex justify-between items-center p-3 border rounded-lg bg-white">
                                    <span className="font-medium">{sub.name}</span>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setEditingSubCategory(sub)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleSubCategoryDelete(sub._id)} disabled={isSubmitting}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-500 py-4">No sub-categories found.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal for Creating/Editing Sub-Category */}
            <Dialog open={!!editingSubCategory} onOpenChange={(isOpen) => !isOpen && setEditingSubCategory(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingSubCategory === 'new' ? 'Create New Sub-Category' : `Edit: ${editingSubCategory?.name}`}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubCategorySubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input name="name" defaultValue={editingSubCategory === 'new' ? '' : editingSubCategory?.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select name="status" defaultValue={editingSubCategory === 'new' ? 'active' : editingSubCategory?.status}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Icon (Leave blank to keep existing)</Label>
                            <UploadImageBtn
                                value={currentSubIcon}
                                onChange={setCurrentSubIcon}
                                onRemove={() => setCurrentSubIcon(null)}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}