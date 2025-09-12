'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Options from './Options';
import MediaUpload from './MediaUpload';
import Links from './Links';
import TextFields from './TextFields';
import { BannerPosition, TextPosition } from './types';
import TopRow from './TopRow';
import DetailsFields from './DetailsFields';
import ButtonRow from './ButtonRow';


// types moved to ./types to avoid cross-import warnings

export default function BannerForm() {
  const [image, setImage] = useState<File | null>(null);
  const [bannerPosition, setBannerPosition] = useState<BannerPosition | ''>('');
  const [textPosition, setTextPosition] = useState<TextPosition | ''>('');
  const [subTitle, setSubTitle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [buttonLink, setButtonLink] = useState('');

  const handleSave = () => {
    const payload = {
      image,
      bannerPosition,
      textPosition,
      subTitle,
      title,
      description,
      buttonText,
      bannerLink,
      buttonLink,
    };
    console.log('Banner payload', payload);
    alert('Banner saved (demo)');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MediaUpload image={image} setImage={setImage} />
          <p className="text-[11px] text-gray-500 mt-2">Please upload jpg, jpeg, png file of 500px × 262px</p>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <TopRow
            bannerPosition={bannerPosition}
            setBannerPosition={setBannerPosition}
            textPosition={textPosition}
            setTextPosition={setTextPosition}
            bannerLink={bannerLink}
            setBannerLink={setBannerLink}
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
        <Button onClick={handleSave}>
          Save Banner
        </Button>
      </div>
    </div>
  );
}


