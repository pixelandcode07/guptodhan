import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { CategoryInputs } from './CategoryForm'

export default function Options({ register, setValue, watch }: { register: UseFormRegister<CategoryInputs>, setValue: UseFormSetValue<CategoryInputs>, watch: UseFormWatch<CategoryInputs> }) {
    const featured = watch('featureCategory') || ''
    const navbar = watch('showOnNavbar') || ''

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label className='mb-2'>Feature Category</Label>
                <Select value={featured} onValueChange={(v) => setValue('featureCategory', v)}>
                    <SelectTrigger className="w-full h-10 border border-gray-500">
                        <SelectValue placeholder="Select One" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">If enabled, this category may be highlighted across the site.</p>
            </div>
            <div className="space-y-2">
                <Label className='mb-2'>Show On Navbar</Label>
                <Select value={navbar} onValueChange={(v) => setValue('showOnNavbar', v)}>
                    <SelectTrigger className="w-full h-10 border border-gray-500">
                        <SelectValue placeholder="Select One" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Control whether this category appears in the main navigation.</p>
            </div>
        </div>
    )
}


