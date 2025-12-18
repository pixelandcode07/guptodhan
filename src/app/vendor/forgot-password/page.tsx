"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Lock, CheckCircle, Loader2 } from "lucide-react";
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

  const [resetToken, setResetToken] = useState<string>("");

  // Step 1: Send OTP
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);
    try {
      await axios.post("/api/v1/auth/vendor-forgot-password/send-otp", { email });
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP → এখানে resetToken পাবো!
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error("Enter valid 6-digit OTP");

    setIsLoading(true);
    try {
      const res = await axios.post("/api/v1/auth/vendor-forgot-password/verify-otp", {
        email,
        otp,
      });
      const tokenFromBackend = res.data.data.resetToken;
      setResetToken(tokenFromBackend);

      toast.success("OTP verified successfully!");
      setStep("reset");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password → এখন JWT token পাঠাবো, OTP না!
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error("Password must be 6+ characters");
    if (!resetToken) {
      toast.error("Session expired. Please try again from start.");
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
      toast.error(err.response?.data?.message || "Failed to reset password");
      if (err.response?.data?.message.includes("expired")) {
        toast.info("Please request a new OTP");
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
              <h2 className="text-3xl font-extrabold text-slate-800">
                {step === "email" && "Forgot Password?"}
                {step === "otp" && "Verify OTP"}
                {step === "reset" && "Set New Password"}
              </h2>
              <p className="text-slate-600 mt-2">
                {step === "email" && "Enter your email to receive OTP"}
                {step === "otp" && "Check your email for 6-digit code"}
                {step === "reset" && "Create a strong new password"}
              </p>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm border border-white/40 shadow-xl">
              <div className="p-8">

                {/* Step 1: Email */}
                {step === "email" && (
                  <form onSubmit={sendOtp} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium flex items-center gap-2">
                        <Mail size={18} /> Business Email
                      </Label>
                      <Input
                        type="email"
                        placeholder="vendor@yourstore.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 text-lg rounded-xl border-white/40 bg-white/80 shadow-inner"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" /> Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </form>
                )}

                {/* Step 2: OTP */}
                {step === "otp" && (
                  <form onSubmit={verifyOtp} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Enter 6-digit OTP</Label>
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="h-14 text-2xl tracking-widest text-center font-mono rounded-xl border-white/40 bg-white/80 shadow-inner"
                        required
                      />
                      <p className="text-sm text-slate-600 text-center">
                        Sent to <span className="font-semibold">{email}</span>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setStep("email");
                          setOtp("");
                        }}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-sky-500 text-white"
                      >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Step 3: New Password */}
                {step === "reset" && (
                  <form onSubmit={resetPassword} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium flex items-center gap-2">
                        <Lock size={18} /> New Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-14 text-lg rounded-xl border-white/40 bg-white/80 shadow-inner"
                        required
                        minLength={6}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-lg flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <CheckCircle size={20} /> Reset Password
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-slate-600">
                <ArrowLeft size={14} className="inline mr-1" />
                Back to{" "}
                <Link href="/vendor-singin" className="text-emerald-600 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}