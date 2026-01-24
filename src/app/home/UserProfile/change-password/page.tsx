'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const setPasswordSchema = z.object({
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'],
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: z.string().min(8, { message: 'New password must be at least 8 characters long.' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ['confirmPassword'],
});

type SetPasswordFormData = z.infer<typeof setPasswordSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  console.log("Session", session)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPassword = session?.user?.hasPassword ?? false;

  const schema = hasPassword ? changePasswordSchema : setPasswordSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SetPasswordFormData | ChangePasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    if (status !== 'authenticated') {
      toast.error('You must be logged in.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (hasPassword) {
        // Change Password
        await axios.post('/api/v1/auth/change-password', {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
        toast.success('Password changed successfully!');
      } else {
        // Set Password (first time after social login)
        await axios.post('/api/v1/auth/set-password', {
          newPassword: data.newPassword,
        });
        toast.success('Password set successfully! You can now log in with password.');
      }

      reset();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Failed to update password. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {hasPassword ? 'Change Password' : 'Set Password'}
          </CardTitle>
          <CardDescription>
            {hasPassword
              ? 'Update your password for better security'
              : 'Set a password for your account (required after social login)'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password - only if password already set */}
            {hasPassword && (
              <div className="space-y-2">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Enter current password"
                    {...register('currentPassword')}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <Label>{hasPassword ? 'New Password' : 'Enter Password'}</Label>
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  {...register('newPassword')}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  {...register('confirmPassword')}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting
                ? 'Processing...'
                : hasPassword
                ? 'Change Password'
                : 'Set Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}