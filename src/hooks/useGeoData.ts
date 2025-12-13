"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'

interface Upazila {
  _id: string
  district: string
  upazilaThanaEnglish: string
  upazilaThanaBangla: string
  websiteLink: string
  createdAt: string
}

interface District {
  district: string
}

interface GeoData {
  allDistricts: District[]
  allUpazilas: Upazila[]
}

const CACHE_KEY = 'geo_data_cache'
const CACHE_TTL = 24 * 60 * 60 * 1000

interface CachedGeoData {
  data: GeoData
  timestamp: number
}

export const useGeoData = () => {
  const [geoData, setGeoData] = useState<GeoData>({
    allDistricts: [],
    allUpazilas: []
  })
  const [geoLoading, setGeoLoading] = useState(true)

  useEffect(() => {
    const fetchGeoData = async () => {
      
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsedCache: CachedGeoData = JSON.parse(cached)
          const now = Date.now()
          
          if (now - parsedCache.timestamp < CACHE_TTL && parsedCache.data.allDistricts.length > 0) {
            console.log('Using cached geo data:', parsedCache.data)
            setGeoData(parsedCache.data)
            setGeoLoading(false)
          } else {
            console.log('Cache expired or invalid, fetching fresh data')
            localStorage.removeItem(CACHE_KEY)
          }
        }
      } catch (error) {
        console.error('Error reading geo cache:', error)
        localStorage.removeItem(CACHE_KEY)
      }

      try {
        setGeoLoading(true)
        const [chargesRes, upazilaRes] = await Promise.all([
          axios.get('/api/v1/delivery-charge').catch(err => {
            console.error('Delivery charge API error:', err)
            return { data: { success: false, data: [] } }
          }),
          axios.get('/api/v1/upazila-thana').catch(err => {
            console.error('Upazila API error:', err)
            return { data: { success: false, data: [] } }
          }),
        ])

        let upazilas: Upazila[] = []
        if (upazilaRes.data?.success && Array.isArray(upazilaRes.data?.data)) {
          upazilas = upazilaRes.data.data as Upazila[]
          console.log('Loaded upazilas:', upazilas.length)
        } else {
          console.warn('Upazila API response was not successful or invalid:', upazilaRes.data)
        }

        const districtsFromCharges: District[] = []
        console.log('Delivery charge API response:', chargesRes.data)
        if (chargesRes.data?.success && Array.isArray(chargesRes.data?.data)) {
          const seen = new Set<string>()
          const charges = chargesRes.data.data as Array<{ districtName: string }>
          console.log('Processing delivery charges:', charges.length)
          for (const item of charges) {
            const name = String(item.districtName || '').trim()
            if (name && !seen.has(name)) {
              seen.add(name)
              districtsFromCharges.push({ district: name })
            }
          }
          console.log('Extracted districts from delivery charges:', districtsFromCharges.length, districtsFromCharges)
        } else {
          console.warn('Delivery charge API response was not successful or invalid:', chargesRes.data)
          if (!chargesRes.data?.success) {
            toast.error('Failed to load districts from delivery charge API')
          }
        }

        if (districtsFromCharges.length > 0 || upazilas.length > 0) {
          const newGeoData: GeoData = {
            allDistricts: districtsFromCharges,
            allUpazilas: upazilas,
          }

          setGeoData(newGeoData)

          const cacheData: CachedGeoData = {
            data: newGeoData,
            timestamp: Date.now(),
          }
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        } else {
          toast.error('Failed to load geographic data')
          setGeoData({ allDistricts: [], allUpazilas: [] })
        }
      } catch (error) {
        console.error('Error fetching geo data:', error)
        toast.error('Failed to load geographic data')
        setGeoData({ allDistricts: [], allUpazilas: [] })
      } finally {
        setGeoLoading(false)
      }
    }

    fetchGeoData()
  }, [])

  return { geoData, geoLoading }
}

