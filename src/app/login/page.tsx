"use client"

import LogInRegister from '@/app/components/LogInAndRegister/LogIn_Register'
import { Dialog } from '@/components/ui/dialog'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Dialog open={true} onOpenChange={() => {}}>
          <LogInRegister />
        </Dialog>
      </div>
    </div>
  )
}