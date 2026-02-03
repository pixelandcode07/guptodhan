'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Asterisk, Loader2, ArrowLeft } from "lucide-react"
import React, { Dispatch, SetStateAction, useState } from "react"
import { FormStep } from "../LogIn_Register"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "sonner"

type ForgetForm = {
    identifier: string
    otp?: string
}

export default function Forgetpin({
    step,
    setStep,
}: {
    step: string
    setStep: Dispatch<SetStateAction<FormStep>>
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [isOtpSent, setIsOtpSent] = useState(false)
    
    // ভেরিফিকেশনের জন্য identifier স্টেট রাখা দরকার
    const [identifier, setIdentifier] = useState("") 

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<ForgetForm>()

    // ১. OTP পাঠানো (Send OTP)
    const handleSendOtp = async (data: ForgetForm) => {
        setIsLoading(true)
        try {
            // Identifier Format Logic (Phone Number normalization)
            let formattedId = data.identifier.trim();
            const isEmail = formattedId.includes('@');

            if (!isEmail) {
                if (formattedId.startsWith('01')) formattedId = '+880' + formattedId.slice(1);
                else if (formattedId.startsWith('8801')) formattedId = '+' + formattedId;
            }

            const res = await axios.post('/api/v1/auth/forgot-password', {
                identifier: formattedId
            })

            if (res.data.success) {
                toast.success(res.data.message || "OTP sent successfully!")
                setIdentifier(formattedId) // Save for next step
                setIsOtpSent(true) // Switch UI to OTP Input
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to send OTP"
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    // ২. OTP ভেরিফাই করা (Verify OTP)
    const handleVerifyOtp = async (data: ForgetForm) => {
        if (!data.otp) {
            toast.error("Please enter the OTP")
            return
        }
        
        setIsLoading(true)
        try {
            const res = await axios.post('/api/v1/auth/verify-reset-otp', {
                identifier: identifier,
                otp: data.otp
            })

            if (res.data.success) {
                toast.success("OTP Verified!")
                
                // 🔥 টোকেনটি temporarily সংরক্ষণ করছি পরের ধাপের জন্য
                sessionStorage.setItem('resetToken', res.data.data.resetToken)
                
                setStep("setNewPin") // Move to Password Reset Screen
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Invalid OTP"
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    if (step !== "forgetPin") return null

    return (
        <div className="space-y-4">
            {/* Header / Back Button */}
            <div className="flex items-center gap-2 mb-2">
                {isOtpSent && (
                    <button 
                        onClick={() => setIsOtpSent(false)} 
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                )}
                <h3 className="text-lg font-semibold">
                    {isOtpSent ? "Verify OTP" : "Forgot Password?"}
                </h3>
            </div>

            <form onSubmit={handleSubmit(isOtpSent ? handleVerifyOtp : handleSendOtp)} className="space-y-4">
                
                {!isOtpSent ? (
                    // --- STEP 1: Input Email/Phone ---
                    <div className="space-y-2">
                        <label className="flex items-center text-[12px] font-medium text-gray-900">
                            Email or Phone Number <Asterisk className="h-3 w-3 text-red-500" />
                        </label>
                        <Input
                            type="text"
                            placeholder="Enter email or 01XXXXXXXXX"
                            disabled={isLoading}
                            {...register("identifier", {
                                required: "Email or Phone is required",
                                validate: (value) => {
                                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                                    const isPhone = /^\+?[\d\s-]{10,15}$/.test(value);
                                    return isEmail || isPhone || "Invalid email or phone number";
                                }
                            })}
                            className={errors.identifier ? "border-red-500" : ""}
                        />
                        {errors.identifier && (
                            <p className="text-xs text-red-500">{errors.identifier.message}</p>
                        )}
                    </div>
                ) : (
                    // --- STEP 2: Input OTP ---
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 mb-2">
                            Enter the code sent to <span className="font-bold">{identifier}</span>
                        </p>
                        <label className="flex items-center text-[12px] font-medium text-gray-900">
                            OTP Code <Asterisk className="h-3 w-3 text-red-500" />
                        </label>
                        <Input
                            type="text"
                            placeholder="6-digit code"
                            maxLength={6}
                            disabled={isLoading}
                            {...register("otp", {
                                required: "OTP is required",
                                minLength: { value: 6, message: "Must be 6 digits" }
                            })}
                            className={`text-center tracking-widest text-lg ${errors.otp ? "border-red-500" : ""}`}
                        />
                        {errors.otp && (
                            <p className="text-xs text-red-500">{errors.otp.message}</p>
                        )}
                    </div>
                )}

                <Button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            {isOtpSent ? "Verifying..." : "Sending..."}
                        </>
                    ) : (
                        isOtpSent ? "Verify OTP" : "Send OTP"
                    )}
                </Button>

                {!isOtpSent && (
                    <div className="text-center">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setStep('login')}
                            className="text-sm"
                        >
                            Back to Login
                        </Button>
                    </div>
                )}
            </form>
        </div>
    )
}