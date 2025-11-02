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
    return result.map((item: unknown) => {
      const wishlistItem = item as {
        _id: string
        wishlistID: string
        productID: {
          _id: string
          productTitle: string
          thumbnailImage: string
          photoGallery?: string[]
          productPrice: number
          discountPrice?: number
        } | string
        createdAt: Date | string
      }
      
      return {
        _id: wishlistItem._id,
        wishlistID: wishlistItem.wishlistID,
        productID: wishlistItem.productID,
        createdAt: wishlistItem.createdAt instanceof Date 
          ? wishlistItem.createdAt.toISOString() 
          : String(wishlistItem.createdAt)
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
