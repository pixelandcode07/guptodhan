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
                            placeholder="+880 1777777777"
                            {...registerCreate('phone', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^\+?\d{3}\s?\d{9,}$/,
                                    message: 'Invalid phone number format (e.g., +880 1777777777)',
                                },
                            })}
                            className={createErrors.phone ? 'border-red-500' : ''}
                        />
                        {createErrors.phone && (
                            <p className="text-sm text-red-500">{createErrors.phone.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        {/* Create Account */}
                        {loading ? 'Loading...' : 'Create Account'}
                    </Button>
                </form>
            )}
        </div>
    )
}
