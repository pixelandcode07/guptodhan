import React from 'react'
import { Switch } from '@/components/ui/switch'

export default function CourierApiKeysPage() {
  return (
    <div className='max-w-[900px] mx-auto m-5 md:m-10'>
      <section className="border border-[#e4e7eb] rounded-xs">
        <header className="flex items-center justify-between p-3 border-b border-[#e4e7eb]">
          <p className="text-sm">Steadfast Courier</p>
          <Switch defaultChecked className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500" />
        </header>
        <div className='p-6'>
          <div className='flex justify-center mb-6'>
            <img src="/public/img/StoreLogo.jpeg" alt="Courier Logo" className='h-8 opacity-80' />
          </div>
          <div className='space-y-4'>
            <div>
              <label className='mb-1 block text-sm'>APP Key</label>
              <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='bkpvb18g5wqc...' />
            </div>
            <div>
              <label className='mb-1 block text-sm'>Secret Key</label>
              <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='3fpoh1keqb...' />
            </div>
            <div>
              <label className='mb-1 block text-sm'>Courier COD Charge</label>
              <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='0.01' />
            </div>
            <div>
              <button className='bg-blue-600 text-white rounded px-4 h-10'>Update Info</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


