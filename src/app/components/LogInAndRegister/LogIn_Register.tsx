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
// import { signInWithPhoneNumber } from "firebase/auth";

// Extend the Window interface to include confirmationResult
declare global {
    interface Window {
        confirmationResult?: any;
    }
}

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
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    // Recaptcha container added to body
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

    const onSubmitCreate = async (data: CreateAccountFormData) => {
        setLoading(true)
        setError(null)

        try {
            const phoneNumber = data.phone.replace(/\s/g, ''); // ফোন নম্বর ফরম্যাট করা
            // const res = await axios.post('/api/v1/user/register', { body: data })
            const res = await axios.post('/api/v1/user/register', { phone: phoneNumber }) // API পাথ এবং ডেটা আপডেট
            if (res.data.success) {
                setSubmittedPhone(phoneNumber)
                const recaptchaVerifier = setupRecaptcha('recaptcha-container')
                const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
                window.confirmationResult = confirmationResult
                setStep('verifyOtp')
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed')
            console.error('Registration error:', error)
        } finally {
            setLoading(false)
        }




        // setStep('verifyOtp')
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

    const onSubmitOtp = async (data: VerifyOtpFormData) => {
        setLoading(true)
        setError(null)
        try {
            const result = await window.confirmationResult.confirm(data.otp)
            const idToken = await result.user.getIdToken()
            const decodedToken = JSON.parse(atob(idToken.split('.')[1]));
            setUserId(decodedToken.uid);
            const response = await axios.post('/api/otp/verify-phone', { idToken })
            if (response.data.success) {
                setStep('setPin')
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'OTP verification failed')
            console.error('OTP error:', err)
        } finally {
            setLoading(false)
        }
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

    const onSubmitPin = async (data: SetPinFormData) => {
        // console.log('Set PIN Data:', { phone: submittedPhone, pin: data.pin })
        // alert(`Account created with phone: ${submittedPhone}, PIN: ${data.pin}`)
        // setStep('login') 
        setLoading(true)
        setError(null)
        try {
            // if (!userId) throw new Error('User ID not found');
            const response = await axios.post('/app/api/auth/set-password', {
                // phone: submittedPhone,
                // pin: data.pin
                newPassword: data.pin
            }, {
                headers: {
                    'x-user-id': userId,
                }
            })
            if (response.data.success) {
                alert(`Account created successfully with phone: ${submittedPhone}`)
                setStep('login')
                // ডায়ালগ ক্লোজ এবং ড্যাশবোর্ডে রিডিরেক্ট (যেমন: window.location.href = '/dashboard')
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'PIN setting failed')
            console.error('Set PIN error:', err)
        } finally {
            setLoading(false)
        }
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
                        createErrors={createErrors}
                        loading={loading}
                    />

                    {/* Verify OTP */}
                    <VerifyOTP
                        step={step}
                        handleSubmitOtp={handleSubmitOtp}
                        onSubmitOtp={onSubmitOtp}
                        registerOtp={registerOtp}
                        otpErrors={otpErrors}
                        loading={loading}
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