'use client' // Error components must be Client Components

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Something went wrong!</h2>
      <p className="text-gray-600">Failed to load donation data.</p>
      <Button
        onClick={
          () => reset()
        }
        variant="default"
      >
        Try again
      </Button>
    </div>
  )
}