"use client"

import PromoCodeHeader from './PromoCodeHeader'
import PromoCodeIconUpload from './PromoCodeIconUpload'
import BasicInfoFields from './BasicInfoFields'
import PromoCodeActions from './PromoCodeActions'
import { usePromoCodeForm } from '../hooks/usePromoCodeForm'

export default function PromoCodeForm() {
  const {
    iconFile,
    setIconFile,
    title,
    setTitle,
    startDate,
    setStartDate,
    endingDate,
    setEndingDate,
    type,
    setType,
    value,
    setValue,
    minimumOrderAmount,
    setMinimumOrderAmount,
    code,
    setCode,
    shortDescription,
    setShortDescription,
    isSubmitting,
    handleSubmit,
  } = usePromoCodeForm()

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8">
      <PromoCodeHeader />

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6 sm:space-y-8">
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-3">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Basic Information</h3>
            <p className="text-xs text-gray-600">Enter the essential details</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PromoCodeIconUpload onIconChange={setIconFile} />
            
            <BasicInfoFields
              title={title}
              onTitleChange={setTitle}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endingDate={endingDate}
              onEndingDateChange={setEndingDate}
              type={type}
              onTypeChange={setType}
              value={value}
              onValueChange={setValue}
              minimumOrderAmount={minimumOrderAmount}
              onMinimumOrderAmountChange={setMinimumOrderAmount}
              code={code}
              onCodeChange={setCode}
              shortDescription={shortDescription}
              onShortDescriptionChange={setShortDescription}
            />
          </div>
        </div>

        <PromoCodeActions isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </form>
    </div>
  )
}

