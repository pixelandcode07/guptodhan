"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface OrderErrorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  errorMessage: string
  onRetry?: () => void
}

export default function OrderErrorModal({ 
  open, 
  onOpenChange, 
  errorMessage, 
  onRetry 
}: OrderErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Order Failed</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div className="p-8 text-center">
          <div className="mx-auto mb-6 w-24 h-24">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Order Failed</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {errorMessage}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              className="min-w-[140px] h-11"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            {onRetry && (
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px] h-11 flex items-center gap-2"
                onClick={() => {
                  onOpenChange(false)
                  onRetry()
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
