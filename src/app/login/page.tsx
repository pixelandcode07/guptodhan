"use client"

import LogInRegister from '@/app/components/LogInAndRegister/LogIn_Register'
import { Dialog } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Dialog 
          open={isOpen} 
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) {
              // ডায়ালগ ক্লোজ (X বাটনে ক্লিক) করলে হোম পেজে নিয়ে যাবে
              router.push('/')
            }
          }}
        >
          <LogInRegister />
        </Dialog>
      </div>
    </div>
  )
}