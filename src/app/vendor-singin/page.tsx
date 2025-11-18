
// Updated beautiful Vendor Login Page using shadcn UI, gradient, glassmorphism
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Store } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function VendorLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({})

  const onSignIn = async (values) => {
    try {
      const payload = {
        identifier: values.email,
        password: values.password,
      }

      const res = await axios.post('/api/v1/auth/vendor-login', payload)

      await signIn('credentials', {
        redirect: false,
        userId: res.data.user._id,
        role: res.data.user.role,
        accessToken: res.data.accessToken,
      })

      toast.success('Signed in successfully!')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sign in')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-violet-200 to-indigo-200 p-6">
      <div className="w-full max-w-5xl backdrop-blur-xl bg-white/40 border border-white/20 shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        <div className="relative hidden md:block">
          <Image
            src="/img/singin.png"
            alt="Vendor login"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/40 to-indigo-400/20" />
          <div className="absolute bottom-6 left-6 text-white drop-shadow-lg">
            <h2 className="text-3xl font-semibold flex items-center gap-2">
              <Store size={28} /> Welcome Vendors
            </h2>
            <p className="mt-1 text-sm opacity-80">Sign in to manage your products & dashboard.</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 flex items-center justify-center">
          <Card className="w-full max-w-md border-none shadow-md bg-white/60 backdrop-blur-2xl border border-white/30 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Vendor Sign In</CardTitle>
              <CardDescription>Securely access your vendor dashboard</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSignIn)} className="space-y-6">
                {/* Email */}
                <div>
                  <Label htmlFor="signInEmail">Email Address</Label>
                  <Input
                    id="signInEmail"
                    placeholder="you@company.com"
                    className="mt-1"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="signInPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="signInPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      className="mt-1 pr-10"
                      {...register('password', { required: 'Password is required' })}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 text-base rounded-xl shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
