import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { FormStep, SetPinFormData } from '../LogIn_Register';
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import SocialLoginPart from './SocialLoginPart';

export default function SetPin({ step, setStep, handleSubmitPin, onSubmitPin,
    registerPin, pinErrors,loading }: {
        step: string;
        setStep: Dispatch<SetStateAction<FormStep>>;
        handleSubmitPin: UseFormHandleSubmit<SetPinFormData>;
        onSubmitPin: SubmitHandler<SetPinFormData>;
        registerPin: UseFormRegister<SetPinFormData>;
        pinErrors: FieldErrors<SetPinFormData>;
        loading: boolean;
    }) {
    return (
        <div>
            {step === 'setPin' && (
                <form onSubmit={handleSubmitPin(onSubmitPin)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="pin" className="flex items-center text-[12px] font-medium text-gray-900">
                            Set a 4 digit PIN number <Asterisk className="h-3 w-3 text-red-500" />
                        </label>
                        <Input
                            id="pin"
                            type="password"
                            placeholder="1234"
                            {...registerPin('pin', {
                                required: 'PIN is required',
                                minLength: {
                                    value: 4,
                                    message: 'PIN must be 4 digits',
                                },
                                pattern: {
                                    value: /^\d{4}$/,
                                    message: 'PIN must be exactly 4 digits',
                                },
                            })}
                            className={pinErrors.pin ? 'border-red-500' : ''}
                        />
                        {pinErrors.pin && (
                            <p className="text-sm text-red-500">{pinErrors.pin.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        Create Account!
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setStep('login')}
                    >
                        Login
                    </Button>
                    <div className="text-center text-sm text-gray-600">OR CREATE ACCOUNT WITH</div>
                    <div className="flex space-x-2">
                       <SocialLoginPart />
                    </div>
                </form>
            )}
        </div>
    )
}
