"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface PromoCodeActionsProps {
  isSubmitting: boolean
  onSubmit: () => void
}

export default function PromoCodeActions({ isSubmitting, onSubmit }: PromoCodeActionsProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
      <Button 
        type="button"
        variant="outline" 
        onClick={() => router.back()}
        className="w-full sm:w-auto h-10 sm:h-11"
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
        onClick={onSubmit}
        className="w-full sm:w-auto h-10 sm:h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
      >
        {isSubmitting ? "Creating..." : "Create Promo Code"}
      </Button>
    </div>
  )
}


