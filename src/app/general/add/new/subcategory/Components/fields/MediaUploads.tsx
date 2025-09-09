import { Label } from '@/components/ui/label'
import Dropzone from '@/components/ui/dropzone'
import { UseFormSetValue } from 'react-hook-form'
import { SubcategoryInputs } from '../Subcategory'

export default function MediaUploads({ setValue }: { setValue: UseFormSetValue<SubcategoryInputs> }) {
    return (
        <>
            <Label>Subcategory Icon</Label>
            <Dropzone accept='image/*' onFiles={(files) => setValue('iconFile', files)} />

            <Label className='mt-4'>Subcategory Image</Label>
            <Dropzone accept='image/*' onFiles={(files) => setValue('imageFile', files)} />
        </>
    )
}


