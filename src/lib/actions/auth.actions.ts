// ফাইল পাথ: src/lib/actions/auth.actions.ts
// ✅ COMPLETE FIXED - সব TypeScript errors solved

'use server'

import { cookies } from 'next/headers'
import { deleteCacheKey, deleteCachePattern } from '@/lib/redis/cache-helpers'
import { CacheKeys } from '@/lib/redis/cache-keys'

/**
 * ✅ Complete Logout Action
 * Clears:
 * - All Cookies (HttpOnly & Regular)
 * - Redis Cache
 * - Session Data
 */
export async function logoutAction(userId?: string) {
  try {
    console.log('🚀 Logout action started for user:', userId)

    // ========================================
    // 1️⃣ GET COOKIES STORE (await করতে হবে)
    // ========================================
    const cookieStore = await cookies()

    // ========================================
    // 2️⃣ DELETE ALL AUTH-RELATED COOKIES
    // ========================================
    console.log('🧹 Clearing cookies...')

    const cookiesToDelete = [
      'accessToken',
      'refreshToken',
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token',
      'NEXT_LOCALE',
    ]

    // প্রতিটি cookie ডিলিট করুন (2 উপায়ে extra sure এর জন্য)
    for (const cookieName of cookiesToDelete) {
      // উপায় ১: direct delete
      cookieStore.delete(cookieName)

      // উপায় ২: expiry set করে delete (extra secure)
      cookieStore.set(cookieName, '', {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }

    console.log('✅ Cookies cleared successfully')

    // ========================================
    // 3️⃣ CLEAR REDIS CACHE (User-specific)
    // ========================================
    if (userId) {
      try {
        console.log('🧹 Clearing Redis cache for user:', userId)

        // ইউজার-স্পেসিফিক caches ডিলিট করুন
        await deleteCacheKey(CacheKeys.USER.PROFILE(userId))
        await deleteCacheKey(CacheKeys.USER.BY_EMAIL(userId))
        await deleteCacheKey(CacheKeys.USER.BY_PHONE(userId))

        // Pattern-based deletion
        await deleteCachePattern(`user:${userId}:*`)
        await deleteCachePattern(`session:${userId}:*`)
        await deleteCachePattern(`profile:${userId}:*`)
        await deleteCachePattern(`auth:${userId}:*`)

        console.log('✅ Redis user-specific cache cleared')
      } catch (cacheError: any) {
        console.error('⚠️ Redis user cache error (non-critical):', cacheError.message)
        // চালিয়ে যান, এটা optional
      }
    }

    // ========================================
    // 4️⃣ CLEAR GLOBAL REDIS CACHE PATTERNS
    // ========================================
    try {
      console.log('🧹 Clearing global Redis patterns...')

      // সব user-related caches ডিলিট করুন
      await deleteCachePattern('user:*')
      await deleteCachePattern('session:*')
      await deleteCachePattern('profile:*')
      await deleteCachePattern('auth:*')
      await deleteCachePattern('cache:*')

      console.log('✅ Global Redis patterns cleared')
    } catch (globalCacheError: any) {
      console.error('⚠️ Global cache clear error (non-critical):', globalCacheError.message)
      // চালিয়ে যান
    }

    // ========================================
    // 5️⃣ CLEAR BROWSER-SIDE DATA (Optional note)
    // ========================================
    console.log('ℹ️ Browser-side data (localStorage, sessionStorage) will be cleared on client')

    return {
      success: true,
      message: 'Server-side logout completed successfully',
      timestamp: new Date().toISOString(),
    }

  } catch (error: any) {
    console.error('❌ Logout action error:', error.message || error)

    // Error হলেও চেষ্টা করেছি সব clear করতে
    return {
      success: false,
      message: error.message || 'Logout encountered an error',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    }
  }
}

/**
 * ✅ Optional: Logout All User Sessions
 * একজন user এর সব devices থেকে logout করানোর জন্য
 */
export async function logoutAllSessionsAction(userId: string) {
  try {
    if (!userId) throw new Error('User ID is required')

    console.log('🔴 Logging out all sessions for user:', userId)

    // Clear all user sessions from cache
    await deleteCachePattern(`session:${userId}:*`)
    await deleteCachePattern(`auth:${userId}:*`)

    const cookieStore = await cookies()
    const sessionCookies = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'accessToken',
      'refreshToken',
    ]

    for (const cookie of sessionCookies) {
      cookieStore.delete(cookie)
      cookieStore.set(cookie, '', { expires: new Date(0) })
    }

    console.log('✅ All sessions cleared for user:', userId)

    return {
      success: true,
      message: 'All sessions logged out successfully',
    }

  } catch (error: any) {
    console.error('❌ Logout all sessions error:', error)
    return {
      success: false,
      message: error.message || 'Failed to logout all sessions',
    }
  }
}