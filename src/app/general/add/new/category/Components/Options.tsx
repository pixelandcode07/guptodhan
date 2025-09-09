import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UseFormRegister } from 'react-hook-form'
import { CategoryInputs } from './CategoryForm'

export default function Options({ register }: { register: UseFormRegister<CategoryInputs> }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-0">
            <div>
                <Label className='mb-2'>Feature Category</Label>
                <select {...register('featureCategory')} className='w-full h-10 border border-gray-500 rounded-md px-3'>
                    <option value="">Select One</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
            <div>
                <Label className='mb-2'>Show On Navbar</Label>
                <select {...register('showOnNavbar')} className='w-full h-10 border border-gray-500 rounded-md px-3'>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
        </div>
    )
}


