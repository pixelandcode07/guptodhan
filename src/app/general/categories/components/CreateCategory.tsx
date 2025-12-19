"use client"

import UploadImageBtn from "@/components/ReusableComponents/UploadImageBtn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { Asterisk, Save } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

export type Inputs = {
  category_name: string
  category_image: File | null
}

export default function CreateCategory() {
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string; role?: string })?.accessToken
  const adminRole = (session?.user as { role?: string })?.role === "admin"
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const formData = new FormData()
      formData.append("name", data.category_name)
      // formData.append("sub_name", data.sub_category_name)
      if (data.category_image) {
        formData.append("icon", data.category_image)
      }

      await axios.post("/api/v1/classifieds-categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "x-user-role": adminRole,
        },
      })

      toast.success("Category created successfully!")
      router.push("/general/categories?page=view-category")
      reset()
    } catch (error) {
      console.log(error)
      toast.error("Failed to create category")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#f8f9fb] space-y-5">
      <h1 className="text-lg font-semibold border-l-2 border-blue-500">
        <span className="pl-5">Create Category</span>
      </h1>

      {/* Category Name */}
      <section className="grid grid-cols-1 md:grid-cols-12">
        <span className="col-span-2">
          <Label htmlFor="name" className="mb-2">
            Category Name <Asterisk className="text-red-600 h-3 inline" />
          </Label>
        </span>
        <span className="col-span-10">
          <Input
            type="text"
            placeholder="Category Name"
            {...register("category_name", { required: "This field is required" })}
            className="mb-2 border border-gray-500"
          />
          {errors.category_name && (
            <span className="text-red-600">{errors.category_name.message}</span>
          )}
        </span>
      </section>

      {/* Icon */}
      <section className="grid grid-cols-1 md:grid-cols-12">
        <span className="col-span-2">
          <Label htmlFor="icon" className="mb-2">Category Icon</Label>
        </span>
        <div className="col-span-5">
          <Controller
            name="category_image"
            control={control}
            render={({ field }) => (
              <UploadImageBtn value={field.value} onChange={field.onChange} />
            )}
          />
          <Button className="mt-5" variant="BlueBtn" type="submit">
            <Save /> Save Category
          </Button>
        </div>
      </section>
    </form>
  )
}
