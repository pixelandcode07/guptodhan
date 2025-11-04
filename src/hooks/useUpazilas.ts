"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'

interface Upazila {
  _id: string
  district: string
  upazilaThanaEnglish: string
  upazilaThanaBangla: string
  websiteLink: string
  createdAt: string
}

export const useUpazilas = (district?: string) => {
  const [upazilas, setUpazilas] = useState<Upazila[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!district) { setUpazilas([]); return }
      try {
        setLoading(true)
        setError(null)
        // Fetch all upazilas and filter by selected district
        const res = await axios.get('/api/v1/upazila-thana')
        const list: Upazila[] = Array.isArray(res.data?.data) ? res.data.data : []
        setUpazilas(list.filter(u => u.district === district))
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load upazilas'
        setError(message)
        setUpazilas([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [district])

  return { upazilas, loading, error }
}


