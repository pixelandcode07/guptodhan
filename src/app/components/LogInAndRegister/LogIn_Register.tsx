import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import LogIn from './components/LogIn'
import CreateAccount from './components/CreateAccount'
import VerifyOTP from './components/VerifyOTP'
import SetPin from './components/SetPin'

// TypeScript interfaces for form data
export interface LoginFormData {
    phone: string
    pin: string
    rememberMe: boolean
}

export interface CreateAccountFormData {
    phone: string
}

export interface VerifyOtpFormData {
    otp: string
}

export interface SetPinFormData {
    pin: string
}

export type FormStep = 'login' | 'createAccount' | 'verifyOtp' | 'setPin'

export default function LogInRegister() {
    const [step, setStep] = useState<FormStep>('login')
    const [submittedPhone, setSubmittedPhone] = useState<string>('')

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
        // alert(JSON.stringify(data, null, 2))
    }

    // Create Account Form
    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        formState: { errors: createErrors },
    } = useForm<CreateAccountFormData>({
        mode: 'onChange',
        defaultValues: {
            phone: '',
        },
    })

    const onSubmitCreate = (data: CreateAccountFormData) => {
        setSubmittedPhone(data.phone)
        setStep('verifyOtp')
    }

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

    const onSubmitOtp = (data: VerifyOtpFormData) => {
        // Simulate OTP verification (replace with API call)
        console.log('OTP Data:', data)
        setStep('setPin')
    }

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

    const onSubmitPin = (data: SetPinFormData) => {
        console.log('Set PIN Data:', { phone: submittedPhone, pin: data.pin })
        alert(`Account created with phone: ${submittedPhone}, PIN: ${data.pin}`)
        setStep('login') // Return to login after success
    }

    return (
        <DialogContent>
            <DialogTitle>
                {/* {step === 'login' && 'User Login'}
                {step === 'createAccount' && 'Create Account'}
                {step === 'verifyOtp' && 'Verify OTP'}
                {step === 'setPin' && 'Create Account'} */}
            </DialogTitle>
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-center">
                        {step === 'login' && 'User Login'}
                        {step === 'createAccount' && 'Create Account'}
                        {step === 'verifyOtp' && 'Verify OTP'}
                        {step === 'setPin' && 'Create Account'}
                    </CardTitle>
                </CardHeader>
                <CardContent>

                    {/* LogIn */}
                    <LogIn step={step}
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
                        onSubmitCreate={onSubmitCreate}
                        registerCreate={registerCreate}
                        createErrors={createErrors} />

                    {/* Verify OTP */}
                    <VerifyOTP
                        step={step}
                        handleSubmitOtp={handleSubmitOtp}
                        onSubmitOtp={onSubmitOtp}
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
                    />
                </CardContent>
                <DialogFooter>
                    <DialogClose asChild>
                        {/* <Button variant="outline">Cancel</Button> */}
                    </DialogClose>
                </DialogFooter>
            </Card>
        </DialogContent>
    )
}