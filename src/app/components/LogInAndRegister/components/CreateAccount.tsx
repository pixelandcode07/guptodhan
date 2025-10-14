import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk } from 'lucide-react'
import React from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { CreateAccountFormData } from '../LogIn_Register';

export default function CreateAccount({ step, handleSubmitCreate, onSubmitCreate,
    registerCreate, createErrors, loading }: {
        step: string;
        handleSubmitCreate: UseFormHandleSubmit<CreateAccountFormData>;
        onSubmitCreate: SubmitHandler<CreateAccountFormData>;
        registerCreate: UseFormRegister<CreateAccountFormData>;
        createErrors: FieldErrors<CreateAccountFormData>;
        loading: boolean;
    }) {
    return (
        <div>
            {step === 'createAccount' && (
                <form onSubmit={handleSubmitCreate(onSubmitCreate)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="flex items-center text-[12px] font-medium text-gray-900">
                            Phone number <Asterisk className="h-3 w-3 text-red-500" />
                        </label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+8801777777777 or 01777777777"
                            {...registerCreate('phoneNumber', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/,
                                    message: 'Must be a valid Bangladeshi phone number (e.g., +8801777777777 or 01777777777)',
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
                        // disabled={loading}
                    >
                        {/* {loading ? 'Loading...' : 'Create Account'} */}
                        Create Account
                    </Button>
                </form>
            )}
        </div>
    )
}
