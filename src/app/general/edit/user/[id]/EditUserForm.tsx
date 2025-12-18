'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BadgeCheck, ShieldAlert, User, Mail, Phone, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from '@/components/ui/form';

// ✅ ১. Zod Validation Schema
const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Invalid email address.'),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(['user', 'vendor', 'service-provider', 'admin']),
    isActive: z.boolean().default(true),
    isVerified: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

// ✅ ২. Props Type Definition
type UserData = {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    phoneNumber?: string;
    address: string;
    role: 'user' | 'vendor' | 'service-provider' | 'admin';
    isVerified: boolean;
    isActive: boolean;
};

export default function EditUserForm({ initialData }: { initialData: UserData }) {
    const router = useRouter();

    // ✅ ৩. React Hook Form Setup
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData.name || '',
            email: initialData.email || '',
            phoneNumber: initialData.phoneNumber || '',
            address: initialData.address || '',
            role: initialData.role,
            isActive: initialData.isActive,
            isVerified: initialData.isVerified,
        },
    });

    // ✅ ৪. Form Submit Handler (PATCH Request)
    async function onSubmit(values: FormValues) {
        try {
            const res = await fetch(`/api/v1/users/${initialData._id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                toast.success('User updated successfully!');
                router.push('/general/view/system/users'); // আপনার ইউজার লিস্ট পেজের পাথ
                router.refresh();
            } else {
                toast.error(result.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Something went wrong. Please try again.');
        }
    }

    return (
        <div className="space-y-10">
            {/* --- Profile Overview Header --- */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="relative group">
                    {initialData.profilePicture ? (
                        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <Image
                                src={initialData.profilePicture}
                                alt={initialData.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-28 h-28 md:w-32 md:h-32 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                            <User className="w-12 h-12 text-blue-500" />
                        </div>
                    )}
                    {initialData.isVerified && (
                        <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5">
                            <BadgeCheck className="w-7 h-7 text-blue-500 fill-blue-500" />
                        </div>
                    )}
                </div>

                <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                        {initialData.name}
                        {!initialData.isActive && <ShieldAlert className="w-5 h-5 text-red-500" title="Account Inactive" />}
                    </h2>
                    <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                        <Mail className="w-4 h-4" /> {initialData.email}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            initialData.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            initialData.role === 'vendor' ? 'bg-green-100 text-green-700' :
                            initialData.role === 'service-provider' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                            {initialData.role}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${initialData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {initialData.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                    </div>
                </div>
            </div>

            {/* --- Main Edit Form --- */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-gray-700">Display Name</FormLabel>
                                    <FormControl>
                                        <Input className="bg-white" placeholder="Enter full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-gray-700">Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" className="bg-white" placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone Field */}
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-gray-700">Phone Number</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input className="pl-10 bg-white" placeholder="+880" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Role Selection */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-gray-700">System Access Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Assign a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="user">Standard User</SelectItem>
                                            <SelectItem value="vendor">Store Vendor</SelectItem>
                                            <SelectItem value="service-provider">Service Provider</SelectItem>
                                            <SelectItem value="admin">System Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address Field */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="font-bold text-gray-700">Full Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Textarea
                                                placeholder="Enter full physical address"
                                                className="pl-10 resize-none bg-white min-h-[100px]"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* --- Status & Verification --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-white shadow-sm">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value} 
                                            onCheckedChange={field.onChange} 
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-bold">Active Status</FormLabel>
                                        <FormDescription>
                                            If disabled, the user cannot log in to the system.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isVerified"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-white shadow-sm">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value} 
                                            onCheckedChange={field.onChange} 
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-bold text-blue-600 flex items-center gap-1">
                                            Verified Badge <BadgeCheck className="w-4 h-4 fill-current" />
                                        </FormLabel>
                                        <FormDescription>
                                            Show verified checkmark next to user name.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* --- Action Buttons --- */}
                    <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6 border-t">
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="md:w-32"
                            onClick={() => router.back()}
                            disabled={form.formState.isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="md:w-44 bg-blue-600 hover:bg-blue-700"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                </span>
                            ) : 'Update User Data'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

// লোডার আইকন কম্পোনেন্ট (যদি না থাকে)
function Loader2({ className }: { className?: string }) {
    return (
        <svg
            className={`animate-spin ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}