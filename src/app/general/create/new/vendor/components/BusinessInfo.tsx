import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Asterisk } from 'lucide-react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'

import chroma from 'chroma-js';

import Select, { StylesConfig } from 'react-select';
import { ColourOption, colourOptions } from '@/data/data'
import { Inputs } from './CreateVendorForm';

const colourStyles: StylesConfig<ColourOption, true> = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? data.color
                    : isFocused
                        ? color.alpha(0.1).css()
                        : undefined,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(color, 'white') > 2
                        ? 'white'
                        : 'black'
                    : data.color,
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? data.color
                        : color.alpha(0.3).css()
                    : undefined,
            },
        };
    },
    multiValue: (styles, { data }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: color.alpha(0.10).css(),
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ':hover': {
            backgroundColor: data.color,
            color: 'black',
        },
    }),
};

export default function BusinessInfo({ register, errors, setValue }: {
    register: UseFormRegister<Inputs>
    errors: FieldErrors<Inputs>
    setValue: UseFormSetValue<Inputs>
}) {
    return (
        <>
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Business Information:</h1>
            {/* Business Name */}
            <Label htmlFor="name">Business Name<Asterisk className='text-red-600 h-3' /></Label>
            <Input
                type="text"
                placeholder="Business Name"
                {...register("business_name", { required: "This field is required" })}
                className='mb-8 border border-gray-500'
            />
            {errors.business_name && (
                <span className="text-red-600">{errors.business_name.message}</span>
            )}
            {/* Business Category */}
            <Label htmlFor="name">Business Category</Label>
            <Select
                closeMenuOnSelect={false}
                isMulti
                options={colourOptions}
                styles={colourStyles}
                onChange={(selectedOptions) => setValue('business_category', [...selectedOptions])}
            />
            {/* Trade License Number */}
            <Label htmlFor="name">Trade License Number</Label>
            <Input
                type="text"
                placeholder="Business Trade License Number"
                {...register("trade_license_number")}
                className='mb-8 border border-gray-500'
            />
            {/* Business Address */}
            <Label htmlFor="name">Business Address</Label>
            <Input
                type="text"
                placeholder="Business Address"
                {...register("business_address")}
                className='mb-8 border border-gray-500'
            />
        </>
    )
}
