'use client';

import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';

// UI Components (Shadcn)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

// Icons & Helpers
import { Loader2, Clock, ArrowLeft, Briefcase, MapPin, DollarSign, Calendar, Image as ImageIcon } from 'lucide-react';
import FiveUploadImageBtn from '@/components/ReusableComponents/FiveUploadImageBtn';
import { division_wise_locations } from '@/data/division_wise_locations';
import Link from 'next/link';

// Types (Ager motoi)
type Division = keyof typeof division_wise_locations;
type City = keyof (typeof division_wise_locations)[Division];
type Area = string;

type FormData = {
    service_title: string;
    service_category: string;
    service_description?: string;
    pricing_type?: 'fixed' | 'hourly';
    base_price?: number;
    minimum_charge?: number;
    available_time_slots: string[];
    working_days: string[];
    experience_years?: number;
    service_status?: string;
};

const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Motion Variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function ClientServicePostForm({ categories }: { categories: any[] }) {
    const { data: session } = useSession();
    const router = useRouter();

    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const [selectedDivision, setSelectedDivision] = useState<Division | ''>('');
    const [selectedCity, setSelectedCity] = useState<City | ''>('');
    const [selectedArea, setSelectedArea] = useState<Area | ''>('');

    const { register, handleSubmit, setValue, watch, control, reset } = useForm<FormData>({
        defaultValues: { pricing_type: 'fixed', available_time_slots: [], working_days: [] },
    });

    const selectedTimeSlots = watch('available_time_slots');
    const selectedWorkingDays = watch('working_days');

    // Location Logic
    const divisions = Object.keys(division_wise_locations) as Division[];
    const cities = useMemo(() => selectedDivision ? Object.keys(division_wise_locations[selectedDivision]) as City[] : [], [selectedDivision]);
    const areas = useMemo(() => selectedDivision && selectedCity ? (division_wise_locations[selectedDivision] as any)[selectedCity] as Area[] : [], [selectedDivision, selectedCity]);

    useEffect(() => { setSelectedCity(''); setSelectedArea(''); }, [selectedDivision]);
    useEffect(() => { setSelectedArea(''); }, [selectedCity]);

    const handleImageChange = (index: number) => (file: File | null) => {
        setImages(prev => {
            const next = [...prev];
            if (file) next[index] = file; else next.splice(index, 1);
            return next.filter(Boolean);
        });
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!(session as any)?.accessToken) return toast.error("Please login first");
        setLoading(true);
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) value.forEach(v => formData.append(key, v));
            else formData.append(key, String(value));
        });
        formData.append('service_area.city', selectedCity);
        formData.append('service_area.district', selectedCity);
        formData.append('service_area.thana', selectedArea);
        images.forEach(file => formData.append('service_images', file));

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/service-section/provide-service`, formData, {
                headers: { 'Authorization': `Bearer ${(session as any)?.accessToken}`, 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) setShowSuccessDialog(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to post service");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* --- TOP BAR --- */}
            <div className="sticky top-0 z-30 bg-white border-b shadow-sm mb-8">
                <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={'/'} className='cursor-pointer'>
                            <Image src="/img/logo.png" alt="Guptodhan" width={100} height={100} className="rounded-xl shadow-sm" />
                        </Link>
                        <div className=''>
                            <h1 className="text-xl font-bold text-gray-800">Post a Service</h1>
                            <p className="text-xs text-gray-500 hidden md:block">Share your expertise with the world</p>
                        </div>
                    </div>
                    <Button variant="BlueBtn" onClick={() => router.push('/home/service')} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> <span className='hidden md:block'>Back to Services</span>
                    </Button>
                </div>
            </div>

            <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-6xl mx-auto px-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* <h1 className="text-xl font-bold">Post a New Service</h1> */}
                    {/* 1. Basic Info Section */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="bg-primary/5 px-6 py-4 border-b flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            <h2 className="font-semibold text-gray-700">Basic Information</h2>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-600">Service Title</Label>
                                    <Input {...register('service_title', { required: true })} placeholder="e.g. Professional Home Cleaning" className="focus:ring-2" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-600">Category</Label>
                                    <Controller name="service_category" control={control} render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                            <SelectContent>{categories.map(cat => <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    )} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-600">Description</Label>
                                <Textarea {...register('service_description')} rows={4} placeholder="Describe what you offer in detail..." />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Service Area Section */}
                    <Card className="border-none shadow-md">
                        <div className="bg-blue-50/50 px-6 py-4 border-b flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <h2 className="font-semibold text-gray-700">Service Location</h2>
                        </div>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-gray-500">District / Division</Label>
                                <Select value={selectedDivision} onValueChange={(v) => setSelectedDivision(v as Division)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>{divisions.map(div => <SelectItem key={div} value={div}>{div}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-gray-500">City</Label>
                                <Select value={selectedCity} onValueChange={(v) => setSelectedCity(v as City)} disabled={!selectedDivision}>
                                    <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                                    <SelectContent>{cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-gray-500">Area / Thana</Label>
                                <Select value={selectedArea} onValueChange={setSelectedArea} disabled={!selectedCity}>
                                    <SelectTrigger><SelectValue placeholder="Select Area" /></SelectTrigger>
                                    <SelectContent>{areas.map(area => <SelectItem key={area} value={area}>{area}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Pricing & Schedule */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-none shadow-md">
                            <div className="bg-green-50/50 px-6 py-4 border-b flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                <h2 className="font-semibold text-gray-700">Pricing</h2>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Pricing Type</Label>
                                    <Controller name="pricing_type" control={control} render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fixed">Fixed Rate</SelectItem>
                                                <SelectItem value="hourly">Hourly Rate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Base Price (৳)</Label>
                                        <Input type="number" {...register('base_price')} className="border-green-100" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Min. Charge (৳)</Label>
                                        <Input type="number" {...register('minimum_charge')} className="border-green-100" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <div className="bg-purple-50/50 px-6 py-4 border-b flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-purple-600" />
                                <h2 className="font-semibold text-gray-700">Availability</h2>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <Label className="mb-2 block">Working Days</Label>
                                <div className="flex flex-wrap gap-2">
                                    {daysOfWeek.map(day => (
                                        <div key={day} onClick={() => {
                                            const current = selectedWorkingDays.includes(day);
                                            setValue('working_days', current ? selectedWorkingDays.filter(d => d !== day) : [...selectedWorkingDays, day]);
                                        }} className={`px-3 py-1.5 rounded-full text-xs cursor-pointer border transition-all ${selectedWorkingDays.includes(day) ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-gray-500 hover:border-purple-300'}`}>
                                            {day.slice(0, 3)}
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2">
                                    <Label className="mb-3 block">Time Slots</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {timeSlots.map(slot => (
                                            <div key={slot} className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${selectedTimeSlots.includes(slot) ? 'bg-purple-50 border-purple-200' : 'hover:bg-gray-50'}`}>
                                                <Checkbox checked={selectedTimeSlots.includes(slot)} onCheckedChange={(checked) => setValue('available_time_slots', checked ? [...selectedTimeSlots, slot] : selectedTimeSlots.filter(s => s !== slot))} />
                                                <span className="text-sm text-gray-600">{slot}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 4. Images Section */}
                    <Card className="border-none shadow-md">
                        <div className="bg-amber-50/50 px-6 py-4 border-b flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-amber-600" />
                            <h2 className="font-semibold text-gray-700">Service Portfolio</h2>
                        </div>
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500 mb-6">Upload up to 5 high-quality images of your work. This helps customers trust your service.</p>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FiveUploadImageBtn key={i} value={images[i] || null} onChange={handleImageChange(i)} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center pt-6">
                        <Button variant={'BlueBtn'} type="submit" size="lg" disabled={loading} className="w-full md:w-80 h-14 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
                            {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Publishing...</> : "Publish Your Service"}
                        </Button>
                    </div>
                </form>
            </motion.div>

            {/* Success Dialog (Already fixed with English text in previous step) */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md text-center py-10 rounded-3xl">
                    <DialogHeader className="flex flex-col items-center justify-center">
                        <div className="bg-amber-100 p-4 rounded-full mb-4">
                            <Clock className="h-12 w-12 text-amber-600 animate-pulse" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-gray-800">Request Pending!</DialogTitle>
                        <DialogDescription className="text-base pt-2 text-gray-600 leading-relaxed">
                            Your service request has been successfully submitted and is currently under review.
                            <br />
                            <span className="font-semibold text-amber-700 mt-2 block">
                                Please wait for administrative approval.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center flex-col sm:flex-row gap-4 mt-8">
                        <Button variant="outline" className="rounded-xl px-8" onClick={() => { reset(); setImages([]); setShowSuccessDialog(false); }}>Stay Here</Button>
                        <Button className="rounded-xl px-8" onClick={() => router.push('/home/service')}>Go to Services</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}