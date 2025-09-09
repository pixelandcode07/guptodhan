import { Label } from '@/components/ui/label'
import { UseFormRegister } from 'react-hook-form'
import { SubcategoryInputs } from '../Subcategory'

export default function Options({ register }: { register: UseFormRegister<SubcategoryInputs> }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <Label className='mb-2'>Feature Subcategory</Label>
                <select {...register('featureSubcategory')} className='w-full h-10 border border-gray-500 rounded-md px-3'>
                    <option value="no">Not Featured</option>
                    <option value="yes">Featured</option>
                </select>
            </div>
        </div>
    )
}


