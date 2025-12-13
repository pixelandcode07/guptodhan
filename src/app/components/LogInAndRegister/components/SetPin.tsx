// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Asterisk } from 'lucide-react'
// import React, { Dispatch, SetStateAction } from 'react'
// import { FormStep, SetPinFormData } from '../LogIn_Register';
// import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
// import SocialLoginPart from './SocialLoginPart';

// export default function SetPin({ step, setStep, handleSubmitPin, onSubmitPin,
//     registerPin, pinErrors, loading }: {
//         step: string;
//         setStep: Dispatch<SetStateAction<FormStep>>;
//         handleSubmitPin: UseFormHandleSubmit<SetPinFormData>;
//         onSubmitPin: SubmitHandler<SetPinFormData>;
//         registerPin: UseFormRegister<SetPinFormData>;
//         pinErrors: FieldErrors<SetPinFormData>;
//         loading: boolean;
//     }) {
//     return (
//         <div>
//             {step === 'setPin' && (
//                 <form onSubmit={handleSubmitPin(onSubmitPin)} className="space-y-4">
//                     <div className="space-y-2">
//                         <label htmlFor="pin" className="flex items-center text-[12px] font-medium text-gray-900">
//                             Set a 4 digit PIN number <Asterisk className="h-3 w-3 text-red-500" />
//                         </label>
//                         <Input
//                             id="pin"
//                             type="password"
//                             placeholder="1234"
//                             {...registerPin('pin', {
//                                 required: 'PIN is required',
//                                 minLength: {
//                                     value: 4,
//                                     message: 'PIN must be 4 digits',
//                                 },
//                                 pattern: {
//                                     value: /^\d{4}$/,
//                                     message: 'PIN must be exactly 4 digits',
//                                 },
//                             })}
//                             className={pinErrors.pin ? 'border-red-500' : ''}
//                         />
//                         {pinErrors.pin && (
//                             <p className="text-sm text-red-500">{pinErrors.pin.message}</p>
//                         )}
//                     </div>
//                     <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
//                         Create Account!
//                     </Button>
//                     <Button
//                         variant="outline"
//                         className="w-full"
//                         onClick={() => setStep('login')}
//                     >
//                         Login
//                     </Button>
//                     <div className="text-center text-sm text-gray-600">OR CREATE ACCOUNT WITH</div>
//                     <div className="flex space-x-2">
//                        <SocialLoginPart />
//                     </div>
//                 </form>
//             )}
//         </div>
//     )
// }


// src/app/components/LogInAndRegister/components/SetPin.tsx

'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk, Eye, EyeOff, Loader2 } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { FormStep } from '../LogIn_Register'
import axios from 'axios'
import { toast } from 'sonner'

interface SetPinFormData {
    pin: string
    confirmPin: string
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
    onSuccess?: (pin: string) => void
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

    const [showPin, setShowPin] = useState(false)
    const [showConfirmPin, setShowConfirmPin] = useState(false)




    const onSubmitPin: SubmitHandler<SetPinFormData> = async (data) => {
        if (data.pin !== data.confirmPin) {
            toast.error('PINs do not match!', {
                description: 'Please make sure both PINs are the same.',
            })
            return
        }

        setLoading(true)
        toast.loading('Creating your account...')

        try {
            const cleanPhone = registeredPhone.startsWith('0')
                ? registeredPhone
                : registeredPhone.startsWith('+880')
                    ? registeredPhone.slice(4)
                    : '0' + registeredPhone.replace('+88', '')

            const res = await axios.post('/api/v1/user/register', {
                phone: cleanPhone,
                pin: data.pin,
            })

            if (res.data.success) {
                toast.dismiss()
                toast.success('Account created successfully!', {
                    description: 'Welcome to Guptodhan! You are now logged in.',
                    duration: 6000,
                })

                // Pass the PIN to parent for auto-login
                onSuccess?.(data.pin)
            }
        } catch (error: any) {
            toast.dismiss()

            const message = error.response?.data?.message || 'Failed to create account'

            if (message.includes('token') || message.includes('Unauthorized')) {
                toast.error('Session expired', {
                    description: 'Please start again.',
                })
                setStep('createAccount')
            } else if (message.includes('already exists')) {
                toast.error('Account already exists', {
                    description: 'Try logging in instead.',
                })
                setStep('login')
            } else {
                toast.error('Registration failed', {
                    description: message,
                })
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
                <h3 className="text-lg font-semibold">Set Your 4-Digit PIN</h3>
                <p className="text-sm text-gray-600 mt-1">
                    This will be used to log in securely
                </p>
            </div>

            <form onSubmit={handleSubmitPin(onSubmitPin)} className="space-y-5">

                {/* PIN Field */}
                <div className="space-y-2">
                    <label className="flex items-center text-[12px] font-medium text-gray-900">
                        Enter 4-digit PIN <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                    </label>
                    <div className="relative">
                        <Input
                            type={showPin ? "text" : "password"}
                            placeholder="••••"
                            maxLength={4}
                            className={`text-center text-2xl tracking-widest font-mono ${pinErrors.pin ? 'border-red-500' : ''}`}
                            {...registerPin('pin', {
                                required: 'PIN is required',
                                pattern: {
                                    value: /^\d{4}$/,
                                    message: 'PIN must be exactly 4 digits'
                                }
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPin(!showPin)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {pinErrors.pin && (
                        <p className="text-sm text-red-500">{pinErrors.pin.message}</p>
                    )}
                </div>

                {/* Confirm PIN Field */}
                <div className="space-y-2">
                    <label className="flex items-center text-[12px] font-medium text-gray-900">
                        Confirm PIN <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                    </label>
                    <div className="relative">
                        <Input
                            type={showConfirmPin ? "text" : "password"}
                            placeholder="••••"
                            maxLength={4}
                            className={`text-center text-2xl tracking-widest font-mono ${pinErrors.confirmPin ? 'border-red-500' : ''}`}
                            {...registerPin('confirmPin', {
                                required: 'Please confirm your PIN',
                                validate: (value, formValues) => value === formValues.pin || 'PINs do not match'
                            })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPin(!showConfirmPin)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {pinErrors.confirmPin && (
                        <p className="text-sm text-red-500">{pinErrors.confirmPin.message}</p>
                    )}
                </div>

                {/* Submit Button */}
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
                        'Create Account'
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