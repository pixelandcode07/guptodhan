import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk, Eye, EyeOff } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { FormStep, LoginFormData } from '../LogIn_Register';


export default function LogIn({ step, setStep, registerLogin,
    handleSubmitLogin, loginErrors, onSubmitLogin,
    showPin, setShowPin }: {
        step: string;
        setStep: Dispatch<SetStateAction<FormStep>>;
        registerLogin: UseFormRegister<LoginFormData>;
        handleSubmitLogin: UseFormHandleSubmit<LoginFormData>;
        loginErrors: FieldErrors<LoginFormData>;
        onSubmitLogin: SubmitHandler<LoginFormData>;
        showPin: boolean;
        setShowPin: Dispatch<SetStateAction<boolean>>;
    }) {
    return (
        <div>
            {step === 'login' && (
                <form onSubmit={handleSubmitLogin(onSubmitLogin)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="flex items-center text-[12px] font-medium text-gray-900">
                            Phone number <Asterisk className="h-3 w-3 text-red-500" />
                        </label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+880 1777777777"
                            {...registerLogin('phone', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^\+?\d{3}\s?\d{9,}$/,
                                    message: 'Invalid phone number format (e.g., +880 1777777777)',
                                },
                            })}
                            className={loginErrors.phone ? 'border-red-500' : ''}
                            defaultValue="+880 1777777777"
                        />
                        {loginErrors.phone && (
                            <p className="text-sm text-red-500">{loginErrors.phone.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="pin" className="flex items-center text-[12px] font-medium text-gray-900">
                            Enter your PIN number<Asterisk className="h-3 w-3 text-red-500" />
                        </label>
                        <div className="relative">
                            <Input
                                id="pin"
                                type={showPin ? 'text' : 'password'}
                                placeholder="Enter your PIN"
                                {...registerLogin('pin', {
                                    required: 'PIN is required',
                                    minLength: {
                                        value: 4,
                                        message: 'PIN must be at least 4 digits',
                                    },
                                    pattern: {
                                        value: /^\d{4,}$/,
                                        message: 'PIN must be numeric',
                                    },
                                })}
                                className={loginErrors.pin ? 'border-red-500' : ''}
                                defaultValue="1234"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPin(!showPin)}
                            >
                                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        {loginErrors.pin && (
                            <p className="text-sm text-red-500">{loginErrors.pin.message}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                {...registerLogin('rememberMe')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                defaultChecked={false}
                            />
                            <label htmlFor="rememberMe" className="text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                            Forgot PIN?
                        </a>
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        Login
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setStep('createAccount')}
                    >
                        Create Account
                    </Button>
                    <div className="text-center text-sm text-gray-600">OR LOGIN WITH</div>
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
