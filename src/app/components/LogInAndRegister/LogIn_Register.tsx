// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
// import { useForm } from 'react-hook-form'
// import React, { useEffect, useState } from 'react'
// import { DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog'
// import LogIn from './components/LogIn'
// import CreateAccount from './components/CreateAccount'
// import VerifyOTP from './components/VerifyOTP'
// import SetPin from './components/SetPin'
// import axios from 'axios'
// import { auth, setupRecaptcha, signInWithPhoneNumber } from '@/lib/firebase'
// import z from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod';
// import { registerWithPhoneSchema } from '@/lib/modules/user/user.validation'
// import Forgetpin from './components/Forgetpin'
// import SetNewPin from './components/SetNewPin'
// import { useRedirectAfterLogin } from '@/hooks/useRedirectAfterLogin'

// // TypeScript interfaces for form data
// export interface LoginFormData {
//     phone: string
//     pin: string
//     rememberMe: boolean
// }

// export interface CreateAccountFormData {
//     phoneNumber: string
// }

// export interface VerifyOtpFormData {
//     otp: string
// }

// export interface SetPinFormData {
//     pin: string
// }

// export type FormStep = 'login' | 'createAccount' | 'verifyOtp' | 'setPin' | 'forgetPin' | 'setNewPin'

// export default function LogInRegister() {
//     useRedirectAfterLogin();
//     const [step, setStep] = useState<FormStep>('login')
//     const [submittedPhone, setSubmittedPhone] = useState<string>('')
//     const [userId, setUserId] = useState<string | null>(null)
//     const [loading, setLoading] = useState<boolean>(false)
//     const [error, setError] = useState<string | null>(null)

//     useEffect(() => {
//         const container = document.createElement('div')
//         container.id = 'recaptcha-container'
//         document.body.appendChild(container)
//         return () => {
//             document.body.removeChild(container)
//         }
//     }, [])

//     // Login Form
//     const {
//         register: registerLogin,
//         handleSubmit: handleSubmitLogin,
//         formState: { errors: loginErrors },
//     } = useForm<LoginFormData>({
//         mode: 'onChange',
//         defaultValues: {
//             phone: '+880 1777777777',
//             pin: '1234',
//             rememberMe: false,
//         },
//     })
//     const [showPin, setShowPin] = useState<boolean>(false)

//     const onSubmitLogin = (data: LoginFormData) => {
//         console.log('Login Data:', data)
//     }

//     // Create Account Form
//     const {
//         register: registerCreate,
//         handleSubmit: handleSubmitCreate,
//         formState: { errors: createErrors },
//     } = useForm<CreateAccountFormData>({
//         mode: 'onChange',
//         defaultValues: {
//             phoneNumber: '',
//         },
//         resolver: zodResolver(registerWithPhoneSchema.shape.body),
//     })

//     // Verify OTP Form
//     const {
//         register: registerOtp,
//         handleSubmit: handleSubmitOtp,
//         formState: { errors: otpErrors },
//     } = useForm<VerifyOtpFormData>({
//         mode: 'onChange',
//         defaultValues: {
//             otp: '',
//         },
//     })

//     // Set PIN Form
//     const {
//         register: registerPin,
//         handleSubmit: handleSubmitPin,
//         formState: { errors: pinErrors },
//     } = useForm<SetPinFormData>({
//         mode: 'onChange',
//         defaultValues: {
//             pin: '',
//         },
//     })

//     const onSubmitPin = async (data: SetPinFormData) => {
//         setLoading(true)
//         setError(null)
//         setStep('login')
//     }

//     return (
//         <DialogContent>
//             <DialogTitle></DialogTitle>
//             <Card className="border-none shadow-none">
//                 <CardHeader>
//                     <CardTitle className="text-center">
//                         {step === 'login' && 'User Login'}
//                         {step === 'createAccount' && 'Create Account'}
//                         {step === 'verifyOtp' && 'Verify OTP'}
//                         {step === 'setPin' && 'Create Account'}
//                         {step === 'forgetPin' && 'Forget PIN'}
//                         {step === 'setNewPin' && 'Set New PIN'}
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent>

//                     {/* LogIn */}
//                     <LogIn 
//                         step={step}
//                         setStep={setStep}
//                         registerLogin={registerLogin}
//                         handleSubmitLogin={handleSubmitLogin}
//                         loginErrors={loginErrors}
//                         onSubmitLogin={onSubmitLogin}
//                         showPin={showPin}
//                         setShowPin={setShowPin}
//                     />

