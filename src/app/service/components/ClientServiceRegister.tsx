'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Star, Users, Zap, Eye, EyeOff } from 'lucide-react'; // Added Eye icons
import { IServiceCategory } from '@/types/ServiceCategoryType';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(5, 'Address is required'),
  serviceCategory: z.string().nonempty('Please select a category'),
  cvUrl: z.instanceof(File).nullable().optional(),
  bio: z.string().min(20, 'Bio should be at least 20 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientServiceRegisterProps {
  categories: IServiceCategory[];
}

export default function ClientServiceRegister({ categories }: ClientServiceRegisterProps) {
  const router = useRouter();

  const [previewCvUrl, setPreviewCvUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { cvUrl: null },
  });

  const handleImageChange = (name: string, file: File | null) => {
    setValue('cvUrl', file);
    if (file) {
      setPreviewCvUrl(URL.createObjectURL(file));
    } else {
      setPreviewCvUrl(undefined);
    }
  };

  const onInitialSubmit = async (data: FormValues) => {
    setFormData(data);
    setIsSendingOtp(true);
    setShowOtpModal(true);

    try {
      await axios.post('/api/v1/auth/service-providers/register/send-otp', {
        email: data.email,
      });

      toast.success('OTP Sent!', {
        description: 'Check your email for the verification code.',
      });
    } catch (error: any) {
      toast.error('Failed to send OTP', {
        description: error.response?.data?.message || 'Please try again.',
      });
      setShowOtpModal(false);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!formData || otp.length !== 6) {
      toast.error('Invalid OTP', { description: 'Please enter a 6-digit code.' });
      return;
    }

    setIsVerifyingOtp(true);
    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('address', formData.address);
      data.append('serviceCategory', formData.serviceCategory);
      data.append('bio', formData.bio);
      data.append('otp', otp);

      if (formData.cvUrl) {
        data.append('cvUrl', formData.cvUrl);
      }

      await axios.post('/api/v1/auth/service-providers/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Registration Successful!', {
        description: 'Welcome! You can now log in as a service provider.',
      });

      // Cleanup & Redirect
      reset();
      setPreviewCvUrl(undefined);
      setOtp('');
      setShowOtpModal(false);
      setFormData(null);

      router.push('/service/login');
    } catch (error: any) {
      toast.error('Registration Failed', {
        description: error.response?.data?.message || 'Invalid OTP or server error.',
      });
    } finally {
      setIsVerifyingOtp(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full  grid lg:grid-cols-2 gap-12 items-stretch shadow-2xl overflow-hidden bg-white h-full">

        {/* Left Side - Inspirational (Now full height) */}
        <div className="hidden lg:flex flex-col justify-start p-12 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="space-y-8">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-none">Join Our Expert Community</Badge>
              <h1 className="text-5xl font-bold leading-tight">
                Become a Trusted Service Provider
              </h1>
              <p className="text-xl mt-4 text-blue-100">
                Connect with thousands of customers looking for your skills.
              </p>
            </div>

            <div className="space-y-6 mt-10">
              {[
                { icon: Zap, title: 'Get Hired Faster', desc: 'Receive job requests directly from clients' },
                { icon: Star, title: 'Build Your Reputation', desc: 'Earn ratings and grow your profile' },
                { icon: Users, title: 'Join 10,000+ Providers', desc: 'Be part of a thriving marketplace' },
                { icon: Briefcase, title: 'Flexible Work', desc: 'Set your own rates and schedule' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-blue-100">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center lg:text-left">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Provider Account
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Start offering your services today in just a few minutes
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-6">
              <form onSubmit={handleSubmit(onInitialSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...register('name')} placeholder="John Doe" className="mt-1" />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} placeholder="john@example.com" className="mt-1" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Password Field with Eye Toggle */}
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" {...register('phoneNumber')} placeholder="+1234567890" className="mt-1" />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                  </div>
                </div>

                {/* Rest of the form fields remain unchanged */}
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...register('address')} placeholder="123 Main St, City, Country" className="mt-1" />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>

                <div>
                  <Label htmlFor="serviceCategory">Service Category</Label>
                  <Select onValueChange={(value) => setValue('serviceCategory', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose your expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.serviceCategory && <p className="text-red-500 text-sm mt-1">{errors.serviceCategory.message}</p>}
                </div>

                <div>
                  <Label>CV / Portfolio Image (Optional)</Label>
                  <UploadImage
                    name="cvUrl"
                    label="Showcase your work or credentials"
                    preview={previewCvUrl}
                    onChange={handleImageChange}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    {...register('bio')}
                    rows={4}
                    placeholder="Share your experience, skills, and what makes you stand out..."
                    className="mt-1 resize-none"
                  />
                  {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || isSendingOtp}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition hover:scale-105"
                >
                  {isSendingOtp ? 'Sending OTP...' : isSubmitting ? 'Processing...' : 'Start Earning Today'}
                </Button>

                {/* OTP Modal */}
                {showOtpModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                      <CardHeader>
                        <CardTitle>Verify Your Email</CardTitle>
                        <CardDescription>
                          We've sent a 6-digit OTP to {formData?.email}. Enter it below to continue.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="otp">OTP Code</Label>
                          <Input
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            maxLength={6}
                            className="text-center text-2xl tracking-widest mt-1"
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowOtpModal(false);
                              setOtp('');
                            }}
                            className="flex-1"
                            disabled={isVerifyingOtp}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleOtpVerify}
                            disabled={isVerifyingOtp || otp.length !== 6}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {isVerifyingOtp ? 'Verifying...' : 'Verify & Register'}
                          </Button>
                        </div>

                        <p className="text-center text-sm text-gray-600">
                          Didn't receive the code?{' '}
                          <button
                            onClick={() => onInitialSubmit(getValues())}
                            disabled={isSendingOtp}
                            className="text-blue-600 font-medium hover:underline"
                          >
                            {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                          </button>
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </form>

              <p className="text-center text-sm text-gray-600 mt-8">
                Already have an account?{' '}
                <a href="/service/login" className="text-blue-600 font-medium hover:underline">
                  Log in here
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}