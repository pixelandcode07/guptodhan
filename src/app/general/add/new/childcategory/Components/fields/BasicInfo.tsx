import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Asterisk } from 'lucide-react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ChildCategoryInputs } from '../ChildCategory'

export default function BasicInfo({ register, errors, categories, subCategories }: {
    register: UseFormRegister<ChildCategoryInputs>
    errors: FieldErrors<ChildCategoryInputs>
    categories: { label: string, value: string }[]
    subCategories: { label: string, value: string }[]
}) {
    return (
        <>
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Child Category Create Form</h1>

            <Label>Select Category<Asterisk className='text-red-600 h-3 ' /></Label>
            <select {...register('category', { required: 'Category is required' })} className='w-full h-10 border border-gray-500 rounded-md px-3 mb-8'>
                <option value=''>Select One</option>
                {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                ))}
            </select>
            {errors.category && (
                <span className="text-red-600">{errors.category.message}</span>
            )}

            <Label>Select Subcategory<Asterisk className='text-red-600 h-3 ' /></Label>
            <select {...register('subCategory', { required: 'Subcategory is required' })} className='w-full h-10 border border-gray-500 rounded-md px-3 mb-8'>
                <option value=''>Select One</option>
                {subCategories.map(subCategory => (
                    <option key={subCategory.value} value={subCategory.value}>{subCategory.label}</option>
                ))}
            </select>
            {errors.subCategory && (
                <span className="text-red-600">{errors.subCategory.message}</span>
            )}

            <Label>Name<Asterisk className='text-red-600 h-3 ' /></Label>
            <Input
                type="text"
                placeholder="Child Category Title"
                {...register('name', { required: 'Name is required' })}
                className='mb-8 border border-gray-500'
            />
            {errors.name && (
                <span className="text-red-600">{errors.name.message}</span>
            )}
        </>
    )
}


