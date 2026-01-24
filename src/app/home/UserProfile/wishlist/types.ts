export interface WishlistProduct {
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
  color?: string
  size?: string
  createdAt: string
}

