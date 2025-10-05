"use client"

import React, { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AddPromoCodePage() {
  const router = useRouter()
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconUrl, setIconUrl] = useState('')
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endingDate, setEndingDate] = useState('')
  const [type, setType] = useState('')
  const [value, setValue] = useState('')
  const [minimumOrderAmount, setMinimumOrderAmount] = useState('')
  const [code, setCode] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleUploadIcon = async () => {
    if (!iconFile) return ''
    const fd = new FormData()
    fd.append('file', iconFile)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      throw new Error(j?.error || 'Icon upload failed')
    }
    const data = await res.json()
    return data.secure_url || data.url || ''
  }

  const onSubmit = async () => {
    if (submitting) return
    try {
      setSubmitting(true)
      if (!title || !startDate || !endingDate || !type || !value || !code) {
        throw new Error('Please fill all required fields.')
      }

      let finalIcon = iconUrl
      if (iconFile) {
        finalIcon = await handleUploadIcon()
      }
      if (!finalIcon) throw new Error('Please provide an icon.')

      const payload = {
        promoCodeId: `PC-${Date.now()}`,
        title,
        icon: finalIcon,
        startDate, // controller converts to Date
        endingDate,
        type,
        shortDescription,
        value: Number(value),
        minimumOrderAmount: Number(minimumOrderAmount || 0),
        code,
        status: 'active',
      }

      const res = await fetch('/api/v1/promo-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const j = await res.json()
      if (!res.ok || j?.success === false) throw new Error(j?.message || 'Failed to create promo code')

      router.push('/general/view/all/promo/codes')
    } catch (e: any) {
      alert(e?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='max-w-[1400px] mx-auto m-5 md:m-10'>
      <section className="border border-[#e4e7eb] rounded-xs">
        <header className="flex items-center justify-between p-3 border-b border-[#e4e7eb]">
          <p className="text-sm">Promo Code Entry Form</p>
        </header>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-1">
              <label className='mb-1 block text-sm'>Promo Icon</label>
              <div className='border border-gray-300 rounded h-[260px] flex items-center justify-center relative overflow-hidden'>
                {!iconFile && !iconUrl ? (
                  <label htmlFor='promo_icon' className='w-full h-full flex flex-col items-center justify-center text-gray-500 cursor-pointer'>
                    <div className='flex items-center justify-center mb-2'>
                      <UploadCloud size={36} className='text-gray-400' />
                    </div>
                    <div className='mb-2'>Drag and drop a file here or click</div>
                  </label>
                ) : (
                  <img src={iconFile ? URL.createObjectURL(iconFile) : iconUrl} alt='Icon' className='object-contain max-h-full' />
                )}
                <input id='promo_icon' type='file' accept='image/*' className='hidden' onChange={(e) => setIconFile(e.target.files?.[0] || null)} />
              </div>
              <div className='mt-2'>
                <input value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} className='h-10 w-full border border-gray-300 rounded px-3' placeholder='or paste icon URL' />
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm'>Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className='h-10 w-full border border-gray-300 rounded px-3' placeholder='25% OFF Promo' />
              </div>
              <div>
                <label className='mb-1 block text-sm'>Effective Date *</label>
                <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type='date' className='h-10 w-full border border-gray-300 rounded px-3' />
              </div>
              <div>
                <label className='mb-1 block text-sm'>Expiry Date *</label>
                <input value={endingDate} onChange={(e) => setEndingDate(e.target.value)} type='date' className='h-10 w-full border border-gray-300 rounded px-3' />
              </div>
              <div>
                <label className='mb-1 block text-sm'>Type *</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className='h-10 w-full border border-gray-300 rounded px-3'>
                  <option value=''>Select One</option>
                  <option value='Percentage'>Percentage</option>
                  <option value='Fixed Amount'>Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className='mb-1 block text-sm'>Value *</label>
                <input value={value} onChange={(e) => setValue(e.target.value)} type='number' className='h-10 w-full border border-gray-300 rounded px-3' />
              </div>
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm'>Minimum Order Amount</label>
                <input value={minimumOrderAmount} onChange={(e) => setMinimumOrderAmount(e.target.value)} type='number' className='h-10 w-full border border-gray-300 rounded px-3' />
              </div>
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm'>Code *</label>
                <input value={code} onChange={(e) => setCode(e.target.value)} className='h-10 w-full border border-gray-300 rounded px-3' placeholder='SNNY22' />
              </div>
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm'>Short Description</label>
                <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className='w-full h-40 border border-gray-300 rounded px-3 py-2' placeholder="During this sale, we're offering 25% OFF this summary. Make sure you don't miss it." />
              </div>
              <div className='md:col-span-2'>
                <button onClick={onSubmit} disabled={submitting} className='bg-blue-600 text-white rounded px-4 h-10'>
                  {submitting ? 'Saving...' : 'Save Promo Code'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


