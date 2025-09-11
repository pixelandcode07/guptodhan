import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { FormStep, SetPinFormData } from '../LogIn_Register';
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

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
                        <Button variant="outline" className="w-full flex-1">
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,9.999,10c6.078,0,10.004-4.926,10.004-10c0-0.171-0.005-0.339-0.014-0.507c-0.588-0.1-1.127-0.252-1.718-0.444v0.444H12.545z" />
                            </svg>
                            Google
                        </Button>
                        <Button variant="outline" className="w-full flex-1">
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}
