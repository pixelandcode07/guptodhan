import { Label } from '@/components/ui/label'
import { Asterisk } from 'lucide-react'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import Select from 'react-select';
import { Inputs } from './CreateNewWithdrawFrom';
import { paymentOptions, vendorOptions } from '@/data/data';
import { Input } from '@/components/ui/input';
import NumericInput from 'react-numeric-input';
import { Textarea } from '@/components/ui/textarea';

export default function WithdrawInfo({ register, errors, setValue, watch }: {
    register: UseFormRegister<Inputs>
    errors: FieldErrors<Inputs>
    setValue: UseFormSetValue<Inputs>
    watch: UseFormWatch<Inputs>
}) {

    const selectedPaymentMethod = watch("payment_method");
    return (
        <div>
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Withdraw Information:</h1>
            <main className="space-y-6 mt-5 mb-10 md:mb-20">
                {/* Select Vendor */}
                <section className="flex flex-col">
                    <Label htmlFor="selectVendor" className="pb-2">
                        Select Vendor<Asterisk className="text-red-600 h-3 inline" /> (Business Name - Store Name - User Name)
                    </Label>
                    <Select
                        classNamePrefix="select"
                        isClearable
                        isSearchable
                        name="vendor"
                        options={vendorOptions}
                        onChange={(selectedOptions) => setValue("selectVendor", selectedOptions)}
                    />
                </section>
                {/* Payment Method */}
                <section className="flex flex-col">
                    <Label htmlFor="payment_method" className="pb-2">
                        Payment Method<Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    <Select
                        classNamePrefix="select"
                        isClearable
                        isSearchable
                        options={paymentOptions}
                        onChange={(selectedOption) => setValue("payment_method", selectedOption?.value || "")}
                    />
                </section>

                {/* Conditional Fields */}
                {selectedPaymentMethod === "Bank Transfer" ? (
                    <div className="space-y-6">
                        <section className="flex flex-col">
                            <Label htmlFor="bank_name" className="pb-2">Bank Name<Asterisk className="text-red-600 h-3 inline" /></Label>
                            <Input {...register("bank_name", { required: "Bank Name is required" })} placeholder="Enter Bank Name" />
                        </section>

                        <section className="flex flex-col">
                            <Label htmlFor="branch_name" className="pb-2">Branch Name<Asterisk className="text-red-600 h-3 inline" /></Label>
                            <Input {...register("branch_name", { required: "Branch Name is required" })} placeholder="Enter Branch Name" />
                        </section>

                        <section className="flex flex-col">
                            <Label htmlFor="routing_no" className="pb-2">Routing No<Asterisk className="text-red-600 h-3 inline" /></Label>
                            <Input {...register("routing_no", { required: "Routing No is required" })} placeholder="Enter Routing No" />
                        </section>

                        <section className="flex flex-col">
                            <Label htmlFor="account_holder_name" className="pb-2">Account Holder Name<Asterisk className="text-red-600 h-3 inline" /></Label>
                            <Input {...register("account_holder_name", { required: "Account Holder Name is required" })} placeholder="Enter Account Holder Name" />
                        </section>

                        <section className="flex flex-col">
                            <Label htmlFor="account_no" className="pb-2">Account No<Asterisk className="text-red-600 h-3 inline" /></Label>
                            <Input {...register("account_no", { required: "Account No is required" })} placeholder="Enter Account No" />
                        </section>
                    </div>
                ) : (
                    <section className="flex flex-col">
                        <Label htmlFor="mobile_account_no" className="pb-2">
                            Mobile Account No<Asterisk className="text-red-600 h-3 inline" />
                        </Label>
                        <Input
                            type="text"
                            placeholder="Mobile Account No"
                            {...register("mobile_no", { required: "Mobile Account No is required" })}
                            className="border border-gray-500"
                        />
                    </section>
                )}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-5'>
                    {/* Current Balance */}
                    <section className="flex flex-col">
                        <Label htmlFor="current_balance" className="pb-2">
                            Current Balance
                        </Label>
                        <Input
                            type="text"
                            placeholder="0"
                            {...register("current_balance")}
                            className="border border-gray-500"
                        />
                    </section>
                    <section className="flex flex-col">
                        <Label htmlFor="current_balance" className="pb-2">
                            Store Comission
                        </Label>
                        <Input
                            type="text"
                            placeholder="0"
                            {...register("current_balance")}
                            className="border border-gray-500"
                        />
                    </section>
                    {/* Store Commission */}
                    <section className="flex flex-col ">
                        <Label htmlFor="Withdraw Amount" className="pb-2">
                            Withdraw Amount<Asterisk className="text-red-600 h-3 inline" />
                        </Label>
                        {/* min={0} max={100} value={50} */}
                        <NumericInput
                            min={0}
                            max={100000}
                            step={1}
                            mobile
                            className="w-full border border-gray-500 rounded-md p-2"
                            style={{
                                input: { width: "100%", boxSizing: "border-box" },
                            }}
                            // placeholder="Enter commission %"
                            onChange={(valueAsNumber) => setValue("withdraw_amount", valueAsNumber ?? 0)}
                        />
                    </section>
                </div>
                {/* Description */}
                <section className="flex flex-col">
                    <Label htmlFor="remarks" className="pb-2">
                        Remarks
                    </Label>
                    <Textarea
                        {...register("remarks")}
                        placeholder="Comments"
                    />
                </section>
            </main>
        </div>
    )
}
