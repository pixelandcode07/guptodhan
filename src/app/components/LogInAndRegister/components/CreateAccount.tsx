'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk, Loader2, Mail, Phone } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { CreateAccountFormData, FormStep } from '../LogIn_Register'
import axios from 'axios'
import { toast } from 'sonner'

// ✅ Updated Type to support email OR phone
interface CreateAccountProps {
  step: string
  handleSubmitCreate: UseFormHandleSubmit<any> // Changed to any to allow flexible fields
  registerCreate: UseFormRegister<any>
  createErrors: FieldErrors<any>
  setStep: Dispatch<SetStateAction<FormStep>>
  setSubmittedPhone: Dispatch<SetStateAction<string>>
  setRegisteredPhone: Dispatch<SetStateAction<string>>
}

// ⚠️ IMPORTANT: SMS API Key should be in .env, not hardcoded!
// const SMS_API_KEY = process.env.NEXT_PUBLIC_SMS_API_KEY;

export default function CreateAccount({
  step,
  handleSubmitCreate,
  registerCreate,
  createErrors,
  setStep,
  setSubmittedPhone,
  setRegisteredPhone
}: CreateAccountProps) {

  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<'phone' | 'email'>('phone') // Toggle state

  const onSubmitLocal = async (data: any) => {
    setLoading(true)
    try {
      let payload = {};

      if (method === 'phone') {
        let phone = data.phoneNumber.trim().replace(/\s/g, '')
        
        // Normalize BD Phone Number
        if (phone.startsWith('01')) {
          phone = '+880' + phone.slice(1)
        } else if (phone.startsWith('8801')) {
          phone = '+' + phone
        } else if (!phone.startsWith('+8801')) {
          toast.error('Please enter a valid Bangladeshi number')
          setLoading(false)
          return
        }
        payload = { phoneNumber: phone }
        setSubmittedPhone(phone) // Save for verification
        setRegisteredPhone(phone)
      } else {
        payload = { email: data.email.trim() }
        setSubmittedPhone(data.email) // Save email for verification
        setRegisteredPhone(data.email)
      }

      toast.loading('Sending OTP...', { id: 'otp-toast' })

      // ✅ Call Backend API to Send OTP (Handles both Email & SMS)
      const response = await axios.post('/api/v1/user/register', payload);

      if (response.data.success) {
        toast.dismiss('otp-toast');
        toast.success(`OTP sent to your ${method}!`);
        setStep('verifyOtp');
      }

    } catch (error: any) {
      toast.dismiss('otp-toast');
      const errorMsg = error.response?.data?.message || error.message || 'Failed to send OTP';
      toast.error(errorMsg);
      
      // If user exists, redirect to login
      if (error.response?.data?.action === 'login') {
        setTimeout(() => setStep('login'), 2000);
      }
    } finally {
      setLoading(false)
    }
  }

  if (step !== 'createAccount') return null

  return (
    <form onSubmit={handleSubmitCreate(onSubmitLocal)} className="space-y-5">
      
      {/* Toggle Buttons */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setMethod('phone')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            method === 'phone' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Phone size={16} /> Phone
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMethod('email')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            method === 'email' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Mail size={16} /> Email
          </div>
        </button>
      </div>

      {/* Input Fields based on Method */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-900">
          {method === 'phone' ? 'Phone Number' : 'Email Address'} <Asterisk className="h-3 w-3 text-red-500 ml-1" />
        </label>
        
        {method === 'phone' ? (
          <>
            <Input
              type="tel"
              placeholder="017XXXXXXXX"
              {...registerCreate('phoneNumber', {
                required: method === 'phone' ? 'Phone number is required' : false,
                pattern: {
                  value: /^(\+880|0)1[3-9]\d{8}$/,
                  message: 'Enter valid BD number (01XXXXXXXXX)',
                },
              })}
              className={createErrors.phoneNumber ? 'border-red-500' : ''}
            />
            {createErrors.phoneNumber && (
              <p className="text-sm text-red-500">{createErrors.phoneNumber.message as string}</p>
            )}
          </>
        ) : (
          <>
            <Input
              type="email"
              placeholder="example@mail.com"
              {...registerCreate('email', {
                required: method === 'email' ? 'Email is required' : false,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              className={createErrors.email ? 'border-red-500' : ''}
            />
            {createErrors.email && (
              <p className="text-sm text-red-500">{createErrors.email.message as string}</p>
            )}
          </>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 h-11"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending OTP...
          </>
        ) : (
          'Send OTP'
        )}
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-500">Already have an account? </span>
        <button
          type="button"
          className="text-sm font-semibold text-blue-600 hover:underline"
          onClick={() => setStep('login')}
          disabled={loading}
        >
          Login here
        </button>
      </div>
    </form>
  )
}