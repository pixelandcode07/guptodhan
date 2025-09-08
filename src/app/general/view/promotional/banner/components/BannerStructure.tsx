"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useForm } from "react-hook-form";
import BannerCreateForm from "./BannerCreateForm";





export type BannerForm = {
  headingText: string;
  headingColor: string;
  titleText: string;
  titleColor: string;
  description: string;
  descriptionColor: string;
  buttonText: string;
  buttonUrl: string;
  buttonTextColor: string;
  buttonBgColor: string;
  backgroundColor: string;
  backgroundImage: FileList;
  productImage: FileList;
  headerIcon: FileList;
  videoUrl: string;
};

export default function BannerStructure() {
  const { register, handleSubmit, control, watch } = useForm<BannerForm>();

  const values = watch();

  const onSubmit = (data: BannerForm) => {
    console.log("Banner data:", data);
    // TODO: send to API route → MongoDB
  };

  // Generate temporary URLs for preview (these are not persisted)
  const getImageUrl = (fileList: FileList | undefined) =>
    fileList?.length ? URL.createObjectURL(fileList[0]) : null;
  return (
    <div className="my-10">
      {/* space-y-6 p-4 max-w-4xl mx-auto */}
      {/* Preview */}
      <div
        className="p-6 rounded-xl relative overflow-hidden"
        style={{
          backgroundColor: values.backgroundColor,
          backgroundImage: values.backgroundImage?.length ? `url(${getImageUrl(values.backgroundImage)})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {values.headerIcon?.length && getImageUrl(values.headerIcon) && (
          <Image
            src={getImageUrl(values.headerIcon) || ""}
            alt="Header Icon"
            width={48}
            height={48}
            className="absolute top-4 left-4"
          />
        )}
        <h2 style={{ color: values.headingColor }} className="text-2xl font-bold sm:text-3xl">
          {values.headingText}
        </h2>
        <h3 style={{ color: values.titleColor }} className="text-xl mt-2 sm:text-2xl">
          {values.titleText}
        </h3>
        {values.productImage?.length && getImageUrl(values.productImage) && (
          <Image
            src={getImageUrl(values.productImage) || ""}
            alt="Product"
            width={160}
            height={160}
            className="w-40 h-40 object-cover mt-4"
          />
        )}
        <p style={{ color: values.descriptionColor }} className="mt-2 max-w-lg text-sm sm:text-base">
          {values.description}
        </p>
        <Button
          style={{
            backgroundColor: values.buttonBgColor,
            color: values.buttonTextColor,
          }}
          asChild
          className="mt-4 px-4 py-2 text-sm sm:text-base"
        >
          <a href={values.buttonUrl} target="_blank" rel="noreferrer">
            {values.buttonText}
          </a>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* BannerCreateForm */}
        <BannerCreateForm register={register} control={control} />

        <div className="text-center">
          <Button type="submit" variant={'BlueBtn'} className="w-full sm:w-auto">Update Banner Info</Button>
        </div>
      </form>
    </div>
  )
}
