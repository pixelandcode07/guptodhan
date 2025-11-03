"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'

const CACHE_KEY = 'delivery_charges_cache'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

interface DeliveryChargeItem {
  _id: string
  divisionName: string
  districtName: string
  districtNameBangla: string
  deliveryCharge: number
  upazilaName?: string
}

interface CachedDeliveryCharges {
  data: DeliveryChargeItem[]
  timestamp: number
}

export const useDeliveryCharge = (districtName?: string, upazilaName?: string) => {
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      if (!districtName) {
        setDeliveryCharge(0)
        return
      }

      // Check cache first
      let allCharges: DeliveryChargeItem[] = []
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsedCache: CachedDeliveryCharges = JSON.parse(cached)
          const now = Date.now()
          
          // Check if cache is still valid
          if (now - parsedCache.timestamp < CACHE_TTL) {
            allCharges = parsedCache.data
          }
        }
      } catch (error) {
        console.error('Error reading delivery charge cache:', error)
      }

      // If cache is empty or stale, fetch all delivery charges
      if (allCharges.length === 0) {
        try {
          setLoading(true)
          const response = await axios.get('/api/v1/delivery-charge')
          
          if (response.data.success && response.data.data) {
            allCharges = response.data.data
            
            // Cache all delivery charges
            const cacheData: CachedDeliveryCharges = {
              data: allCharges,
              timestamp: Date.now()
            }
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
          }
        } catch (error) {
          console.error('Error fetching delivery charges:', error)
          setLoading(false)
          setDeliveryCharge(0)
          return
        }
      }

      // Find matching delivery charge
      // Match by district first, then by upazila if provided
      const match = allCharges.find(charge => {
        const districtMatch = charge.districtName.toLowerCase() === districtName.toLowerCase()
        if (upazilaName) {
          // If upazila is provided, we'll match by district only for now
          // since delivery charge model doesn't have upazila field
          // The API query parameter upazilaName might be used for filtering elsewhere
          return districtMatch
        }
        return districtMatch
      })

      if (match) {
        setDeliveryCharge(match.deliveryCharge)
      } else {
        // If no exact match, try to find by district name (case-insensitive)
        const districtMatch = allCharges.find(charge => 
          charge.districtName.toLowerCase().includes(districtName.toLowerCase()) ||
          districtName.toLowerCase().includes(charge.districtName.toLowerCase())
        )
        
        if (districtMatch) {
          setDeliveryCharge(districtMatch.deliveryCharge)
        } else {
          // No match found - try API with query params as fallback
          try {
            const queryParams = new URLSearchParams({
              districtName: districtName
            })
            if (upazilaName) {
              queryParams.append('upazilaName', upazilaName)
            }

            const response = await axios.get(`/api/v1/delivery-charge?${queryParams.toString()}`)
            
            if (response.data.success && response.data.data.length > 0) {
              const charge = response.data.data[0].deliveryCharge
              setDeliveryCharge(charge)
            } else {
              setDeliveryCharge(0)
            }
          } catch (error) {
            console.error('Error fetching delivery charge by query:', error)
            setDeliveryCharge(0)
          }
        }
      }

      setLoading(false)
    }

    fetchDeliveryCharge()
  }, [districtName, upazilaName])

  return { deliveryCharge, loading }
}

