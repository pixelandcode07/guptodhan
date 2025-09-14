import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk } from 'lucide-react'
import React from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { VerifyOtpFormData } from '../LogIn_Register';

export default function VerifyOTP({ step, handleSubmitOtp, onSubmitOtp,
    registerOtp, otpErrors, loading
}: {
    step: string;
    handleSubmitOtp: UseFormHandleSubmit<VerifyOtpFormData>;
    onSubmitOtp: SubmitHandler<VerifyOtpFormData>;
    registerOtp: UseFormRegister<VerifyOtpFormData>;
    otpErrors: FieldErrors<VerifyOtpFormData>;
    loading: boolean;
}) {
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
                        We have sent the verification code to your Mobile Number
                    </p>
                    <div className="space-y-2">
                        <label htmlFor="otp" className="flex items-center justify-center text-[12px] font-medium text-gray-900">
                            OTP Number <Asterisk className="h-3 w-3 text-red-500" />
                        </label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="1234"
                            {...registerOtp('otp', {
                                required: 'OTP is required',
                                pattern: {
                                    value: /^\d{4,6}$/,
                                    message: 'OTP must be 4-6 digits',
                                },
                            })}
                            className={otpErrors.otp ? 'border-red-500' : ''}
                            defaultValue=""
                        />
                        {otpErrors.otp && (
                            <p className="text-sm text-red-500">{otpErrors.otp.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        Verify →
                    </Button>
                    <a href="#" className="text-sm text-blue-600 hover:underline text-center block">
                        Didn&#39;t receive the code? Send again
                    </a>
                </form>
            )}
        </div>
    )
}
