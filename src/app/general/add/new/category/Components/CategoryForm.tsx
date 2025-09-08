'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import BasicInfo from './BasicInfo';
import MediaUploads from './MediaUploads';
import Options from './Options';


export type CategoryInputs = {
    name: string;
    featureCategory: string;
    showOnNavbar: string;
    iconFile?: FileList;
    bannerFile?: FileList;
};

export default function CategoryForm() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CategoryInputs>();

    const onSubmit: SubmitHandler<CategoryInputs> = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5">
            <BasicInfo register={register} errors={errors} />
            <MediaUploads register={register} setValue={setValue} />
            <Options register={register} />
            <div className="text-center">
                <Button variant={'BlueBtn'} type="submit">
                    <Save />
                    Save Category
                </Button>
            </div>
        </form>
    );
}


