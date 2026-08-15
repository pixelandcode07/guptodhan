'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, KeyRound, Lock, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ServiceProviderForgotPassword() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form States
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resetToken, setResetToken] = useState('');

    // Step 1: Send OTP to Email
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your registered email");

        setIsLoading(true);
        try {
            const res = await axios.post('/api/v1/auth/service-providers/forgot-password/send-otp', { email });
            if (res.data.success) {
                toast.success("OTP sent to your email!");
                setStep(2);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send OTP. Please check your email.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length < 4) return toast.error("Please enter a valid OTP");

        setIsLoading(true);
        try {
            const res = await axios.post('/api/v1/auth/service-providers/forgot-password/verify-otp', { email, otp });
            if (res.data.success) {
                setResetToken(res.data.data.resetToken);
                toast.success("OTP Verified Successfully!");
                setStep(3);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid OTP or OTP expired");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8) return toast.error("Password must be at least 8 characters long");
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

        setIsLoading(true);
        try {
            const res = await axios.post('/api/v1/auth/service-providers/forgot-password/reset', { 
                token: resetToken, 
                newPassword 
            });
            if (res.data.success) {
                toast.success("Password reset successfully! You can now login.", {
                    icon: <CheckCircle2 className="text-green-500" />
                });
                router.push('/service/login');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <Card className="border-0 shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Reset Password
                        </CardTitle>
                        <CardDescription className="text-sm mt-2">
                            {step === 1 && "Enter your registered email to receive an OTP."}
                            {step === 2 && "Enter the OTP sent to your email."}
                            {step === 3 && "Create a new strong password for your account."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4">
                        {/* STEP 1: Email Form */}
                        {step === 1 && (
                            <form onSubmit={handleSendOtp} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="provider@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all"
                                    disabled={isLoading || !email}
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                                </Button>
                            </form>
                        )}

                        {/* STEP 2: OTP Form */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} className="space-y-5">
                                <div className="space-y-2 text-center">
                                    <Label htmlFor="otp">Verification Code</Label>
                                    <div className="relative max-w-xs mx-auto">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className="pl-10 text-center tracking-widest font-bold text-lg"
                                            maxLength={6}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Code sent to: <span className="font-semibold text-blue-600">{email}</span></p>
                                </div>
                                <div className="flex gap-3">
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        className="w-1/3 h-11"
                                        disabled={isLoading}
                                    >
                                        Back
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="w-2/3 h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                        disabled={isLoading || otp.length < 4}
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* STEP 3: New Password Form */}
                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            id="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min 8 characters"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="pl-10 pr-10"
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-transform hover:scale-[1.02]"
                                    disabled={isLoading || !newPassword || !confirmPassword}
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                                </Button>
                            </form>
                        )}

                        {/* Footer Link */}
                        <div className="mt-6 text-center">
                            <Link href="/service/login" className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors">
                                <ArrowLeft size={16} /> Back to login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}