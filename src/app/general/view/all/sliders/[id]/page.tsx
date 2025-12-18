// src/app/general/add/new/slider/[id]/page.tsx

import SectionTitle from '@/components/ui/SectionTitle';
import { SliderServices } from '@/lib/modules/slider-form/sliderForm.service';
import dbConnect from '@/lib/db';
import SliderForm from '../SlidersClient';

export default async function EditSliderPage({ params }: { params: { id: string } }) {
  await dbConnect();
  const slider = await SliderServices.getSliderByIdFromDB(params.id);

  // ডাটা সিরিয়ালাইজ করা (Date to String, ObjectId to String)
  const initialData = {
    ...slider.toObject(),
    _id: slider._id.toString(),
    // 🔥 নিশ্চিত করুন এই ফিল্ডগুলো যাচ্ছে
    appRedirectType: slider.appRedirectType || 'None',
    appRedirectId: slider.appRedirectId || '',
  };

  return (
    <div className="pt-5 bg-white space-y-4">
      <SectionTitle text="Edit Slider" />
      <div className="px-5 pt-4">
        {/* 🔥 Initial Data পাস করা হচ্ছে */}
        <SliderForm initialData={initialData} />
      </div>
    </div>
  );
}