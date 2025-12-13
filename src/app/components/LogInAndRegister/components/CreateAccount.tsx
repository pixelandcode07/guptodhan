// 'use client'

// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Asterisk, Loader2 } from 'lucide-react'
// import React, { Dispatch, SetStateAction, useState } from 'react'
// import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
// import { CreateAccountFormData, FormStep } from '../LogIn_Register';
// import axios from 'axios';

// interface CreateAccountProps {
//     step: string;
//     handleSubmitCreate: UseFormHandleSubmit<CreateAccountFormData>;
//     registerCreate: UseFormRegister<CreateAccountFormData>;
//     createErrors: FieldErrors<CreateAccountFormData>;
//     setStep: Dispatch<SetStateAction<FormStep>>;
//     setSubmittedPhone: Dispatch<SetStateAction<string>>;
// }

// export default function CreateAccount({ 
//     step, 
//     handleSubmitCreate, 
//     registerCreate, 
//     createErrors, 
//     setStep,
//     setSubmittedPhone
// }: CreateAccountProps) {

//     const [loading, setLoading] = useState(false);

//     const onSubmitLocal = async (data: CreateAccountFormData) => {
//         setLoading(true);
//         try {
//             const formattedPhone = data.phoneNumber.replace(/\s/g, '');
//             console.log('Sending OTP to:', formattedPhone);

//             const res = await axios.post('/api/v1/otp', { 
//                 phone: formattedPhone 
//             });

//             if (res.data.success) {
//                 setSubmittedPhone(formattedPhone);
//                 setStep('verifyOtp');
//             }

//         } catch (error: any) {
//             console.error('Registration/OTP Error:', error);
//             const msg = error.response?.data?.message || "Failed to send OTP";
//             alert(msg);
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div>
//             {step === 'createAccount' && (
//                 <form onSubmit={handleSubmitCreate(onSubmitLocal)} className="space-y-4">
//                     <div className="space-y-2">
//                         <label htmlFor="phone" className="flex items-center text-[12px] font-medium text-gray-900">
//                             Phone number <Asterisk className="h-3 w-3 text-red-500" />
//                         </label>
//                         <Input
//                             id="phone"
//                             type="tel"
//                             placeholder="+8801777777777"
//                             {...registerCreate('phoneNumber', {
//                                 required: 'Phone number is required',
//                                 pattern: {
//                                     value: /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/,
//                                     message: 'Must be a valid Bangladeshi phone number',
//                                 },
//                             })}
//                             className={createErrors.phoneNumber ? 'border-red-500' : ''}
//                         />
//                         {createErrors.phoneNumber && (
//                             <p className="text-sm text-red-500">{createErrors.phoneNumber.message}</p>
//                         )}
//                     </div>

//                     <Button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white hover:bg-blue-700"
//                         disabled={loading}
//                     >
//                         {loading ? (
//                             <>
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...
//                             </>
//                         ) : (
//                             'Create Account / Send OTP'
//                         )}
//                     </Button>

//                     <Button
//                         type="button"
//                         variant="ghost"
//                         className="w-full mt-2"
//                         onClick={() => setStep('login')}
//                     >
//                         Back to Login
//                     </Button>
//                 </form>
//             )}
//         </div>
//     )
// }



'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk, Loader2 } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { CreateAccountFormData, FormStep } from '../LogIn_Register'
import axios from 'axios'
import { toast } from 'sonner'

interface CreateAccountProps {
    step: string
    handleSubmitCreate: UseFormHandleSubmit<CreateAccountFormData>
    registerCreate: UseFormRegister<CreateAccountFormData>
    createErrors: FieldErrors<CreateAccountFormData>
    setStep: Dispatch<SetStateAction<FormStep>>
    setSubmittedPhone: Dispatch<SetStateAction<string>>
    setRegisteredPhone: Dispatch<SetStateAction<string>>
}

const SMS_API_KEY = 'P6w4PCMlXhDd6929Ly0eBJViTfvWxjmo5H5H5vEI'
// Optional: Only if you have approved sender ID
// const SENDER_ID = 'Guptodhan'

export default function CreateAccount({
    step,
    handleSubmitCreate,
    registerCreate,
    createErrors,
    setStep,
    setSubmittedPhone,
    setRegisteredPhone
}: CreateAccountProps) {

    const [loading, setLoading] = useState(false)

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

    const sendOTP = async (phone: string) => {
        const otp = generateOTP()
        const message = `Your Guptodhan verification code is ${otp}. Valid for 3 minutes.`

        const params = new URLSearchParams({
            api_key: SMS_API_KEY,
            msg: message,
            to: phone,
            // sender_id: SENDER_ID || undefined  // Only send if defined
        })

        try {
            const response = await axios.get('https://api.sms.net.bd/sendsms?' + params.toString(), {
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                }
            })

            console.log('SMS Response:', response.data)

            // sms.net.bd returns JSON like: { error: 0, msg: "success|12345" } or { error: 101, msg: "..." }
            const data = response.data

            // Correct way: Check if success (error === 0 or message contains success)
            const isSuccess =
                data.error === 0 ||
                (typeof data.msg === 'string' && (data.msg.includes('success') || data.msg.includes('delivered')))

            if (isSuccess) {
                localStorage.setItem(`otp_${phone}`, otp)
                localStorage.setItem(`otp_time_${phone}`, Date.now().toString())
                return { success: true, otp }
            } else {
                throw new Error(data.msg || 'Failed to send SMS')
            }
        } catch (error: any) {
            console.error('SMS API Error:', error)
            throw new Error(error.response?.data?.msg || error.message || 'Network error. Try again.')
        }
    }

    const onSubmitLocal = async (data: CreateAccountFormData) => {
        setLoading(true)
        try {
            let phone = data.phoneNumber.trim().replace(/\s/g, '')

            // Normalize to +880 format
            if (phone.startsWith('01')) {
                phone = '+880' + phone.slice(1)
            } else if (phone.startsWith('8801')) {
                phone = '+' + phone
            } else if (!phone.startsWith('+8801')) {
                toast.error('Please enter a valid Bangladeshi number')
                return
            }

            toast.loading('Sending OTP...', { duration: 0 })

            await sendOTP(phone)

            const displayPhone = phone.replace('+880', '0')
            setSubmittedPhone(displayPhone)
            setRegisteredPhone(displayPhone)

            toast.dismiss()
            toast.success('OTP sent successfully!')
            setStep('verifyOtp')

        } catch (error: any) {
            toast.dismiss()
            toast.error(error.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    if (step !== 'createAccount') return null

    return (
        <form onSubmit={handleSubmitCreate(onSubmitLocal)} className="space-y-5">
            <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-900">
                    Phone Number <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                </label>
                <Input
                    type="tel"
                    placeholder="017XXXXXXXX"
                    {...registerCreate('phoneNumber', {
                        required: 'Phone number is required',
                        pattern: {
                            value: /^(\+880|0)1[3-9]\d{8}$/,
                            message: 'Enter valid BD number (01XXXXXXXXX)',
                        },
                    })}
                    className={createErrors.phoneNumber ? 'border-red-500' : ''}
                />
                {createErrors.phoneNumber && (
                    <p className="text-sm text-red-500">{createErrors.phoneNumber.message}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                    </>
                ) : (
                    'Send OTP'
                )}
            </Button>

            <Button
                type="button"
                variant="ghost"
                className=" w-full"
                onClick={() => setStep('login')}
                disabled={loading}
            >
                Back to Login
            </Button>
        </form>
    )
}