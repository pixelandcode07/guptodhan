import React from 'react'
import { Send } from 'lucide-react'

function LabelInput({ label, required, placeholder }: { label: string, required?: boolean, placeholder?: string }) {
  return (
    <div>
      <label className='mb-1 block text-sm'>{label}{required && ' *'}</label>
      <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder={placeholder} />
    </div>
  )
}

function LabelTextarea({ label, placeholder }: { label: string, placeholder?: string }) {
  return (
    <div className='md:col-span-2'>
      <label className='mb-1 block text-sm'>{label}</label>
      <textarea className='w-full h-28 border border-gray-300 rounded px-3 py-2' placeholder={placeholder} />
    </div>
  )
}

function NotificationForm() {
  return (
    <section className="border border-[#e4e7eb] rounded-xs">
      <header className="flex items-center justify-between p-3 border-b border-[#e4e7eb]">
        <p className="text-sm">Send Push Notification to Mobile Devices</p>
      </header>
      <div className='p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <LabelInput label='Firebase Server Key' required placeholder='AAAAN7...'/>
          <LabelInput label='FCM Notification URL' required placeholder='https://fcm.googleapis.com/fcm/send' />
          <LabelInput label='FCM Notification Topic' required placeholder='/topics/example' />
          <LabelInput label='Notification Title' required placeholder='Notification Title' />
          <LabelTextarea label='Notification Description' placeholder='Write Description Here' />
          <div className='md:col-span-2'>
            <button className='bg-blue-600 text-white rounded px-4 h-10 flex items-center gap-2'>
              <Send size={16} />
              <span>Send Push Notification</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SendNotificationPage() {
  return (
    <div className='max-w-[1400px] mx-auto m-5 md:m-10'>
      <NotificationForm />
    </div>
  )
}


