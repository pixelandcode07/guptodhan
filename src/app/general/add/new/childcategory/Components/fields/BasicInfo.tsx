import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Asterisk } from 'lucide-react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ChildCategoryInputs } from '../ChildCategory'

export default function BasicInfo({ register, errors }: {
    register: UseFormRegister<ChildCategoryInputs>
    errors: FieldErrors<ChildCategoryInputs>
}) {
    return (
        <>
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Child Category Create Form</h1>

            <Label>Select Category<Asterisk className='text-red-600 h-3 ' /></Label>
            <select {...register('categoryId', { required: 'Category is required' })} className='w-full h-10 border border-gray-500 rounded-md px-3 mb-8'>
                <option value=''>Select One</option>
                <option value='special-offers'>Special Offers</option>
                <option value='mobile'>Mobile</option>
                <option value='gadget'>Gadget</option>
                <option value='electronics'>Electronics</option>
                <option value='mens-fashion'>Men's Fashion</option>
                <option value='women-fashion'>Women Fashion</option>
                <option value='kids-toys'>Kids & Toys</option>
                <option value='home-living'>Home & Living</option>
                <option value='computer'>Computer</option>
                <option value='laptop'>Laptop</option>
                <option value='accessories'>Accessories</option>
                <option value='camera'>Camera</option>
                <option value='vehicles'>Vehicles</option>
                <option value='organic'>Organic</option>
                <option value='homemade'>Homemade</option>
                <option value='bike-gadgets'>Bike Gadgets</option>
            </select>

            <Label>Select Subcategory<Asterisk className='text-red-600 h-3 ' /></Label>
            <select {...register('subcategoryId', { required: 'Subcategory is required' })} className='w-full h-10 border border-gray-500 rounded-md px-3 mb-8'>
                <option value=''>Select One</option>
            </select>

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


