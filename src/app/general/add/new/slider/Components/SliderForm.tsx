'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MediaUpload from './parts/MediaUpload';
import TopRow from './parts/TopRow';
import DetailsFields from './parts/DetailsFields';
import ButtonRow from './parts/ButtonRow';

export type TextPosition = 'Left' | 'Right';

export default function SliderForm() {
  const [image, setImage] = useState<File | null>(null);
  const [textPosition, setTextPosition] = useState<TextPosition | ''>('');
  const [sliderLink, setSliderLink] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');

  const handleSave = () => {
    const payload = {
      image,
      textPosition,
      sliderLink,
      subTitle,
      title,
      description,
      buttonText,
      buttonLink,
    };
    console.log('Slider payload', payload);
    alert('Slider saved (demo)');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MediaUpload image={image} setImage={setImage} />
          <p className="text-[11px] text-gray-500 mt-2">Please upload jpg, jpeg, png file of 1000px × 500px</p>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <TopRow
            textPosition={textPosition}
            setTextPosition={setTextPosition}
            sliderLink={sliderLink}
            setSliderLink={setSliderLink}
          />
          <DetailsFields
            subTitle={subTitle}
            setSubTitle={setSubTitle}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
          <ButtonRow
            buttonText={buttonText}
            setButtonText={setButtonText}
            buttonLink={buttonLink}
            setButtonLink={setButtonLink}
          />
        </div>
      </div>

      <div className="flex justify-center pb-5">
        <Button onClick={handleSave}>Save Slider</Button>
      </div>
    </div>
  );
}


