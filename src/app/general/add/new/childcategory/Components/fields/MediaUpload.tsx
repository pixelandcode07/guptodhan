import UploadImage from '@/components/ReusableComponents/UploadImage'
import { UseFormSetValue } from 'react-hook-form'
import { ChildCategoryInputs } from '../ChildCategory'

export default function MediaUpload({ setValue }: { setValue: UseFormSetValue<ChildCategoryInputs> }) {
    return (
        <UploadImage
            name="child_category_icon"
            label="Child Category Icon"
            onChange={(_name, file) => setValue('iconFile', file || undefined)}
        />
    )
}


