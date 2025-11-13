'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

type SignUpInputs = {
  name: string;
  email: string;
  password: string;
  businessName?: string;
};

export default function VendorSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInputs>();

  const onSignUp = async (values: SignUpInputs) => {
    try {
      await axios.post('/api/v1/auth/register-vendor', values);
      toast.success('Account created successfully!');
      // redirect to login page if needed
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sign up');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left - Image section */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0">
            <Image
              src="/img/singup.png"
              alt="Vendor signup"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
            <h2 className="text-3xl font-semibold">Join our vendor network</h2>
            <p className="mt-2 text-sm opacity-90">Create your vendor account to start managing your store.</p>
          </div>
        </div>

        {/* Right - Card with SignUp */}
        <div className="p-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Vendor Sign Up</CardTitle>
              <CardDescription>Create your vendor account to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSignUp)} className="space-y-4">
                <div>
                  <Label htmlFor="signUpName">Full name</Label>
                  <Input
                    id="signUpName"
                    placeholder="Your name"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="signUpEmail">Email</Label>
                  <Input
                    id="signUpEmail"
                    placeholder="you@company.com"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="signUpPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="signUpPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Choose a password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <Label htmlFor="businessName">Business name (optional)</Label>
                  <Input
                    id="businessName"
                    placeholder="Your shop or company"
                    {...register('businessName')}
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}