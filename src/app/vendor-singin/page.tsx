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
      const payload = {
        identifier: values.email,
        password: values.password,
      };

      const res = await axios.post('/api/v1/auth/vendor-login', payload);
      const { accessToken, user } = res.data.data;

      // ✅ সব user data NextAuth এ পাঠাচ্ছি
      const result = await signIn('credentials', {
        redirect: false,
        userId: user.id,
        role: user.role,
        accessToken: accessToken,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        address: user.address,
        vendorId: user.vendorId,
      });

      if (result?.error) {
        console.error('NextAuth signIn failed:', result.error);
        toast.error('Authentication failed. Please try again.');
        return;
      }

      toast.success('Signed in successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || 'Failed to sign in';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-b from-[#e0f2fe] via-white/60 to-[#ecfdf5] flex items-center justify-center">
      <div className="max-w-[80vw] w-full mx-auto">
        <div className="rounded-3xl p-1 bg-gradient-to-r from-emerald-200 via-white/40 to-sky-200 shadow-2xl">
          <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/30">

            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white text-4xl font-extrabold shadow-xl">
                  G
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                Welcome Back, Vendor
              </h2>
              <p className="text-slate-600 mt-2 text-lg">
                Sign in to manage your store and track orders
              </p>
            </div>

            {/* Main Card */}
            <Card className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm border border-white/40 shadow-xl rounded-2xl overflow-hidden">
              <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit(onSignIn)} className="space-y-8">

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium text-base">
                      Business Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="vendor@yourstore.com"
                      className="h-14 text-lg rounded-xl border-white/40 bg-white/80 shadow-inner focus:ring-4 focus:ring-emerald-300/50"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.email.message as string}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium text-base">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-14 text-lg rounded-xl border-white/40 bg-white/80 shadow-inner pr-14 focus:ring-4 focus:ring-emerald-300/50"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.password.message as string}
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

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>Signing in...</>
                    ) : (
                      <>
                        <LogIn size={22} />
                        Sign In to Dashboard
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </Card>

            {/* Footer Links */}
            <div className="mt-10 text-center space-y-3">
              <p className="text-slate-700">
                New to Guptodhan?{" "}
                <Link
                  href="/vendor-singup"
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Create Vendor Account
                </Link>
              </p>
              <p className="text-sm text-slate-600">
                <ArrowLeft size={14} className="inline mr-1" />
                Back to{" "}
                <Link href="/" className="text-emerald-600 font-medium hover:underline">
                  Homepage
                </Link>
              </p>
            </div>

            {/* Support */}
            <div className="mt-8 text-center text-sm text-slate-600">
              Need help?{" "}
              <a
                href="https://wa.me/8801816500600?text=Hello!%20Hope%20you're%20having%20a%20great%20day!%20I%20need%20assistance%20with...%20Thank%20you!"
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
    </div>
  );
}