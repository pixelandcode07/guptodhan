'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import BasicInfo from './fields/BasicInfo';
import ChildMediaUpload from './fields/MediaUpload';


export type ChildCategoryInputs = {
    categoryId: string;
    subcategoryId: string;
    name: string;
    iconFile?: FileList;
};

export default function ChildCategory() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ChildCategoryInputs>();

    const onSubmit: SubmitHandler<ChildCategoryInputs> = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5">
            <BasicInfo register={register} errors={errors} />
            <ChildMediaUpload setValue={setValue} />
            <div className="text-center">
                <Button variant={'BlueBtn'} type="submit">
                    <Save />
                    Save Child Category
                </Button>
            </div>
        </form>
    );
}


