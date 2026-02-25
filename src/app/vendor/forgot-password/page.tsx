"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Lock, CheckCircle, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

type Step = "email" | "otp" | "reset";

export default function VendorForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ পাসওয়ার্ড দেখার স্টেট

  const [resetToken, setResetToken] = useState<string>("");

  // ✅ সাধারণ ইউজারের জন্য সুন্দর এরর হ্যান্ডলিং ফাংশন
  const handleError = (err: any) => {
    console.error("Error details:", err);
    // যদি এরর মেসেজটা একটা অ্যারে হয় (Zod এরর), তবে প্রথম মেসেজটা দেখাবে
    if (Array.isArray(err.response?.data)) {
      return toast.error(err.response.data[0]?.message || "Invalid input data");
    }
    // অন্য সব ক্ষেত্রে নরমাল মেসেজ
    toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
  };

  // Step 1: Send OTP
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your registered email address.");

    setIsLoading(true);
    try {
      await axios.post("/api/v1/auth/vendor-forgot-password/send-otp", { email });
      toast.success("A 6-digit OTP has been sent to your email!");
      setStep("otp");
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error("Please enter the 6-digit valid code.");

    setIsLoading(true);
    try {
      const res = await axios.post("/api/v1/auth/vendor-forgot-password/verify-otp", {
        email,
        otp,
      });
      const tokenFromBackend = res.data.data.resetToken;
      setResetToken(tokenFromBackend);

      toast.success("OTP verified! You can now set a new password.");
      setStep("reset");
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters long.");
    
    if (!resetToken) {
      toast.error("Session expired. Please start again from the email step.");
      setStep("email");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/v1/auth/vendor-forgot-password/reset", {
        token: resetToken,
        newPassword,
      });

      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/vendor-singin";
      }, 2000);
    } catch (err: any) {
      handleError(err);
      if (err.response?.data?.message?.toLowerCase().includes("expired")) {
        setStep("email");
        setResetToken("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-b from-[#e0f2fe] via-white/60 to-[#ecfdf5] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="rounded-3xl p-1 bg-gradient-to-r from-emerald-200 via-white/40 to-sky-200 shadow-2xl">
          <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/30">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white text-4xl font-extrabold shadow-xl">
                G
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {step === "email" && "Recover Account"}
                {step === "otp" && "Verification Code"}
                {step === "reset" && "Set New Password"}
              </h2>
              <p className="text-slate-600 mt-2 text-sm">
                {step === "email" && "Enter your email to receive a recovery code"}
                {step === "otp" && "We've sent a 6-digit code to your email"}
                {step === "reset" && "Ensure your new password is secure"}
              </p>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm border border-white/40 shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">

                {/* Step 1: Email Form */}
                {step === "email" && (
                  <form onSubmit={sendOtp} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium flex items-center gap-2">
                        <Mail size={16} /> Business Email
                      </Label>
                      <Input
                        type="email"
                        placeholder="vendor@yourstore.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl border-white/40 bg-white/80"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:opacity-90 text-white transition-all"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
                    </Button>
                  </form>
                )}

                {/* Step 2: OTP Form */}
                {step === "otp" && (
                  <form onSubmit={verifyOtp} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">OTP Code</Label>
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="• • • • • •"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="h-12 text-2xl tracking-[0.5em] text-center font-mono rounded-xl border-white/40 bg-white/80 shadow-inner"
                        required
                      />
                      <p className="text-xs text-slate-500 text-center mt-1">
                        Code sent to: <span className="text-emerald-600 font-medium">{email}</span>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("email")}
                        className="flex-1 h-11 rounded-xl"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="flex-[2] h-11 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-xl"
                      >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Step 3: New Password Form */}
                {step === "reset" && (
                  <form onSubmit={resetPassword} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium flex items-center gap-2">
                        <Lock size={16} /> New Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"} // ✅ পাসওয়ার্ড দেখার জন্য টাইপ চেঞ্জ
                          placeholder="Min. 8 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-12 rounded-xl border-white/40 bg-white/80 pr-12"
                          required
                        />
                        {/* ✅ Eye Button */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <CheckCircle size={18} /> Update Password
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center">
              <Link href="/vendor-singin" className="text-slate-500 hover:text-emerald-600 text-sm font-medium transition-colors flex items-center justify-center gap-1">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}