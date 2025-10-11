import { Label } from '@/components/ui/label'
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { CategoryInputs } from './CategoryForm'
import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn';

export default function MediaUploads({ register, setValue, watch }: { register: UseFormRegister<CategoryInputs>, setValue: UseFormSetValue<CategoryInputs>, watch: UseFormWatch<CategoryInputs> }) {
    const iconFile = watch('iconFile') as File | undefined;
    const bannerFile = watch('bannerFile') as File | undefined;
    return (
        <>
            <Label>Category Icon</Label>
            <UploadImageBtn id="category_icon" value={(iconFile ?? null) as File | null} onChange={(file) => setValue('iconFile', file || undefined)} />

            <Label className='mt-4'>Category Banner</Label>
            <UploadImageBtn id="category_banner" value={(bannerFile ?? null) as File | null} onChange={(file) => setValue('bannerFile', file || undefined)} />
        </>
    )
}


