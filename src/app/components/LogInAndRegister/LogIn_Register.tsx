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
import { useSession } from 'next-auth/react'

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
  const { update } = useSession()

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

  // ✅ FIXED: '0' + slice ছিল bug — এখন শুধু slice করে 01XXXXXXXXX বানাচ্ছি
  // +8801816506070 → slice(3) → 01816506070 ✅ (আগে '0'+slice(3) = 001... ❌ ছিল)
  const normalizePhone = (identifier: string): string => {
    const trimmed = identifier.trim()
    if (trimmed.includes('@')) return trimmed
    if (trimmed.startsWith('+88')) return trimmed.slice(3)
    if (trimmed.startsWith('88') && trimmed.length >= 13) return trimmed.slice(2)
    return trimmed
  }

  const performLogin = async (identifier: string, password: string) => {
    const cleanIdentifier = normalizePhone(identifier)

    try {
      const res = await axios.post('/api/v1/auth/vendor-login', {
        identifier: cleanIdentifier,
        password,
      })
      if (res?.data?.success) return res
    } catch {
      // vendor login fail হলে normal login ট্রাই করো
    }

    const res = await axios.post('/api/v1/auth/login', {
      identifier: cleanIdentifier,
      password,
    })
    return res
  }

  const onSubmitLogin = async (data: LoginFormData) => {
    try {
      setLoading(true)
      toast.loading('Logging in...', { id: 'login-toast' })

      const res = await performLogin(data.identifier, data.pin)

      if (res?.data?.success) {
        const { user, accessToken } = res.data.data

        const resolvedUserId = user._id || user.id || ''
        let resolvedVendorId = user.vendorId || ''

        if (user.role === 'vendor' && !resolvedVendorId) {
          try {
            const vendorRes = await axios.get('/api/v1/vendor/my-store', {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            resolvedVendorId =
              vendorRes?.data?.data?.vendorId ||
              vendorRes?.data?.data?._id ||
              ''
          } catch {
            console.warn('Could not fetch vendorId separately')
          }
        }

        const result = await signIn('credentials', {
          redirect: false,
          userId: resolvedUserId,
          role: user.role || 'user',
          accessToken: accessToken,
          vendorId: resolvedVendorId,
          name: user.name || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          profilePicture: user.profilePicture || '',
          address:
            typeof user.address === 'string'
              ? user.address
              : JSON.stringify(user.address || ''),
        })

        toast.dismiss('login-toast')

        if (result?.error) {
          toast.error('Session creation failed', {
            description: 'Please try again',
          })
          return
        }

        toast.success(`Welcome back, ${user.name || 'User'}!`, {
          description: 'Login successful',
          duration: 3000,
        })

        closeButtonRef.current?.click()
        await update()

        const savedUrl = localStorage.getItem('redirectAfterLogin')
        let redirectPath = savedUrl || window.location.pathname

        if (!savedUrl) {
          if (user.role === 'admin') {
            redirectPath = '/general'
          } else if (user.role === 'vendor') {
            redirectPath = '/dashboard'
          }
        }

        localStorage.removeItem('redirectAfterLogin')
        window.location.href = redirectPath
      }
    } catch (error: any) {
      toast.dismiss('login-toast')
      console.error('Login Error:', error)

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

  const handleAccountCreated = async (phone: string, pin: string) => {
    try {
      toast.loading('Setting up your account...', { id: 'setup-toast' })

      const cleanPhone = normalizePhone(phone)

      const loginRes = await axios.post('/api/v1/auth/login', {
        identifier: cleanPhone,
        password: pin,
      })

      if (loginRes.data.success) {
        const { user, accessToken } = loginRes.data.data
        const resolvedUserId = user._id || user.id || ''

        const result = await signIn('credentials', {
          redirect: false,
          userId: resolvedUserId,
          role: user.role || 'user',
          accessToken: accessToken,
          vendorId: user.vendorId || '',
          name: user.name || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          profilePicture: user.profilePicture || '',
          address:
            typeof user.address === 'string'
              ? user.address
              : JSON.stringify(user.address || ''),
        })

        toast.dismiss('setup-toast')

        if (result?.error) {
          toast.error('Account created but login failed', {
            description: 'Please log in manually',
          })
          setStep('login')
          return
        }

        toast.success('Welcome to Guptodhan! 🎉', {
          description: 'Your account is ready',
          duration: 6000,
        })

        closeButtonRef.current?.click()
        await update()

        const redirectPath =
          localStorage.getItem('redirectAfterLogin') || '/'
        localStorage.removeItem('redirectAfterLogin')
        window.location.href = redirectPath
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
              loading={loading}
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