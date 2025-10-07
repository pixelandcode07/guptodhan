import { SubCategoryType, ViewBuySellDataType } from '@/components/TableHelper/view_buy_sell_columns'
import { getCategory, getSubCategories } from '@/services/categoryApi'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function useCategoryData(categoryId: string) {
    const [parentCategory, setParentCategory] = useState<ViewBuySellDataType>()
    const [subCategories, setSubCategories] = useState<SubCategoryType[]>([])
    const [currentIcon, setCurrentIcon] = useState<string | File | null>(null);
    const [loading, setLoading] = useState(true)
    const fetchData = async () => {
        try {
            setLoading(true)
            const [catRes, subCatRes] = await Promise.all([
                getCategory(categoryId),
                getSubCategories(categoryId)
            ])

            if (catRes.data.success) {
                setParentCategory(catRes.data.data)
                setCurrentIcon(catRes.data.data.icon || null)
            }

            if (subCatRes.data.success) setSubCategories(subCatRes.data.data);


        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch category data.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (categoryId) fetchData()
    }, [])


    return {
        parentCategory,
        subCategories,
        currentIcon,
        loading,
        fetchData
    }
}
