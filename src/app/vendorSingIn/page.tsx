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

type SignInInputs = {
  email: string;
  password: string;
};

export default function VendorLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInputs>();

  const onSignIn = async (values: SignInInputs) => {
    try {
      await axios.post('/api/v1/auth/vendor-login', values);
      toast.success('Signed in successfully');
      // redirect or update UI here
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left - Image section */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0">
            <Image
              src="/img/singin.png"
              alt="Vendor login"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
            <h2 className="text-3xl font-semibold">Welcome vendors</h2>
            <p className="mt-2 text-sm opacity-90">Sign in to manage your store, orders and profile.</p>
          </div>
        </div>

        {/* Right - Card with SignIn */}
        <div className="p-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Vendor Sign In</CardTitle>
              <CardDescription>Access your vendor dashboard by signing in.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSignIn)} className="space-y-4">
                <div>
                  <Label htmlFor="signInEmail">Email</Label>
                  <Input
                    id="signInEmail"
                    placeholder="you@company.com"
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="signInPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="signInPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      {...register('password', { required: 'Password is required' })}
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

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
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
