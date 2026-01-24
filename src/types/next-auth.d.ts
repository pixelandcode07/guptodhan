// src/types/next-auth.d.ts

import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Extended User interface with custom fields
   */
  interface User {
    id: string
    role?: string
    accessToken?: string
    vendorId?: string
    name?: string
    email?: string
    phoneNumber?: string
    profilePicture?: string
    address?: string
    hasPassword?: boolean
    isActive?: boolean
    isDeleted?: boolean
  }

  /**
   * Extended Session interface with custom fields
   */
  interface Session {
    user: {
      id: string
      role?: string
      vendorId?: string
      name?: string
      email?: string
      phoneNumber?: string
      image?: string
      address?: string
      hasPassword?: boolean
      isActive?: boolean
      isDeleted?: boolean
    }
    accessToken?: string
    error?: string
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT interface with custom fields
   */
  interface JWT {
    id?: string
    role?: string
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    vendorId?: string
    name?: string
    email?: string
    phoneNumber?: string
    profilePicture?: string
    address?: string
    hasPassword?: boolean
    isActive?: boolean
    isDeleted?: boolean
    error?: string
  }
}