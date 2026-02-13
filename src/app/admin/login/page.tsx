'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ShieldCheck, BarChart3, Lock, Settings } from 'lucide-react';
import { toast } from 'sonner';

// Form validation schema
const adminLoginSchema = z.object({
    identifier: z.string().email('Please enter a valid admin email'),
    password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toastStyle = {
        style: {
            background: '#ffffff',
            color: '#000000',
            border: '1px solid #e2e8f0'
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AdminLoginFormValues>({
        resolver: zodResolver(adminLoginSchema),
    });

    const onAdminSignIn = async (values: AdminLoginFormValues) => {
        setIsLoading(true);

        try {
            const res = await axios.post('/api/v1/auth/admin-login', {
                identifier: values.identifier.trim(),
                password: values.password,
            });

            const { accessToken, user } = res.data.data;
            const result = await signIn('credentials', {
                redirect: false,
                userId: user.id || user._id,
                role: 'admin',
                accessToken: accessToken,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
            });

            if (result?.error) {
                toast.error('Admin Access Denied', {
                    ...toastStyle,
                    description: 'Invalid credentials or unauthorized access.',
                });
                return;
            }

            toast.success('Access Granted', {
                 ...toastStyle,
                description: 'Welcome to the Admin Control Center.',
            });

            // Admin Dashboard e redirect kora
            router.push('/general/home');

        } catch (err: any) {
            const message = err.response?.data?.message || 'Unauthorized access attempt.';
            toast.error('Login Failed', {  ...toastStyle, description: message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="w-full grid lg:grid-cols-2 gap-0 items-center min-h-screen bg-white shadow-2xl overflow-hidden">

                {/* Left Side - Admin Theme Illustration */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 text-white relative overflow-hidden h-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="z-10 text-center px-10"
                    >
                        <div className="mb-6 flex justify-center">
                            <div className="p-4 bg-crimson-600 rounded-2xl bg-red-600">
                                <ShieldCheck className="w-16 h-16 text-white" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-extrabold mb-4">System Administration</h2>
                        <p className="text-slate-400 text-lg max-w-md mx-auto">
                            Secure access to the platform's core management tools, analytics, and user oversight.
                        </p>
                    </motion.div>

                    {/* Background Decorative Elements */}
                    <div className="absolute top-10 left-10 opacity-10">
                        <BarChart3 size={200} />
                    </div>
                    <div className="absolute bottom-10 right-10 opacity-10">
                        <Settings size={180} />
                    </div>
                </div>

                {/* Right Side - Admin Login Form */}
                <div className="p-8 lg:p-24 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="border-0 shadow-none">
                            <CardHeader className="space-y-1">
                                <div className="flex items-center gap-2 mb-2 text-red-600 lg:hidden">
                                    <ShieldCheck className="w-6 h-6" />
                                    <span className="font-bold tracking-tight">ADMIN PANEL</span>
                                </div>
                                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                                    Administrator Login
                                </CardTitle>
                                <CardDescription>
                                    Enter your administrative credentials to continue
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="mt-8">
                                <form onSubmit={handleSubmit(onAdminSignIn)} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Admin Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@platform.com"
                                            {...register('identifier')}
                                            disabled={isLoading || isSubmitting}
                                            className="h-11 border-slate-200 focus:ring-red-500"
                                        />
                                        {errors.identifier && (
                                            <p className="text-red-500 text-xs font-medium">{errors.identifier.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Security Password</Label>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                {...register('password')}
                                                disabled={isLoading || isSubmitting}
                                                className="h-11 pr-10 border-slate-200 focus:ring-red-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading || isSubmitting}
                                        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all mt-4"
                                    >
                                        {isLoading ? 'Verifying...' : 'Access Dashboard'}
                                    </Button>
                                </form>

                                <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                                        <Lock className="w-3 h-3" />
                                        <span>End-to-end encrypted session</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}