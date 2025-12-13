"use client"

import UploadImageBtn from "@/components/ReusableComponents/UploadImageBtn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { Asterisk, Save } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useEffect, useState } from "react"

// Types
export type Inputs = {
  subcategory_name: string
  category: string
  subcategory_image: File | null
}

interface Category {
  _id: string
  name: string
  icon?: string
}

export default function SubCreateCategory() {
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string; role?: string })?.accessToken
  const userRole = (session?.user as { role?: string })?.role
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>()

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await axios.get("/api/v1/classifieds-categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-role": userRole,
        },
      })
      // Assuming response structure: { success: true, data: [...] }
      setCategories(response.data.data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
    } finally {
      setLoadingCategories(false)
    }
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const formData = new FormData()
      formData.append("name", data.subcategory_name)
      formData.append("category", data.category)
      if (data.subcategory_image) {
        formData.append("icon", data.subcategory_image)
      }

      await axios.post("/api/v1/classifieds-subcategories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "x-user-role": userRole,
        },
      })

      toast.success("Sub-category created successfully!")
      router.push("/general/categories?page=view") // Adjust redirect as needed
    } catch (error) {
      console.log(error)
      toast.error("Failed to create sub-category")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#f8f9fb] space-y-5">
      <h1 className="text-lg font-semibold border-l-2 border-blue-500">
        <span className="pl-5">Create Sub-Category</span>
      </h1>

      {/* Sub-Category Name */}
      <section className="grid grid-cols-1 md:grid-cols-12">
        <span className="col-span-2">
          <Label htmlFor="subcategory_name" className="mb-2">
            Sub-Category Name <Asterisk className="text-red-600 h-3 inline" />
          </Label>
        </span>
        <span className="col-span-10">
          <Input
            type="text"
            placeholder="Sub-Category Name"
            {...register("subcategory_name", { required: "This field is required" })}
            className="mb-2 border border-gray-500"
          />
          {errors.subcategory_name && (
            <span className="text-red-600">{errors.subcategory_name.message}</span>
          )}
        </span>
      </section>

      {/* Parent Category Select */}
      <section className="grid grid-cols-1 md:grid-cols-12">
        <span className="col-span-2">
          <Label htmlFor="category" className="mb-2">
            Parent Category <Asterisk className="text-red-600 h-3 inline" />
          </Label>
        </span>
        <span className="col-span-10">
          <Controller
            name="category"
            control={control}
            rules={{ required: "Please select a parent category" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mb-2 border border-gray-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCategories ? (
                    <div className="p-2 text-gray-500">Loading categories...</div>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-categories" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <span className="text-red-600">{errors.category.message}</span>
          )}
        </span>
      </section>

      {/* Icon */}
      <section className="grid grid-cols-1 md:grid-cols-12">
        <span className="col-span-2">
          <Label htmlFor="icon" className="mb-2">Sub-Category Icon</Label>
        </span>
        <div className="col-span-5">
          <Controller
            name="subcategory_image"
            control={control}
            render={({ field }) => (
              <UploadImageBtn value={field.value} onChange={field.onChange} />
            )}
          />
          <Button className="mt-5" variant="BlueBtn" type="submit">
            <Save /> Save Sub-Category
          </Button>
        </div>
      </section>
    </form>
  )
}