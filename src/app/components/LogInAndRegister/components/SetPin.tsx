'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk, Eye, EyeOff, Loader2 } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { FormStep } from '../LogIn_Register'
import axios from 'axios'
import { toast } from 'sonner'

// ✅ Updated Interface: Added 'name' and kept 'pin' as password
interface SetPinFormData {
    pin: string 
    confirmPin: string
    name: string 
}

interface SetPinProps {
    step: string
    setStep: Dispatch<SetStateAction<FormStep>>
    handleSubmitPin: UseFormHandleSubmit<SetPinFormData>
    registerPin: UseFormRegister<SetPinFormData>
    pinErrors: FieldErrors<SetPinFormData>
    loading: boolean
    setLoading: Dispatch<SetStateAction<boolean>>
    registeredPhone: string
    onSuccess?: (password: string) => void
}

export default function SetPin({
    step,
    setStep,
    handleSubmitPin,
    registerPin,
    pinErrors,
    loading,
    setLoading,
    registeredPhone,
    onSuccess
}: SetPinProps) {

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const onSubmitPassword: SubmitHandler<SetPinFormData> = async (data) => {
        if (data.pin !== data.confirmPin) {
            toast.error('Passwords do not match!', {
                description: 'Please make sure both passwords are the same.',
            })
            return
        }

        setLoading(true)
        toast.loading('Creating your account...')

        try {
            // 1. Prepare Identifier (Exactly same logic as VerifyOTP)
            let identifier = registeredPhone.trim();
            const isEmail = identifier.includes('@');

            if (!isEmail) {
                // Normalize phone for BD
                if (identifier.startsWith('01')) identifier = '+880' + identifier.slice(1);
                else if (identifier.startsWith('8801')) identifier = '+' + identifier;
            }

            // 2. Prepare User Data Payload
            let userData: any = {
                name: data.name,
                password: data.pin, // Using 'pin' field as password
                role: 'user'
            };

            if (isEmail) userData.email = identifier;
            else userData.phoneNumber = identifier;

            // 3. ✅ Retrieve Valid OTP from LocalStorage
            const storedOtp = localStorage.getItem(`otp_${identifier}`);
            
            if (!storedOtp) {
                toast.dismiss();
                toast.error("Session expired or OTP missing.", {
                    description: "Please verify your phone number again."
                });
                setStep('verifyOtp'); // Send back to verify step
                setLoading(false);
                return;
            }

            // 4. Final API Call to Create Account
            const res = await axios.post('/api/v1/user/verify-otp', {
                identifier: identifier,
                otp: storedOtp, // Sending the real OTP
                userData: userData
            })

            if (res.data.success) {
                toast.dismiss()
                toast.success('Account created successfully!', {
                    description: 'Welcome to Guptodhan! You are now logged in.',
                    duration: 6000,
                })
                
                // Cleanup
                localStorage.removeItem(`otp_${identifier}`);
                
                // Trigger auto-login
                onSuccess?.(data.pin)
            }
        } catch (error: any) {
            toast.dismiss()
            const message = error.response?.data?.message || 'Failed to create account'
            
            if (message.includes('already exists')) {
                toast.error('Account already exists', { description: 'Please log in instead.' })
                setStep('login')
            } else {
                toast.error('Registration failed', { description: message })
            }
            console.error('Registration error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (step !== 'setPin') return null

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold">Set Password</h3>
                <p className="text-sm text-gray-600 mt-1">
                    Set a name and password to finish signup.
                </p>
            </div>

            <form onSubmit={handleSubmitPin(onSubmitPassword)} className="space-y-5">
                
                {/* Name Input */}
                <div className="space-y-2">
                    <label className="flex items-center text-[12px] font-medium text-gray-900">
                        Full Name <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                    </label>
                    <Input
                        type="text"
                        placeholder="Enter your full name"
                        {...registerPin('name', { required: 'Name is required' })}
                        className={pinErrors.name ? 'border-red-500' : ''}
                    />
                    {pinErrors.name && (
                        <p className="text-sm text-red-500">{pinErrors.name.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label className="flex items-center text-[12px] font-medium text-gray-900">
                        Password <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                    </label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Min 6 characters"
                            {...registerPin('pin', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            })}
                            className={pinErrors.pin ? 'border-red-500' : ''}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {pinErrors.pin && (
                        <p className="text-sm text-red-500">{pinErrors.pin.message}</p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <label className="flex items-center text-[12px] font-medium text-gray-900">
                        Confirm Password <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                    </label>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter password"
                            {...registerPin('confirmPin', {
                                required: 'Please confirm your password',
                                validate: (value, formValues) => value === formValues.pin || 'Passwords do not match'
                            })}
                            className={pinErrors.confirmPin ? 'border-red-500' : ''}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {pinErrors.confirmPin && (
                        <p className="text-sm text-red-500">{pinErrors.confirmPin.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        'Complete Registration'
                    )}
                </Button>
            </form>

            <div className="text-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep('login')}
                    className="text-sm"
                >
                    Already have an account? Log in
                </Button>
            </div>
        </div>
    )
}