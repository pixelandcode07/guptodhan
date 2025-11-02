interface WishlistHeaderProps {
  itemCount: number
}

export default function WishlistHeader({ itemCount }: WishlistHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
      <p className="text-gray-600 mt-2">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} in your wishlist
      </p>
    </div>
  )
}

