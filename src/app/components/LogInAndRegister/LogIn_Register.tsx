import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import LogIn from './components/LogIn'
import CreateAccount from './components/CreateAccount'
import VerifyOTP from './components/VerifyOTP'
import SetPin from './components/SetPin'
import axios from 'axios'
import { auth, setupRecaptcha, signInWithPhoneNumber } from '@/lib/firebase'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { registerWithPhoneSchema } from '@/lib/modules/user/user.validation'
import Forgetpin from './components/Forgetpin'
import SetNewPin from './components/SetNewPin'
import { useRedirectAfterLogin } from '@/hooks/useRedirectAfterLogin'

// TypeScript interfaces for form data
export interface LoginFormData {
    phone: string
    pin: string
    rememberMe: boolean
}

export interface CreateAccountFormData {
    phoneNumber: string
}

export interface VerifyOtpFormData {
    otp: string
}

export interface SetPinFormData {
    pin: string
}

export type FormStep = 'login' | 'createAccount' | 'verifyOtp' | 'setPin' | 'forgetPin' | 'setNewPin'

export default function LogInRegister() {
    useRedirectAfterLogin();
    const [step, setStep] = useState<FormStep>('login')
    const [submittedPhone, setSubmittedPhone] = useState<string>('')
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const container = document.createElement('div')
        container.id = 'recaptcha-container'
        document.body.appendChild(container)
        return () => {
            document.body.removeChild(container)
        }
    }, [])

    // Login Form
    const {
        register: registerLogin,
        handleSubmit: handleSubmitLogin,
        formState: { errors: loginErrors },
    } = useForm<LoginFormData>({
        mode: 'onChange',
        defaultValues: {
            phone: '+880 1777777777',
            pin: '1234',
            rememberMe: false,
        },
    })
    const [showPin, setShowPin] = useState<boolean>(false)

    const onSubmitLogin = (data: LoginFormData) => {
        console.log('Login Data:', data)
    }

    // Create Account Form
    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        formState: { errors: createErrors },
    } = useForm<CreateAccountFormData>({
        mode: 'onChange',
        defaultValues: {
            phoneNumber: '',
        },
        resolver: zodResolver(registerWithPhoneSchema.shape.body),
    })

    // Verify OTP Form
    const {
        register: registerOtp,
        handleSubmit: handleSubmitOtp,
        formState: { errors: otpErrors },
    } = useForm<VerifyOtpFormData>({
        mode: 'onChange',
        defaultValues: {
            otp: '',
        },
    })

    // Set PIN Form
    const {
        register: registerPin,
        handleSubmit: handleSubmitPin,
        formState: { errors: pinErrors },
    } = useForm<SetPinFormData>({
        mode: 'onChange',
        defaultValues: {
            pin: '',
        },
    })

    const onSubmitPin = async (data: SetPinFormData) => {
        setLoading(true)
        setError(null)
        setStep('login')
    }

    return (
        <DialogContent>
            <DialogTitle></DialogTitle>
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-center">
                        {step === 'login' && 'User Login'}
                        {step === 'createAccount' && 'Create Account'}
                        {step === 'verifyOtp' && 'Verify OTP'}
                        {step === 'setPin' && 'Create Account'}
                        {step === 'forgetPin' && 'Forget PIN'}
                        {step === 'setNewPin' && 'Set New PIN'}
                    </CardTitle>
                </CardHeader>
                <CardContent>

                    {/* LogIn */}
                    <LogIn 
                        step={step}
                        setStep={setStep}
                        registerLogin={registerLogin}
                        handleSubmitLogin={handleSubmitLogin}
                        loginErrors={loginErrors}
                        onSubmitLogin={onSubmitLogin}
                        showPin={showPin}
                        setShowPin={setShowPin}
                    />

                    {/* CreateAccount */}
                    <CreateAccount
                        step={step}
                        handleSubmitCreate={handleSubmitCreate}
                        registerCreate={registerCreate}
                        createErrors={createErrors}
                        setStep={setStep}
                        setSubmittedPhone={setSubmittedPhone}
                    />

                    {/* Verify OTP */}
                    <VerifyOTP
                        step={step}
                        setStep={setStep}
                        submittedPhone={submittedPhone}
                        handleSubmitOtp={handleSubmitOtp}
                        registerOtp={registerOtp}
                        otpErrors={otpErrors}
                    />

                    {/* Set pin */}
                    <SetPin
                        step={step}
                        setStep={setStep}
                        handleSubmitPin={handleSubmitPin}
                        onSubmitPin={onSubmitPin}
                        registerPin={registerPin}
                        pinErrors={pinErrors}
                        loading={loading}
                    />

                    {/* Forget PIN */}
                    <Forgetpin step={step} setStep={setStep} />

                    {/* Set New PIN */}
                    <SetNewPin step={step} setStep={setStep} />
                </CardContent>
                <DialogFooter>
                    <DialogClose asChild>
                    </DialogClose>
                </DialogFooter>
            </Card>
        </DialogContent>
    )
}