'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Asterisk, Loader2 } from "lucide-react"
import React, { Dispatch, SetStateAction, useState, useEffect } from "react"
import { FormStep } from "../LogIn_Register"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "sonner"

type NewPasswordForm = {
    pin: string
    confirmPin: string
}

export default function SetNewPin({
    step,
    setStep,
}: {
    step: string
    setStep: Dispatch<SetStateAction<FormStep>>
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [token, setToken] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<NewPasswordForm>()

    // কম্পোনেন্ট লোড হলে টোকেন চেক করবে
    useEffect(() => {
        if (step === 'setNewPin') {
            const storedToken = sessionStorage.getItem('resetToken')
            if (!storedToken) {
                toast.error("Session expired. Please start over.")
                setStep('forgetPin')
            } else {
                setToken(storedToken)
            }
        }
    }, [step, setStep])

    const onSubmit = async (data: NewPasswordForm) => {
        if (!token) return

        setIsLoading(true)
        try {
            const res = await axios.post('/api/v1/auth/reset-password', {
                token: token,
                newPassword: data.pin
            })

            if (res.data.success) {
                toast.success("Password reset successfully!", {
                    description: "Please login with your new password."
                })
                
                // Cleanup
                sessionStorage.removeItem('resetToken')
                
                setStep("login")
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to reset password"
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    if (step !== "setNewPin") return null

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Set New Password</h3>
                <p className="text-sm text-gray-500">Enter your new strong password</p>
            </div>

            {/* New Password */}
            <div className="space-y-2">
                <label className="flex items-center text-[12px] font-medium text-gray-900">
                    New Password <Asterisk className="h-3 w-3 text-red-500" />
                </label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 6 characters"
                        disabled={isLoading}
                        {...register("pin", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Must be at least 6 characters" },
                        })}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {errors.pin && <p className="text-xs text-red-500">{errors.pin.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
                <label className="flex items-center text-[12px] font-medium text-gray-900">
                    Confirm Password <Asterisk className="h-3 w-3 text-red-500" />
                </label>
                <div className="relative">
                    <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter password"
                        disabled={isLoading}
                        {...register("confirmPin", {
                            required: "Please confirm password",
                            validate: (value) => value === watch("pin") || "Passwords do not match",
                        })}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirm(!showConfirm)}
                    >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {errors.confirmPin && (
                    <p className="text-xs text-red-500">{errors.confirmPin.message}</p>
                )}
            </div>

            <Button 
                type="submit" 
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
                    </>
                ) : (
                    "Reset Password"
                )}
            </Button>
        </form>
    )
}