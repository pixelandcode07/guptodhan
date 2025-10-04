// 'use client'

// import UploadImageBtn from '@/app/general/buy/sell/config/components/UploadImageBtn'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import axios from 'axios'
// import { Asterisk, Save } from 'lucide-react'
// import { useSession } from 'next-auth/react'
// import React from 'react'
// import { Controller, SubmitHandler, useForm } from 'react-hook-form'
// import { toast } from 'sonner'

// export type Inputs = {
//     category_name: string
//     category_image: File | null
//     // image: 
// }




// export default function BuySellCreateForm() {
//     const { data: session } = useSession();
//     const token = session?.accessToken;
//     // console.log("Token being sent:", session?.accessToken);
//     // console.log("Role:", session?.user?.role)

//     const {
//         register,
//         handleSubmit,
//         control,
//         // setValue,
//         formState: { errors },
//     } = useForm<Inputs>()

//     // const onSubmit:  = (data) => 

//     const onSubmit: SubmitHandler<Inputs> = async (data) => {
//         console.log(data)
//         try {
//             const formData = new FormData();
//             formData.append("name", data.category_name);
//             if (data.category_image) {
//                 formData.append("icon", data.category_image);
//             }

//             const res = await axios.post("/api/v1/classifieds-categories", formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${token}`, // attach token
//                     "x-user-role": session?.user?.role
//                 },
//             });
//             toast.success("Category created!", {
//                 // description: "Saved successfully!",
//                 // className: "text-yellow-300 bg-gray-800",
//                 position: "top-center",
//             });
//             console.log("✅ Category created successfully:", res.data);
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 console.error("❌ Error creating Category:", error.response?.data || error.message);
//             } else {
//                 console.error("❌ Error creating Category:", error);
//             }
//             toast.error(
//                 typeof error === "object" && error !== null && "message" in error
//                     ? (error as { message: string }).message
//                     : "An error occurred"
//             );
//         }
//     }
//     return (
//         <div>
//             <form onSubmit={handleSubmit(onSubmit)} className='bg-[#f8f9fb] space-y-5 '>
//                 <div >
//                     <h1 className="text-lg font-semibold border-l-2 border-blue-500">
//                         <span className="pl-5">BuySell Category Create Form:</span>
//                     </h1>
//                 </div>
//                 {/* Name */}
//                 <section className=' grid grid-cols-1 md:grid-cols-12 '>
//                     <span className='col-span-2'>
//                         <Label htmlFor="name" className='mb-2'>Name<Asterisk className='text-red-600 h-3' /></Label>
//                     </span>
//                     <span className='col-span-10'>
//                         <Input
//                             type="text"
//                             placeholder="Category Name"
//                             {...register("category_name", { required: "This field is required" })}
//                             className='mb-8 border border-gray-500'
//                         />
//                         {errors.category_name && (
//                             <span className="text-red-600">{errors.category_name.message}</span>
//                         )}
//                     </span>
//                 </section>
//                 {/* Category Icon */}
//                 <section className=' grid grid-cols-1 md:grid-cols-12 '>
//                     <span className='col-span-2'>
//                         <Label htmlFor="name" className='mb-2'>Category Icon</Label>
//                     </span>
//                     <div className="col-span-5">
//                         <Controller
//                             name="category_image"
//                             control={control}
//                             render={({ field }) => (
//                                 <UploadImageBtn value={field.value} onChange={field.onChange} />
//                             )}
//                         />
//                         <Button
//                             className='mt-5'
//                             variant={'BlueBtn'}
//                             type="submit"><Save />Save Category</Button>
//                     </div>
//                 </section>
//             </form>
//         </div>
//     )
// }
