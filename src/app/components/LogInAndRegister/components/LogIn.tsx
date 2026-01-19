import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Asterisk, Eye, EyeOff, Loader2 } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { FormStep, LoginFormData } from '../LogIn_Register'
import SocialLoginPart from './SocialLoginPart'

export default function LogIn({
  step,
  setStep,
  registerLogin,
  handleSubmitLogin,
  loginErrors,
  onSubmitLogin,
  showPin,
  setShowPin,
  loading, // ✅ Added loading prop
}: {
  step: string
  setStep: Dispatch<SetStateAction<FormStep>>
  registerLogin: UseFormRegister<LoginFormData>
  handleSubmitLogin: UseFormHandleSubmit<LoginFormData>
  loginErrors: FieldErrors<LoginFormData>
  onSubmitLogin: SubmitHandler<LoginFormData>
  showPin: boolean
  setShowPin: Dispatch<SetStateAction<boolean>>
  loading?: boolean // ✅ Optional loading state
}) {
  return (
    <div>
      {step === 'login' && (
        <form onSubmit={handleSubmitLogin(onSubmitLogin)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="identifier" className="flex items-center text-[12px] font-medium text-gray-900">
              Phone number or Email <Asterisk className="h-3 w-3 text-red-500" />
            </label>

            <Input
              id="identifier"
              type="text"
              placeholder="Enter phone or email"
              disabled={loading} // ✅ Disable during loading
              {...registerLogin('identifier', {
                required: 'Phone number or Email is required',
                validate: (value) => {
                  // Check if input is Email
                  if (value.includes('@')) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    return emailRegex.test(value) || 'Invalid email format'
                  }
                  // Otherwise Check if input is Phone
                  else {
                    const phoneRegex = /^\+?[\d\s-]{10,15}$/
                    return phoneRegex.test(value) || 'Invalid phone number format'
                  }
                },
              })}
              className={loginErrors.identifier ? 'border-red-500' : ''}
            />
            {loginErrors.identifier && (
              <p className="text-sm text-red-500">{loginErrors.identifier.message}</p>
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
                disabled={loading} // ✅ Disable during loading
                {...registerLogin('pin', {
                  required: 'PIN is required',
                  minLength: {
                    value: 4,
                    message: 'PIN must be at least 4 digits',
                  },
                })}
                className={loginErrors.pin ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPin(!showPin)}
                disabled={loading} // ✅ Disable during loading
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {loginErrors.pin && <p className="text-sm text-red-500">{loginErrors.pin.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                {...registerLogin('rememberMe')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked={false}
                disabled={loading} // ✅ Disable during loading
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a
              onClick={() => !loading && setStep('forgetPin')} // ✅ Prevent during loading
              className={`text-sm text-blue-600 hover:underline ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              Forgot PIN?
            </a>
          </div>

          {/* ✅ Updated Login Button with Loading State */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setStep('createAccount')}
            type="button"
            disabled={loading} // ✅ Disable during loading
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