import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Asterisk } from 'lucide-react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Inputs } from './CreateVendorForm'

export default function OwnerInfo({ register, errors }: {
    register: UseFormRegister<Inputs>
    errors: FieldErrors<Inputs>
}) {
    return (
        <>
            {/* Owner Information: */}
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Owner Information:</h1>


            {/* Owner Name */}
            <Label htmlFor="name">Full Name<Asterisk className='text-red-600 h-3 ' /></Label>
            <Input
                type="text"
                placeholder="Full Name"
                {...register("owner_name", { required: "Owner Name is required" })}
                className='mb-8 border border-gray-500'
            />
            {errors.owner_name && (
                <span className="text-red-600">{errors.owner_name.message}</span>
            )}
            {/* Phone */}
            <Label htmlFor="name">Phone<Asterisk className='text-red-600 h-3 ' /></Label>
            <Input
                type="text"
                placeholder="+8801"
                {...register("owner_number", { required: "Please give your number" })}
                className='mb-8 border border-gray-500'
            />
            {errors.owner_number && (
                <span className="text-red-600">{errors.owner_number.message}</span>
            )}
            {/* Login Email */}
            <Label htmlFor="name">Login Email<Asterisk className='text-red-600 h-3 ' /></Label>
            <Input
                type="email"
                placeholder="demo@gmail.com"
                {...register("owner_email", { required: "Enter your email" })}
                className='mb-8 border border-gray-500'
            />
            {errors.owner_email && (
                <span className="text-red-600">{errors.owner_email.message}</span>
            )}
            {/* Login Password */}
            <Label htmlFor="name">Login Password<Asterisk className='text-red-600 h-3 ' /></Label>
            <Input
                type="text"
                placeholder="*********"
                {...register("owner_email_password", {
                    required: "This field is required",
                    minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                    },
                    pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                            "Password must contain at least one capital letter, one small letter, one number, and one special character (@$!%*?&)",
                    },
                })}
                className="mb-8 border border-gray-500"
            />
            {errors.owner_email_password && (
                <span className="text-red-600">{errors.owner_email_password.message}</span>
            )}
        </>
    )
}
