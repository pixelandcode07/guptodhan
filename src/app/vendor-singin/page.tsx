"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SITE_CONFIG } from "@/lib/config/siteConfig";

const getFriendlyError = (serverMessage: string, status?: number): string => {
  if (status === 404) return 'No account found with this email address.';
  if (status === 401) return 'Incorrect password. Please try again.';
  if (status === 403) return 'Your account has been disabled. Please contact support.';
  if (status === 429) return 'Too many attempts. Please wait a moment and try again.';

  const msg = serverMessage?.toLowerCase() || '';
  if (msg.includes('password') && (msg.includes('incorrect') || msg.includes('wrong') || msg.includes('invalid'))) {
    return 'Incorrect password. Please try again.';
  }
  if (msg.includes('not found') || msg.includes('no user') || msg.includes('does not exist')) {
    return 'No account found with this email address.';
  }
  if (msg.includes('invalid credentials') || msg.includes('invalid credential') || msg.includes('credentials')) {
    return 'Invalid email or password. Please check and try again.';
  }
  if (msg.includes('inactive') || msg.includes('disabled') || msg.includes('banned')) {
    return 'Your account has been disabled. Please contact support.';
  }
  if (msg.includes('network') || msg.includes('timeout')) {
    return 'Network error. Please check your internet connection.';
  }

  return serverMessage || 'Login failed. Please try again.';
};

export default function VendorSignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSignIn = async (values: any) => {
    try {
      const res = await axios.post('/api/v1/auth/vendor-login', {
        identifier: values.email,
        password: values.password,
      });

      const { accessToken, user } = res.data.data;

      const result = await signIn('credentials', {
        redirect: false,
        userId: user.id,
        role: user.role,
        accessToken,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        address: user.address,
        vendorId: user.vendorId,
      });

      if (result?.error) {
        toast.error('Authentication failed. Please try again.');
        return;
      }

      toast.success('Signed in successfully! Redirecting to dashboard...');
      router.push('/dashboard');

    } catch (err: any) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message || '';
      toast.error(getFriendlyError(serverMessage, status), { duration: 4000 });
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column - Image (Hidden on mobile, visible on md and larger) */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 relative items-center justify-center bg-emerald-900 overflow-hidden">
        {/* Replace the 'src' below with your actual login image URL or local asset import */}
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Vendor Portal Login"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        {/* Dark overlay for better text contrast, if needed */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-emerald-800/40"></div>

        <div className="relative z-10 p-10 lg:p-14 text-white max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Grow Your Business With Guptodhan.
          </h1>
          <p className="text-lg lg:text-xl text-emerald-50">
            Access your vendor dashboard to manage inventory, track orders, and connect with your customers seamlessly.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 lg:w-7/12 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-[#e0f2fe] via-white/80 to-[#ecfdf5]">
        <div className="w-full max-w-md lg:max-w-lg">

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex justify-center mb-5 sm:mb-6">
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800">
              Welcome Back, Vendor
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base md:text-lg">
              Sign in to manage your store and track orders
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-2xl overflow-hidden p-0">
            <div className="p-6 md:p-8 lg:p-10">
              <form onSubmit={handleSubmit(onSignIn)} className="space-y-6 sm:space-y-8">

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium text-sm sm:text-base">
                    Business Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="vendor@yourstore.com"
                    className="h-12 sm:h-14 text-base rounded-xl border-slate-200 bg-white shadow-inner focus:ring-4 focus:ring-emerald-300/50"
                    {...register("email", {
                      required: "Email is required.",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address.",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      ⚠️ {errors.email.message as string}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium text-sm sm:text-base">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-12 sm:h-14 text-base rounded-xl border-slate-200 bg-white shadow-inner pr-12 sm:pr-14 focus:ring-4 focus:ring-emerald-300/50"
                      {...register("password", {
                        required: "Password is required.",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters.",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      ⚠️ {errors.password.message as string}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link
                    href="/vendor/forgot-password"
                    className="text-emerald-600 font-medium hover:underline text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    'Signing in...'
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
                      Sign In to Dashboard
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Card>

          {/* Footer */}
          <div className="mt-8 sm:mt-10 text-center space-y-3 text-sm sm:text-base">
            <p className="text-slate-700">
              New to Guptodhan?{" "}
              <Link href="/vendor-singup" className="text-emerald-600 font-bold hover:underline">
                Create Vendor Account
              </Link>
            </p>
            <p className="text-slate-600 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to{" "}
              <Link href={SITE_CONFIG.mainUrl} className="text-emerald-600 font-medium hover:underline ml-1">
                Homepage
              </Link>
            </p>
          </div>

          {/* Support */}
          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-600">
            Need help?{" "}
            <a
              href="https://wa.me/8801816500600?text=Hello!%20I%20need%20assistance%20with%20vendor%20login..."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Contact Vendor Support
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}