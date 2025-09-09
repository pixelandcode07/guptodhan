import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Asterisk } from 'lucide-react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { CategoryInputs } from './CategoryForm'

export default function BasicInfo({ register, errors }: {
    register: UseFormRegister<CategoryInputs>
    errors: FieldErrors<CategoryInputs>
}) {
    return (
        <>
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Category Create Form</h1>

            <Label htmlFor="name">Name<Asterisk className='text-red-600 h-3 ' /></Label>
            <Input
                type="text"
                placeholder="Category Name"
                {...register('name', { required: 'Name is required' })}
                className='mb-8 border border-gray-500'
            />
            {errors.name && (
                <span className="text-red-600">{errors.name.message}</span>
            )}
        </>
    )
}


