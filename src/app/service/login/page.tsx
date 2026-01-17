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
import { Eye, EyeOff, Briefcase, Star, Zap, Users } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

// Form validation schema
const loginSchema = z.object({
    email: z.string().min(1, 'Email or phone is required'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function ServiceLoginPage() {
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
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSignIn = async (values: LoginFormValues) => {
        setIsLoading(true);

        try {
            const res = await axios.post('/api/v1/service-providers/login', {
                identifier: values.email.trim(),
                password: values.password,
            });

            const { accessToken, user } = res.data.data;
            const result = await signIn('credentials', {
                redirect: false,
                userId: user.id || user._id,
                role: user.role,
                accessToken: accessToken,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                profilePicture: user.profilePicture,
                address: user.address,
                serviceProviderInfo: user.serviceProviderInfo || null,
            });

            if (result?.error) {
                toast.error('Authentication failed', {
                    ...toastStyle,
                    description: 'Please check your credentials and try again.',
                });
                return;
            }

            toast.success('Signed in successfully!', {
                ...toastStyle,
                description: 'Welcome back, Service Provider!',
            });
            router.push('/home/service');
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                'Failed to sign in. Please try again later.';

            toast.error('Login Failed', {
                ...toastStyle,
                description: message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="w-full grid lg:grid-cols-2 gap-12 items-center shadow-2xl overflow-hidden bg-white">

                {/* Left Side - Animated Illustration */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="mt-10 text-center z-10"
                    >
                        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                        {/* <p className="text-xl text-blue-100">
                            Log in to manage your services and connect with clients
                        </p> */}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative z-10"
                    >
                        <Image
                            src="/img/service-login-image.jpg"
                            alt="Service Provider Illustration"
                            width={600}
                            height={600}
                            className="rounded-2xl shadow-2xl"
                            priority
                        />
                    </motion.div>
                </div>
                {/* Right Side - Login Form */}
                <div className="p-8 lg:p-16 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <Card className="border-0 shadow-none">
                            <CardHeader className="text-center lg:text-left">
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Service Provider Login
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Enter your credentials to access your account
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="mt-6">
                                <form onSubmit={handleSubmit(onSignIn)} className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Label htmlFor="email">Email or Phone Number</Label>
                                        <Input
                                            id="email"
                                            type="text"
                                            placeholder="you@example.com or +1234567890"
                                            {...register('email')}
                                            disabled={isLoading || isSubmitting}
                                            className="mt-1"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                        )}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative mt-1">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                {...register('password')}
                                                disabled={isLoading || isSubmitting}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
                                                disabled={isLoading || isSubmitting}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                        )}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Button
                                            type="submit"
                                            disabled={isLoading || isSubmitting}
                                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition hover:scale-105 disabled:opacity-70"
                                        >
                                            {(isLoading || isSubmitting) ? 'Logging in...' : 'Login'}
                                        </Button>
                                    </motion.div>
                                </form>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="mt-8 text-center text-sm text-gray-600 space-y-3"
                                >
                                    <p>
                                        Don't have an account?{' '}
                                        <a
                                            href="/service/register"
                                            className="font-medium text-blue-600 hover:underline hover:text-purple-600 transition"
                                        >
                                            Register as Provider
                                        </a>
                                    </p>
                                    <p>
                                        <a href="#" className="text-gray-500 hover:text-gray-700 hover:underline">
                                            Forgot password?
                                        </a>
                                    </p>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}