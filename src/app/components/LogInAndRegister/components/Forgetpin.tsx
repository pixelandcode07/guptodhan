// "use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Asterisk } from "lucide-react"
import React, { Dispatch, SetStateAction } from "react"
import { FormStep } from "../LogIn_Register"
import { useForm } from "react-hook-form"

type ForgetPinForm = {
    phone: string
}

export default function Forgetpin({
    step,
    setStep,
}: {
    step: string
    setStep: Dispatch<SetStateAction<FormStep>>
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgetPinForm>()

    const onSubmit = (data: ForgetPinForm) => {
        console.log("Forget Pin data:", data)
        setStep("setNewPin")
    }

    if (step !== "forgetPin") return null

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="flex items-center text-[12px] font-medium text-gray-900">
                    Phone Number <Asterisk className="h-3 w-3 text-red-500" />
                </label>
                <Input
                    type="tel"
                    placeholder="+880 1777777777"
                    {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                            value: /^\+?\d{10,14}$/,
                            message: "Enter a valid phone number",
                        },
                    })}
                />
                {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Send OTP
            </Button>
        </form>
    )
}
