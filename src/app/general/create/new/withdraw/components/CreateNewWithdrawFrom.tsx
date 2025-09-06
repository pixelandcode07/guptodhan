'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WithdrawInfo from './WithdrawInfo'



export type Inputs = {
    selectVendor: { label: string, value: string } | null
    payment_method: string
    bank_name: string
    branch_name: string
    routing_no: number
    account_holder_name: string
    account_no: string
    mobile_no: string
    current_balance: string
    withdraw_amount: number
    remarks: string
}

export default function CreateNewWithdrawFrom() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

    // const onSubmit:  = (data) => 

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5 '>
            {/* WithdrawInfo */}
            <WithdrawInfo setValue={setValue} register={register} errors={errors} watch={watch} />

            <div className='text-center'>
                <Button variant={'BlueBtn'} type="submit"><Save />Submit & Approve Withdraw</Button>
            </div>
        </form>
    )
}

