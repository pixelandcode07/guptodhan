'use client';

import React from 'react'
import { SMSFormValues } from '../page';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import SMSForms from './SMSForms';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export interface Gateway {
    name: string;
    logo: string;
    fields: string[];
    // Add others
}

export interface SMSCardProps {
    gateway: Gateway;
}

export default function SMSCard({ gateway }: SMSCardProps) {
    const { register, handleSubmit, control } = useForm<SMSFormValues>();

    const onSubmit = (data: SMSFormValues) => {
        console.log(gateway.name, data);
    };




    return (
        <Card className="rounded-2xl shadow-md">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg  font-semibold flex items-center gap-2">
                    {gateway.name}
                </CardTitle>
                <Switch />
            </CardHeader>
            <div className='flex justify-center items-center min-h-30'>
                <Image src={gateway.logo} alt={gateway.name} width={200} height={200} className="object-contain" />
            </div>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <SMSForms gateway={gateway} register={register} control={control} />

                    <Button type="submit" variant={'BlueBtn'} className="w-full">
                        Update Info
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
