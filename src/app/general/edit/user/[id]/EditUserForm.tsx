// src/app/general/edit/user/[id]/EditUserForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from '@/components/ui/form';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Invalid email address.'),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(['user', 'vendor', 'service-provider', 'admin']),
    isActive: z.boolean(),
    isVerified: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

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

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData.name,
            email: initialData.email,
            phoneNumber: initialData.phoneNumber || '',
            address: initialData.address || '',
            role: initialData.role,
            isActive: initialData.isActive,
            isVerified: initialData.isVerified,
        },
    });

    async function onSubmit(values: FormValues) {
        try {
            const res = await fetch(`/api/users/${initialData._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (res.ok) {
                toast.success('User updated successfully!');
                router.push('/general/users');
                router.refresh();
            } else {
                const error = await res.json();
                toast.error(error.message || 'Failed to update user');
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        }
    }

    return (
        <>
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-10 border-b pb-8">
                <div className="relative">
                    {initialData.profilePicture ? (
                        <Image
                            src={initialData.profilePicture}
                            alt={initialData.name}
                            width={120}
                            height={120}
                            className="rounded-full object-cover border-4 border-gray-200"
                        />
                    ) : (
                        <div className="w-32 h-32 bg-gray-200 border-2 border-dashed rounded-full flex items-center justify-center">
                            <span className="text-4xl font-medium text-gray-500">
                                {initialData.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{initialData.name}</h2>
                    <p className="text-gray-600">{initialData.email}</p>
                    <span
                        className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${initialData.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : initialData.role === 'service-provider'
                                    ? 'bg-blue-100 text-blue-700'
                                    : initialData.role === 'vendor'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        {initialData.role.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone Number */}
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+8801XXXXXXXXX" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Role */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="vendor">Vendor</SelectItem>
                                            <SelectItem value="service-provider">Service Provider</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Full address (optional)"
                                            className="resize-none"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="flex gap-10">
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-medium">Account Active</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isVerified"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-medium">Email Verified</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}