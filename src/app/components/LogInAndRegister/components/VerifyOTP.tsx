// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Asterisk, Loader2 } from 'lucide-react'
// import React, { Dispatch, SetStateAction, useState } from 'react'
// import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
// import { VerifyOtpFormData, FormStep } from '../LogIn_Register';
// import axios from 'axios';

// interface VerifyOTPProps {
//     step: string;
//     setStep: Dispatch<SetStateAction<FormStep>>;
//     submittedPhone: string;
//     handleSubmitOtp: UseFormHandleSubmit<VerifyOtpFormData>;
//     registerOtp: UseFormRegister<VerifyOtpFormData>;
//     otpErrors: FieldErrors<VerifyOtpFormData>;
// }

// export default function VerifyOTP({
//     step,
//     setStep,
//     submittedPhone,
//     handleSubmitOtp,
//     registerOtp,
//     otpErrors
// }: VerifyOTPProps) {

//     const [loading, setLoading] = useState(false);

//     // const onSubmitOtp: SubmitHandler<VerifyOtpFormData> = async (data) => {
//     //     if (!submittedPhone) {
//     //         alert("Phone number not found. Please restart the registration process.");
//     //         return;
//     //     }

//     //     setLoading(true);
//     //     try {
//     //         console.log('Verifying OTP:', { phone: submittedPhone, otp: data.otp });

//     //         const response = await axios.post('/api/v1/otp/verify', {
//     //             phone: submittedPhone,
//     //             otp: data.otp
//     //         });

//     //         if (response.data.success) {
//     //             console.log("OTP Verified Successfully");
//     //             setStep('setPin');
//     //         }
//     //     } catch (error: any) {
//     //         console.error('OTP Error:', error);
//     //         const errorMessage = error.response?.data?.message || "Verification failed. Invalid OTP.";
//     //         alert(errorMessage);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
   
   
//     const onSubmitOtp: SubmitHandler<VerifyOtpFormData> = async (data) => {
//         if (!submittedPhone) {
//             alert("Phone number missing!")
//             return
//         }

//         const fullPhone = submittedPhone.startsWith('01') ? '+88' + submittedPhone : submittedPhone
//         const savedOtp = localStorage.getItem(`otp_${fullPhone}`)
//         const savedTime = localStorage.getItem(`otp_time_${fullPhone}`)

//         setLoading(true)

//         try {
//             if (!savedOtp || !savedTime) {
//                 alert("OTP expired or not found. Please request again.")
//                 return
//             }

//             const timeDiff = (Date.now() - parseInt(savedTime)) / 1000
//             if (timeDiff > 180) { // 3 minutes
//                 localStorage.removeItem(`otp_${fullPhone}`)
//                 localStorage.removeItem(`otp_time_${fullPhone}`)
//                 alert("OTP has expired. Please request a new one.")
//                 return
//             }

//             if (data.otp === savedOtp) {
//                 // OTP Correct → Clear OTP
//                 localStorage.removeItem(`otp_${fullPhone}`)
//                 localStorage.removeItem(`otp_time_${fullPhone}`)

//                 // Save phone in parent state or context for final registration
//                 // We'll pass it via context or parent state later
//                 alert("OTP Verified Successfully!")
//                 setStep('setPin')
//             } else {
//                 alert("Invalid OTP")
//             }
//         } catch (error) {
//             alert("Verification failed")
//         } finally {
//             setLoading(false)
//         }
//     }




//     return (
//         <div>
//             {step === 'verifyOtp' && (
//                 <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-4 text-center">
//                     <div className="flex justify-center mb-4">
//                         <svg className="h-16 w-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
//                         </svg>
//                     </div>

//                     <p className="text-sm text-gray-600">
//                         We have sent the verification code to <br />
//                         <span className='font-bold text-black'>{submittedPhone}</span>
//                     </p>

//                     <div className="space-y-2">
//                         <label htmlFor="otp" className="flex items-center justify-center text-[12px] font-medium text-gray-900">
//                             OTP Number <Asterisk className="h-3 w-3 text-red-500" />
//                         </label>
//                         <Input
//                             id="otp"
//                             type="text"
//                             placeholder="Enter 6 digit OTP"
//                             maxLength={6}
//                             {...registerOtp('otp', {
//                                 required: 'OTP is required',
//                                 pattern: {
//                                     value: /^\d{6}$/,
//                                     message: 'OTP must be exactly 6 digits',
//                                 },
//                             })}
//                             className={`text-center tracking-widest ${otpErrors.otp ? 'border-red-500' : ''}`}
//                         />
//                         {otpErrors.otp && (
//                             <p className="text-sm text-red-500">{otpErrors.otp.message}</p>
//                         )}
//                     </div>

//                     <Button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white hover:bg-blue-700"
//                         disabled={loading}
//                     >
//                         {loading ? (
//                             <>
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
//                             </>
//                         ) : (
//                             'Verify →'
//                         )}
//                     </Button>

//                     <a href="#" onClick={(e) => {
//                         e.preventDefault();
//                         alert("Resend API needs to be implemented");
//                     }} className="text-sm text-blue-600 hover:underline text-center block">
//                         Didn&#39;t receive the code? Send again
//                     </a>
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
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { VerifyOtpFormData, FormStep } from '../LogIn_Register'

interface VerifyOTPProps {
    step: string
    setStep: Dispatch<SetStateAction<FormStep>>
    submittedPhone: string
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

    // Add this function inside the component
    const handleResend = () => {
        // Clear old OTP from localStorage
        const fullPhone = submittedPhone.startsWith('01') ? '+88' + submittedPhone : submittedPhone
        localStorage.removeItem(`otp_${fullPhone}`)
        localStorage.removeItem(`otp_time_${fullPhone}`)

        // Go back to create account step (user will re-enter number & resend)
        setStep('createAccount')
    }

    const onSubmitOtp: SubmitHandler<VerifyOtpFormData> = async (data) => {
        if (!submittedPhone) {
            alert("Phone number not found. Please restart.")
            return
        }

        const fullPhone = submittedPhone.startsWith('01') ? '+88' + submittedPhone : submittedPhone
        const savedOtp = localStorage.getItem(`otp_${fullPhone}`)
        const savedTime = localStorage.getItem(`otp_time_${fullPhone}`)

        setLoading(true)

        try {
            if (!savedOtp || !savedTime) {
                alert("OTP expired or not found. Please resend.")
                handleResend()
                return
            }

            const timeDiff = (Date.now() - parseInt(savedTime)) / 1000
            if (timeDiff > 180) { // 3 minutes
                localStorage.removeItem(`otp_${fullPhone}`)
                localStorage.removeItem(`otp_time_${fullPhone}`)
                alert("OTP expired. Please request a new one.")
                handleResend()
                return
            }

            if (data.otp === savedOtp) {
                localStorage.removeItem(`otp_${fullPhone}`)
                localStorage.removeItem(`otp_time_${fullPhone}`)
                alert("OTP Verified Successfully!")
                setStep('setPin')
            } else {
                alert("Invalid OTP. Please try again.")
            }
        } catch (error) {
            alert("Verification failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {step === 'verifyOtp' && (
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

                    {/* Add the Resend Link Here */}
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
            )}
        </div>
    )
}