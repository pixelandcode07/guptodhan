import { updateCategory } from '@/services/categoryApi'
import { createSubCategory, deleteSubCategory, updateSubCategory } from '@/services/subCategoryApi'
import React from 'react'
import { toast } from 'sonner'

export default function useCategoryActions(token: string, refresh: () => void) {
    const handleCategoryUpdate = async (id: string, formData: FormData) => {
        try {
            const res = await updateCategory(id, formData, token)
            toast.success("Category updated!")
            refresh()
            return res.data.data
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-expect-error: error is unknown, but we expect response to exist
                toast.error(error.response?.data?.message || "Unable to update");
            } else {
                toast.error("Unable to update");
            }
        }
    }


    const handleSubCreate = async (formData: FormData) => {
        try {
            await createSubCategory(formData, token)
            toast.success("Sub-category created!")
            refresh()
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-expect-error: error is unknown, but we expect response to exist
                toast.error(error.response?.data?.message || "Unable to create sub category");
            } else {
                toast.error("Unable to create sub category");
            }
        }
    }

    const handleSubUpdate = async (id: string, formData: FormData) => {
        try {
            await updateSubCategory(id, formData, token);
            toast.success("Sub Category updated successfully!");
            refresh();
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-expect-error: error is unknown, but we expect response to exist
                toast.error(error.response?.data?.message || "Unable to update sub-category");
            } else {
                toast.error("Unable to update sub-category");
            }
        }
    };
    const handleSubDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sub-category?')) return;
        try {
            await deleteSubCategory(id, token);
            toast.success("Sub Category deleted successfully!");
            refresh();
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-expect-error: error is unknown, but we expect response to exist
                toast.error(error.response?.data?.message || "Unable to delete sub-category");
            } else {
                toast.error("Unable to delete sub-category");
            }
        }
    };

    return {
        handleCategoryUpdate,
        handleSubCreate,
        handleSubUpdate,
        handleSubDelete,
    }
}
