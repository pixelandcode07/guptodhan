import { Label } from '@/components/ui/label';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { CategoryInputs } from './CategoryForm';
import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn';
import UploadImage from '@/components/ReusableComponents/UploadImage';

export default function MediaUploads({
  register,
  setValue,
  watch,
}: {
  register: UseFormRegister<CategoryInputs>;
  setValue: UseFormSetValue<CategoryInputs>;
  watch: UseFormWatch<CategoryInputs>;
}) {
  const iconFile = watch('iconFile') as File | undefined;
  const bannerFile = watch('bannerFile') as File | undefined;
  return (
    <>
      <UploadImage
        name="category_icon"
        label="Category Icon"
        onChange={(_name, file) => setValue('iconFile', file || undefined)}
      />

      <div className="mt-4">
        <UploadImage
          name="category_banner"
          label="Category Banner"
          onChange={(_name, file) => setValue('bannerFile', file || undefined)}
        />
      </div>
    </>
  );
}
