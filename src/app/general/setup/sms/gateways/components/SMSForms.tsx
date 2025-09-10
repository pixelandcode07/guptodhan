import React from 'react'
import { SMSFormValues } from '../page';
import { Control, UseFormRegister } from 'react-hook-form';
import { Gateway } from './SMSCard';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


export default function SMSForms({ gateway, register }: {
    gateway: Gateway;
    register: UseFormRegister<SMSFormValues>;
    control: Control<SMSFormValues>;
}) {
    return (
        <div>
            {gateway.fields.includes("API Endpoint") && (
                <div>
                    <Label className='my-2'>API Endpoint</Label>
                    <Input {...register("api_endpoint")} />
                </div>
            )}
            {gateway.fields.includes("API Key") && (
                <div>
                    <Label className='my-2'>API Key</Label>
                    <Input type="password" {...register("api_key")} />
                </div>
            )}
            {gateway.fields.includes("Secret Key") && (
                <div>
                    <Label className='my-2'>Secret Key</Label>
                    <Input {...register("secret_key")} />
                </div>
            )}
            {gateway.fields.includes("Sender ID") && (
                <div>
                    <Label className='my-2'>Sender ID</Label>
                    <Input {...register("sender_Id")} />
                </div>
            )}
        </div>
    )
}