//                     {/* CreateAccount */}
//                     <CreateAccount
//                         step={step}
//                         handleSubmitCreate={handleSubmitCreate}
//                         registerCreate={registerCreate}
//                         createErrors={createErrors}
//                         setStep={setStep}
//                         setSubmittedPhone={setSubmittedPhone}
//                     />

//                     {/* Verify OTP */}
//                     <VerifyOTP
//                         step={step}
//                         setStep={setStep}
//                         submittedPhone={submittedPhone}
//                         handleSubmitOtp={handleSubmitOtp}
//                         registerOtp={registerOtp}
//                         otpErrors={otpErrors}
//                     />

//                     {/* Set pin */}
//                     <SetPin
//                         step={step}
//                         setStep={setStep}
//                         handleSubmitPin={handleSubmitPin}
//                         onSubmitPin={onSubmitPin}
//                         registerPin={registerPin}
//                         pinErrors={pinErrors}
//                         loading={loading}
//                     />

//                     {/* Forget PIN */}
//                     <Forgetpin step={step} setStep={setStep} />

//                     {/* Set New PIN */}
//                     <SetNewPin step={step} setStep={setStep} />
//                 </CardContent>
//                 <DialogFooter>
//                     <DialogClose asChild>
//                     </DialogClose>
//                 </DialogFooter>
//             </Card>
//         </DialogContent>
//     )
// }



// src/app/components/LogInAndRegister/LogIn_Register.tsx

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

// Form Types
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

  // Close button ref — safe way to close dialog
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const [step, setStep] = useState<FormStep>('login')
  const [submittedPhone, setSubmittedPhone] = useState<string>('')
  const [registeredPhone, setRegisteredPhone] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // Forms
  const loginForm = useForm<LoginFormData>({ mode: 'onChange' })
  const createForm = useForm<CreateAccountFormData>({ mode: 'onChange' })
  const otpForm = useForm<VerifyOtpFormData>({ mode: 'onChange' })
  const pinForm = useForm<SetPinFormData>({ mode: 'onChange' })

  const [showPin, setShowPin] = useState(false)

  const onSubmitLogin = (data: LoginFormData) => {
    console.log('Logged in:', data)
    closeButtonRef.current?.click()
  }

  // Called after successful registration
  const handleAccountCreated = async (phone: string, pin: string) => {
    try {
      const cleanPhone = phone.startsWith('0')
        ? phone
        : '0' + phone.replace('+88', '')

      const loginRes = await axios.post('/api/v1/auth/login', {
        phone: cleanPhone,
        pin,
      })

      if (loginRes.data.success) {
        toast.success('Welcome to Guptodhan!', {
          description: 'Your account is ready and you are now logged in.',
          duration: 6000,
        })
      } else {
        toast.success('Account created successfully!', {
          description: 'You can now log in.',
        })
      }
    } catch (err: any) {
      console.error('Auto-login failed:', err)
      toast.success('Account created!', {
        description: 'Please log in to continue.',
      })
      setStep('login')
    } finally {
      closeButtonRef.current?.click() // Close dialog
      router.refresh()
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogTitle className="sr-only">Authentication</DialogTitle>

      {/* Safe Close Button */}
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
            {step === 'login' && 'Welcome Back'}
            {step === 'createAccount' && 'Create Account'}
            {step === 'verifyOtp' && 'Verify Phone'}
            {step === 'setPin' && 'Set Your PIN'}
            {step === 'forgetPin' && 'Forgot PIN'}
            {step === 'setNewPin' && 'Set New PIN'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Login */}
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
            />
          )}

          {/* Create Account */}
          <CreateAccount
            step={step}
            handleSubmitCreate={createForm.handleSubmit}
            registerCreate={createForm.register}
            createErrors={createForm.formState.errors}
            setStep={setStep}
            setSubmittedPhone={setSubmittedPhone}
            setRegisteredPhone={setRegisteredPhone}
          />

          {/* Verify OTP */}
          <VerifyOTP
            step={step}
            setStep={setStep}
            submittedPhone={submittedPhone}
            handleSubmitOtp={otpForm.handleSubmit}
            registerOtp={otpForm.register}
            otpErrors={otpForm.formState.errors}
          />

          {/* Set PIN */}
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

          {/* Other steps */}
          <Forgetpin step={step} setStep={setStep} />
          <SetNewPin step={step} setStep={setStep} />
        </CardContent>
      </Card>
    </DialogContent>
  )
}