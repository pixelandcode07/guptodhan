import React from 'react'
import { Send } from 'lucide-react'
export const dynamic = 'force-dynamic'

function Label({ children }: { children: React.ReactNode }) {
  return <label className='mb-1 block text-sm'>{children}</label>
}

export default function SendSmsPage() {
  return (
    <div className='max-w-[1400px] mx-auto m-5 md:m-10'>
      <section className="border border-[#e4e7eb] rounded-xs">
        <header className="flex items-center justify-between p-3 border-b border-[#e4e7eb]">
          <p className="text-sm">Send SMS</p>
        </header>
        <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Left column */}
          <div className='space-y-4'>
            <div>
              <Label>Sending Type *</Label>
              <select className='h-10 w-full border border-gray-300 rounded px-3'>
                <option>Everyone</option>
              </select>
            </div>
            <fieldset className='border border-gray-200 rounded p-3'>
              <legend className='px-1 text-sm'>SMS Sending Criteria</legend>
              <div className='space-y-4'>
                <div>
                  <Label>Select Customer Type <span className='text-gray-400'>(Optional)</span></Label>
                  <select className='h-10 w-full border border-gray-300 rounded px-3'>
                    <option>Select One</option>
                  </select>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label>Min. Order <span className='text-gray-400'>(Optional)</span></Label>
                    <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='ex. 20' />
                  </div>
                  <div>
                    <Label>Max. Order <span className='text-gray-400'>(Optional)</span></Label>
                    <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='ex. 100' />
                  </div>
                </div>
                <div>
                  <Label>Minimum Order Value <span className='text-gray-400'>(Optional)</span></Label>
                  <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='ex. 1000' />
                </div>
                <div>
                  <Label>Maximum Order Value <span className='text-gray-400'>(Optional)</span></Label>
                  <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='ex. 10000' />
                </div>
              </div>
            </fieldset>
          </div>

          {/* Middle column */}
          <div className='space-y-4'>
            <div>
              <Label>Customer Contact No</Label>
              <input className='h-10 w-full border border-gray-300 rounded px-3' />
            </div>
          </div>

          {/* Right column */}
          <div className='space-y-4'>
            <div>
              <Label>Select SMS Template</Label>
              <select className='h-10 w-full border border-gray-300 rounded px-3'>
                <option>Select One</option>
              </select>
            </div>
            <div>
              <Label>SMS Template Description *</Label>
              <textarea className='w-full h-[170px] border border-gray-300 rounded px-3 py-2' placeholder='Write SMS Here' />
            </div>
          </div>

          <div className='md:col-span-3 flex justify-center'>
            <button className='bg-sky-600 hover:bg-sky-700 text-white rounded px-4 h-10 flex items-center gap-2'>
              <Send size={16} />
              <span>Send SMS</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}


