import React from 'react'
import { UploadCloud } from 'lucide-react'

export default function AddPromoCodePage() {
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
              <div className='border border-gray-300 rounded h-[260px] flex items-center justify-center'>
                <div className='text-center text-gray-500'>
                  <div className='flex items-center justify-center mb-2'>
                    <UploadCloud size={36} className='text-gray-400' />
                  </div>
                  <div className='mb-2'>Drag and drop a file here or click</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm'>Title *</label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='25% OFF Promo' />
              </div>
              <div>
                <label className='mb-1 block text-sm'>Effective Date *</label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='d/m/Y' />
              </div>
              <div>
                <label className='mb-1 block text-sm'>Expiry Date *</label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='d/m/Y' />
              </div>
              <div>
                <label className='mb-1 block text-sm'>Type *</label>
                <select className='h-10 w-full border border-gray-300 rounded px-3'>
                  <option>Select One</option>
                </select>
              </div>
              <div>
                <label className='mb-1 block text-sm'>Value *</label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' />
              </div>
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm'>Minimum Order Amount</label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' />
              </div>
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm'>Code *</label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='SNNY22' />
              </div>
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm'>Short Description</label>
                <textarea className='w-full h-40 border border-gray-300 rounded px-3 py-2' placeholder="During this sale, we're offering 25% OFF this summary. Make sure you don't miss it." />
              </div>
              <div className='md:col-span-2'>
                <button className='bg-blue-600 text-white rounded px-4 h-10'>Save Promo Code</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


