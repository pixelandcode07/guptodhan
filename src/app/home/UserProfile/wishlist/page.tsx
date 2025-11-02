import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import dbConnect from '@/lib/db'
import { WishlistModel } from '@/lib/wishlist/wishlist.model'
import { Types } from 'mongoose'
import WishlistHeader from './components/WishlistHeader'
import WishlistClient, { WishlistProduct } from './components/WishlistClient'

// Ensure VendorProductModel is registered
import '@/lib/modules/product/vendorProduct.model'

async function getUserWishlist(userId: string): Promise<WishlistProduct[]> {
  await dbConnect()
  
  if (!Types.ObjectId.isValid(userId)) {
    return []
  }

  try {
    const result = await WishlistModel.find({ userID: new Types.ObjectId(userId) })
      .populate({
        path: 'productID',
        select: 'productTitle thumbnailImage photoGallery productPrice discountPrice _id',
        model: 'VendorProductModel'
      })
      .sort({ createdAt: -1 })
      .lean()
    
    // Transform the result to match WishlistProduct interface
    // Convert all ObjectIds to strings and ensure proper serialization
    return result.map((item: unknown) => {
      type RawWishlistItem = {
        _id?: { toString?: () => string } | string | unknown
        wishlistID?: string
        productID?: {
          _id?: { toString?: () => string } | string | unknown
          productTitle?: string
          thumbnailImage?: string
          photoGallery?: string[]
          productPrice?: number
          discountPrice?: number
        } | string
        createdAt?: Date | string
      }
      
      const wishlistItem = item as RawWishlistItem
      
      // Convert _id to string if it's an ObjectId/Buffer
      const id = (wishlistItem._id && typeof wishlistItem._id === 'object' && 'toString' in wishlistItem._id && typeof wishlistItem._id.toString === 'function')
        ? wishlistItem._id.toString()
        : String(wishlistItem._id || '')
      
      // Handle productID - convert if it's populated (object) or keep as string
      let productID: WishlistProduct['productID']
      if (wishlistItem.productID && typeof wishlistItem.productID === 'object' && !Array.isArray(wishlistItem.productID)) {
        // Product is populated
        const populatedProduct = wishlistItem.productID as {
          _id?: { toString?: () => string } | string | unknown
          productTitle?: string
          thumbnailImage?: string
          photoGallery?: string[]
          productPrice?: number
          discountPrice?: number
        }
        
        const productId = (populatedProduct._id && typeof populatedProduct._id === 'object' && 'toString' in populatedProduct._id && typeof populatedProduct._id.toString === 'function')
          ? populatedProduct._id.toString()
          : String(populatedProduct._id || '')
        
        productID = {
          _id: productId,
          productTitle: populatedProduct.productTitle || '',
          thumbnailImage: populatedProduct.thumbnailImage || '',
          photoGallery: Array.isArray(populatedProduct.photoGallery) ? populatedProduct.photoGallery : undefined,
          productPrice: populatedProduct.productPrice || 0,
          discountPrice: populatedProduct.discountPrice
        }
      } else {
        // Product is just an ID string
        productID = String(wishlistItem.productID || '')
      }
      
      // Convert createdAt to string
      let createdAt: string
      if (wishlistItem.createdAt instanceof Date) {
        createdAt = wishlistItem.createdAt.toISOString()
      } else if (wishlistItem.createdAt) {
        createdAt = String(wishlistItem.createdAt)
      } else {
        createdAt = new Date().toISOString()
      }
      
      return {
        _id: id,
        wishlistID: String(wishlistItem.wishlistID || ''),
        productID: productID,
        createdAt: createdAt
      } as WishlistProduct
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return []
  }
}

export default async function UserWishlistPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/')
  }

  const userLike = (session.user ?? {}) as { id?: string; _id?: string }
  const userId = userLike._id || userLike.id

  if (!userId) {
    redirect('/')
  }

  const wishlistItems = await getUserWishlist(userId)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WishlistHeader itemCount={wishlistItems.length} />
        <WishlistClient initialWishlistItems={wishlistItems} />
      </div>
    </div>
  )
}
