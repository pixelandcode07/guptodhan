'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import BasicInfo from './fields/BasicInfo';
import MediaUploads from './fields/MediaUploads';
import Options from './fields/Options';

export type SubcategoryInputs = {
    categoryId: string;
    name: string;
    featureSubcategory: string;
    iconFile?: FileList;
    imageFile?: FileList;
};

export default function Subcategory() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<SubcategoryInputs>();

    const onSubmit: SubmitHandler<SubcategoryInputs> = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5">
            <BasicInfo register={register} errors={errors} />
            <MediaUploads setValue={setValue} />
            <Options register={register} />
            <div className="text-center">
                <Button variant={'BlueBtn'} type="submit">
                    <Save />
                    Save Subcategory
                </Button>
            </div>
        </form>
    );
}


