'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk, Loader2 } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { CreateAccountFormData, FormStep } from '../LogIn_Register';
import axios from 'axios';

interface CreateAccountProps {
    step: string;
    handleSubmitCreate: UseFormHandleSubmit<CreateAccountFormData>;
    registerCreate: UseFormRegister<CreateAccountFormData>;
    createErrors: FieldErrors<CreateAccountFormData>;
    setStep: Dispatch<SetStateAction<FormStep>>;
    setSubmittedPhone: Dispatch<SetStateAction<string>>;
}

export default function CreateAccount({ 
    step, 
    handleSubmitCreate, 
    registerCreate, 
    createErrors, 
    setStep,
    setSubmittedPhone
}: CreateAccountProps) {

    const [loading, setLoading] = useState(false);

    const onSubmitLocal = async (data: CreateAccountFormData) => {
        setLoading(true);
        try {
            const formattedPhone = data.phoneNumber.replace(/\s/g, '');
            console.log('Sending OTP to:', formattedPhone);

            const res = await axios.post('/api/v1/otp', { 
                phone: formattedPhone 
            });

            if (res.data.success) {
                setSubmittedPhone(formattedPhone);
                setStep('verifyOtp');
            }

        } catch (error: any) {
            console.error('Registration/OTP Error:', error);
            const msg = error.response?.data?.message || "Failed to send OTP";
            alert(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {step === 'createAccount' && (
                <form onSubmit={handleSubmitCreate(onSubmitLocal)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="flex items-center text-[12px] font-medium text-gray-900">
                            Phone number <Asterisk className="h-3 w-3 text-red-500" />
                        </label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+8801777777777"
                            {...registerCreate('phoneNumber', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/,
                                    message: 'Must be a valid Bangladeshi phone number',
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
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...
                            </>
                        ) : (
                            'Create Account / Send OTP'
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => setStep('login')}
                    >
                        Back to Login
                    </Button>
                </form>
            )}
        </div>
    )
}