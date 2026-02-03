import SectionTitle from '@/components/ui/SectionTitle';
import { SliderServices } from '@/lib/modules/slider-form/sliderForm.service';
import dbConnect from '@/lib/db';
import SliderForm from '@/app/general/add/new/slider/Components/SliderForm';

export default async function EditSliderPage({ params }: { params: { id: string } }) {
  await dbConnect();
  const slider = await SliderServices.getSliderByIdFromDB(params.id);

  // ডাটা সিরিয়ালাইজ এবং প্রিপেয়ার করা
  const initialData = {
    ...slider.toObject(),
    _id: slider._id.toString(),
    // নিশ্চিত করা হচ্ছে সব ফিল্ড সঠিকভাবে যাচ্ছে
    appRedirectType: slider.appRedirectType || 'None',
    appRedirectId: slider.appRedirectId || '',
    textPosition: slider.textPosition,
    sliderLink: slider.sliderLink,
    subTitleWithColor: slider.subTitleWithColor,
    bannerTitleWithColor: slider.bannerTitleWithColor,
    bannerDescriptionWithColor: slider.bannerDescriptionWithColor,
    buttonWithColor: slider.buttonWithColor,
    buttonLink: slider.buttonLink,
    status: slider.status,
    image: slider.image
  };

  return (
    <div className="pt-5 bg-white space-y-4">
      <SectionTitle text="Edit Slider" />
      <div className="px-5 pt-4">
        <SliderForm initialData={initialData} />
      </div>
    </div>
  );
}