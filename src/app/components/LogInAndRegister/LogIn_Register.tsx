'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import React, { useEffect, useRef, useState } from 'react'
import {
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import LogIn from './components/LogIn'
import CreateAccount from './components/CreateAccount'
import VerifyOTP from './components/VerifyOTP'
import SetPin from './components/SetPin'
import Forgetpin from './components/Forgetpin'
import SetNewPin from './components/SetNewPin'
import { useRedirectAfterLogin } from '@/hooks/useRedirectAfterLogin'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react' // ✅ Added for session management

export interface LoginFormData {
  identifier: string
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
  confirmPin: string
}

export type FormStep =
  | 'login'
  | 'createAccount'
  | 'verifyOtp'
  | 'setPin'
  | 'forgetPin'
  | 'setNewPin'

export default function LogInRegister() {
  useRedirectAfterLogin()
  const router = useRouter()
  const { update } = useSession() // ✅ For session updates without full reload

  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const [step, setStep] = useState<FormStep>('login')
  const [submittedPhone, setSubmittedPhone] = useState<string>('')
  const [registeredPhone, setRegisteredPhone] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const container = document.createElement('div')
    container.id = 'recaptcha-container'
    document.body.appendChild(container)
    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }
    }
  }, [])

  const loginForm = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      pin: '',
      rememberMe: false,
    },
  })

  const createForm = useForm<CreateAccountFormData>({ mode: 'onChange' })
  const otpForm = useForm<VerifyOtpFormData>({ mode: 'onChange' })
  const pinForm = useForm<SetPinFormData>({ mode: 'onChange' })

  const [showPin, setShowPin] = useState<boolean>(false)

  // ✅ OPTIMIZED: Login Submit Handler
  const onSubmitLogin = async (data: LoginFormData) => {
    try {
      setLoading(true)
      toast.loading('Logging in...', { id: 'login-toast' })

      // 1. Call Backend API - Single request
      const res = await axios.post('/api/v1/auth/login', {
        identifier: data.identifier,
        password: data.pin,
      })

      if (res.data.success) {
        const { user, accessToken } = res.data.data

        // 2. ✅ Create NextAuth session
        const result = await signIn('credentials', {
          redirect: false,
          userId: user._id,
          role: user.role,
          accessToken: accessToken,
          vendorId: user.vendorId || '',
          name: user.name || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          profilePicture: user.profilePicture || '',
          address: user.address || '',
        })

        toast.dismiss('login-toast')

        if (result?.error) {
          toast.error('Session creation failed', {
            description: 'Please try again',
          })
          return
        }

        // 3. ✅ Success handling
        toast.success('Welcome back!', {
          description: 'Login successful',
          duration: 3000,
        })

        closeButtonRef.current?.click()

        // 4. ✅ Update session without full reload (faster)
        await update()
        
        // 5. ✅ Soft navigation instead of hard reload
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/'
        localStorage.removeItem('redirectAfterLogin')
        router.push(redirectPath)
        router.refresh() // Soft refresh
      }
    } catch (error: any) {
      toast.dismiss('login-toast')
      console.error('Login Error:', error)

      // ✅ Better error messages
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Login failed. Please check your credentials.'

      toast.error('Login Failed', {
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  // ✅ OPTIMIZED: Handle Account Created (Auto Login)
  const handleAccountCreated = async (phone: string, pin: string) => {
    try {
      toast.loading('Setting up your account...', { id: 'setup-toast' })

      const cleanPhone = phone.startsWith('0')
        ? phone
        : '0' + phone.replace('+88', '')

      // 1. Backend login
      const loginRes = await axios.post('/api/v1/auth/login', {
        identifier: cleanPhone,
        password: pin,
      })

      if (loginRes.data.success) {
        const { user, accessToken } = loginRes.data.data

        // 2. ✅ Create NextAuth session
        const result = await signIn('credentials', {
          redirect: false,
          userId: user._id,
          role: user.role,
          accessToken: accessToken,
          vendorId: user.vendorId || '',
          name: user.name || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          profilePicture: user.profilePicture || '',
          address: user.address || '',
        })

        toast.dismiss('setup-toast')

        if (result?.error) {
          toast.error('Account created but login failed', {
            description: 'Please log in manually',
          })
          setStep('login')
          return
        }

        // 3. ✅ Success
        toast.success('Welcome to Guptodhan! 🎉', {
          description: 'Your account is ready',
          duration: 6000,
        })

        closeButtonRef.current?.click()

        // 4. ✅ Update session and navigate
        await update()
        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      toast.dismiss('setup-toast')
      console.error('Auto-login failed:', err)

      toast.success('Account created successfully! 🎉', {
        description: 'Please log in to continue',
        duration: 5000,
      })
      setStep('login')
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogTitle className="sr-only">Authentication</DialogTitle>

      <DialogClose asChild>
        <button
          ref={closeButtonRef}
          className="absolute right-4 top-4 text-3xl font-light text-gray-500 hover:text-gray-800 focus:outline-none"
          aria-label="Close"
        >
          {/* × */}
        </button>
      </DialogClose>

      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            {step === 'login' && 'User Login'}
            {step === 'createAccount' && 'Create Account'}
            {step === 'verifyOtp' && 'Verify OTP'}
            {step === 'setPin' && 'Set Your PIN'}
            {step === 'forgetPin' && 'Forgot PIN'}
            {step === 'setNewPin' && 'Set New PIN'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 'login' && (
            <LogIn
              step={step}
              registerLogin={loginForm.register}
              handleSubmitLogin={loginForm.handleSubmit}
              loginErrors={loginForm.formState.errors}
              onSubmitLogin={onSubmitLogin}
              showPin={showPin}
              setShowPin={setShowPin}
              setStep={setStep}
              loading={loading} // ✅ Pass loading state
            />
          )}

          <CreateAccount
            step={step}
            handleSubmitCreate={createForm.handleSubmit}
            registerCreate={createForm.register}
            createErrors={createForm.formState.errors}
            setStep={setStep}
            setSubmittedPhone={setSubmittedPhone}
            setRegisteredPhone={setRegisteredPhone}
          />

          <VerifyOTP
            step={step}
            setStep={setStep}
            submittedPhone={submittedPhone}
            handleSubmitOtp={otpForm.handleSubmit}
            registerOtp={otpForm.register}
            otpErrors={otpForm.formState.errors}
          />

          <SetPin
            step={step}
            setStep={setStep}
            handleSubmitPin={pinForm.handleSubmit}
            registerPin={pinForm.register}
            pinErrors={pinForm.formState.errors}
            loading={loading}
            setLoading={setLoading}
            registeredPhone={registeredPhone}
            onSuccess={(pin) => handleAccountCreated(registeredPhone, pin)}
          />

          <Forgetpin step={step} setStep={setStep} />
          <SetNewPin step={step} setStep={setStep} />
        </CardContent>
      </Card>
    </DialogContent>
  )
}