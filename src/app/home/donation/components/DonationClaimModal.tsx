"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type DonationItem = { id: string, title: string, image: string, category?: string }

export default function DonationClaimModal({ open, onOpenChange, item }: { open: boolean, onOpenChange: (v: boolean) => void, item?: DonationItem }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Request for Donation Item</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-4">
          {/* Item summary */}
          <div className="border rounded-md p-3 flex items-center gap-3 bg-gray-50">
            <div className="h-12 w-12 rounded bg-gray-200 overflow-hidden">
              {item?.image && <img src={item.image} alt={item.title} className="h-full w-full object-cover" />}
            </div>
            <div className="text-sm">
              <div className="font-medium leading-5">{item?.title ?? '—'}</div>
              <div className="text-xs text-gray-500">Donated by: —</div>
              <div className="text-xs text-gray-500">Item: {item?.id ?? '—'}</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-gray-600">Name</div>
            <Input placeholder="eg. Your name" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-600">Phone Number</div>
            <Input placeholder="eg. 01XXXXXXXXX" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-600">Email</div>
            <Input placeholder="eg. example@email.com" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-600">Why do you need it?</div>
            <Textarea placeholder="write your reason here..." className="min-h-24" />
          </div>

          <Button className="w-full bg-blue-500">Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


