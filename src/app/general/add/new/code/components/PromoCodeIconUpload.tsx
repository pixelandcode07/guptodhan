"use client"

import { Label } from '@/components/ui/label'
import UploadImage from '@/components/ReusableComponents/UploadImage'

interface PromoCodeIconUploadProps {
  onIconChange: (file: File | null) => void
}

export default function PromoCodeIconUpload({ onIconChange }: PromoCodeIconUploadProps) {
  return (
    <div className="lg:col-span-1">
      <Label className="text-sm font-medium text-gray-700 mb-2 block">Promo Icon *</Label>
      <UploadImage
        name="promo_icon"
        onChange={(_name, file) => onIconChange(file)}
      />
    </div>
  )
}


