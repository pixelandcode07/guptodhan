'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk, Loader2 } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { VerifyOtpFormData, FormStep } from '../LogIn_Register'
import axios from 'axios'
import { toast } from 'sonner'

interface VerifyOTPProps {
    step: string
    setStep: Dispatch<SetStateAction<FormStep>>
    submittedPhone: string // This can be email or phone
    handleSubmitOtp: UseFormHandleSubmit<VerifyOtpFormData>
    registerOtp: UseFormRegister<VerifyOtpFormData>
    otpErrors: FieldErrors<VerifyOtpFormData>
}

export default function VerifyOTP({
    step,
    setStep,
    submittedPhone,
    handleSubmitOtp,
    registerOtp,
    otpErrors
}: VerifyOTPProps) {

    const [loading, setLoading] = useState(false)

    const handleResend = async () => {
        // Optional: Call resend API here if needed
        setStep('createAccount')
    }

    const onSubmitOtp: SubmitHandler<VerifyOtpFormData> = async (data) => {
        if (!submittedPhone) {
            toast.error("Identifier not found. Please restart.")
            return
        }

        setLoading(true)

        // Determine if it's email or phone and format accordingly if needed
        let identifier = submittedPhone;
        
        // If it looks like a phone number (digits), format it
        if (/^\d+$/.test(identifier) || identifier.startsWith('+')) {
             if (identifier.startsWith('01')) {
                identifier = '+880' + identifier.slice(1)
            } else if (identifier.startsWith('8801')) {
                identifier = '+' + identifier
            }
        }

        try {
            // ✅ Server-side Verification Call
            const res = await axios.post('/api/v1/otp/verify', {
                identifier: identifier,
                otp: data.otp
            })

            if (res.data.success) {
                toast.success("OTP Verified Successfully!")
                setStep('setPin')
            } else {
                toast.error(res.data.message || "Invalid OTP")
            }

        } catch (error: any) {
            console.error("Verification Error:", error);
            const msg = error.response?.data?.message || "Invalid OTP or Expired";
            toast.error(msg);
        } finally {
            setLoading(false)
        }
    }

    if (step !== 'verifyOtp') return null;

    return (
        <div>
            <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-4 text-center">
                <div className="flex justify-center mb-4">
                    <svg className="h-16 w-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                </div>

                <p className="text-sm text-gray-600">
                    We have sent the verification code to <br />
                    <span className='font-bold text-black'>{submittedPhone}</span>
                </p>

                <div className="space-y-2">
                    <label htmlFor="otp" className="flex items-center justify-center text-[12px] font-medium text-gray-900">
                        OTP Number <Asterisk className="h-3 w-3 text-red-500" />
                    </label>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6 digit OTP"
                        maxLength={6}
                        {...registerOtp('otp', {
                            required: 'OTP is required',
                            pattern: {
                                value: /^\d{6}$/,
                                message: 'OTP must be exactly 6 digits',
                            },
                        })}
                        className={`text-center tracking-widest text-lg ${otpErrors.otp ? 'border-red-500' : ''}`}
                    />
                    {otpErrors.otp && (
                        <p className="text-sm text-red-500">{otpErrors.otp.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                        </>
                    ) : (
                        'Verify →'
                    )}
                </Button>

                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault()
                        handleResend()
                    }}
                    className="text-sm text-blue-600 hover:underline block text-center mt-3"
                >
                    Didn&#39;t receive the code? Resend OTP
                </a>
            </form>
        </div>
    )
}