import { Label } from '@/components/ui/label'
import Dropzone from '@/components/ui/dropzone'
import { UseFormSetValue } from 'react-hook-form'
import { ChildCategoryInputs } from '../ChildCategory'

export default function MediaUpload({ setValue }: { setValue: UseFormSetValue<ChildCategoryInputs> }) {
    return (
        <>
            <Label>Childcategory Icon</Label>
            <Dropzone accept='image/*' onFiles={(files) => setValue('iconFile', files)} />
        </>
    )
}


