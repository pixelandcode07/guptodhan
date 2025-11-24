import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk, Eye, EyeOff } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { FormStep, LoginFormData } from '../LogIn_Register';
import SocialLoginPart from './SocialLoginPart';
import Forgetpin from './Forgetpin';


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
                        {/* Forget PIN */}
                        {/* <Forgetpin
                            step={step}
                            setStep={setStep}

                        /> */}
                        <a onClick={() => setStep("forgetPin")}
                            className="text-sm text-blue-600 hover:underline">
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
                    <div className="flex justify-center space-x-2">
                        <SocialLoginPart />
                    </div>
                </form>
            )}
        </div>
    )
}
