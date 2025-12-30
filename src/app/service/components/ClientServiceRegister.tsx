'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Briefcase, Star, Users, Zap } from 'lucide-react';
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
  const [previewCvUrl, setPreviewCvUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
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

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append all text fields
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('address', data.address);
      formData.append('serviceCategory', data.serviceCategory);
      formData.append('bio', data.bio);

      // Append file if exists
      if (data.cvUrl) {
        formData.append('cvUrl', data.cvUrl);
      }

      const response = await fetch('/api/v1/auth/service-providers/register', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      toast.success('Registration successful!', {
        description: 'Welcome to the platform! You can now log in.',
      });

      // Optional: redirect after success
      // router.push('/service/login');
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 lg:py-20">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start shadow-2xl rounded-3xl overflow-hidden bg-white">

        {/* Left Side - Inspirational */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
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
        <div className="p-8 lg:p-12">
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...register('password')} className="mt-1" />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" {...register('phoneNumber')} placeholder="+1234567890" className="mt-1" />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                  </div>
                </div>

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
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition hover:scale-105"
                >
                  {isSubmitting ? 'Creating Account...' : 'Start Earning Today'}
                </Button>
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