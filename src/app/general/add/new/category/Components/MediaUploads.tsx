import { Label } from '@/components/ui/label'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { CategoryInputs } from './CategoryForm'
import Dropzone from '@/components/ui/dropzone'

export default function MediaUploads({ register, setValue }: { register: UseFormRegister<CategoryInputs>, setValue: UseFormSetValue<CategoryInputs> }) {
    return (
        <>
            <Label>Category Icon</Label>
            <Dropzone accept='image/*' onFiles={(files) => setValue('iconFile', files)} />

            <Label className='mt-4'>Category Banner</Label>
            <Dropzone accept='image/*' onFiles={(files) => setValue('bannerFile', files)} />
        </>
    )
}


