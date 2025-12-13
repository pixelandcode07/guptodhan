import React from 'react'
import { PaymentFormValues } from '../page';
import { Control, Controller, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Gateway } from './PaymentCard';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Select from "react-select";
import { modeOptions, statusOptions } from '@/data/data';


export default function PaymentForms({ gateway, register, control, setValue }: {
    gateway: Gateway;
    register: UseFormRegister<PaymentFormValues>;
    control: Control<PaymentFormValues>;
    setValue: UseFormSetValue<PaymentFormValues>;
}) {
    return (
        <div>
            {gateway.fields.includes("storeId") && (
                <div>
                    <Label className='my-2'>Store ID</Label>
                    <Input {...register("storeId")} />
                </div>
            )}
            {gateway.fields.includes("storePassword") && (
                <div>
                    <Label className='my-2'>Store Password</Label>
                    <Input type="password" {...register("storePassword")} />
                </div>
            )}
            {gateway.fields.includes("apiKey") && (
                <div>
                    <Label className='my-2'>API Key</Label>
                    <Input {...register("apiKey")} />
                </div>
            )}
            {gateway.fields.includes("secretKey") && (
                <div>
                    <Label className='my-2'>Secret Key</Label>
                    <Input {...register("secretKey")} />
                </div>
            )}
            {gateway.fields.includes("username") && (
                <div>
                    <Label className='my-2'>Username</Label>
                    <Input {...register("username")} />
                </div>
            )}
            {gateway.fields.includes("password") && (
                <div>
                    <Label className='my-2'>Password</Label>
                    <Input type="password" {...register("password")} />
                </div>
            )}

            {/* Payment Mode */}
            <div>
                <Label className='my-2'>Payment Mode</Label>
                <Select
                    closeMenuOnSelect={true}
                    options={modeOptions}
                    onChange={(selectedOptions) => setValue('paymentMode', selectedOptions)}
                />
            </div>

            {/* Status */}
            <div>
                <Label className='my-2'>Status</Label>
                <Select
                    closeMenuOnSelect={true}
                    options={statusOptions}
                    onChange={(selectedOptions) => setValue('status', selectedOptions)}
                />
            </div>


        </div>
    )
}
