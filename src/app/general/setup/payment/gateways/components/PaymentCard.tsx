'use client';

import React from 'react'
import { PaymentFormValues } from '../page';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import PaymentForms from './PaymentForms';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export interface Gateway {
    name: string;
    logo: string;
    fields: string[];
    // Add other properties as needed
}

export interface PaymentCardProps {
    gateway: Gateway;
}

export default function PaymentCard({ gateway }: PaymentCardProps) {
    const { register, handleSubmit, control, setValue } = useForm<PaymentFormValues>({
        defaultValues: {
            storeId: "",
            storePassword: "",
            apiKey: "",
            secretKey: "",
            username: "",
            password: "",
            // paymentMode: gateway.value,
            // status: "Inactive",
        },
    });

    const onSubmit = (data: PaymentFormValues) => {
        console.log(gateway.name, data);
    };




    return (
        <Card className="rounded-2xl shadow-md relative">
            <CardTitle className='bg-amber-400 py-1 text-center absolute -top-0 w-[226px] rounded-t-md'>Premium Add-On</CardTitle>
            <CardHeader className="flex flex-row justify-between items-center mt-5">
                <CardTitle className="text-lg  font-semibold flex items-center gap-2">
                    {gateway.name}
                </CardTitle>
                <Switch />
            </CardHeader>
            <div className='flex justify-center items-center min-h-30'>
                <Image src={gateway.logo} alt={gateway.name} width={100} height={100} className="object-contain" />
            </div>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <PaymentForms gateway={gateway} register={register} control={control} setValue={setValue} />

                    <Button type="submit" variant={'BlueBtn'} className="w-full">
                        Update Info
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
