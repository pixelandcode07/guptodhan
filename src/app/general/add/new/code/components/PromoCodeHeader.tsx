export default function PromoCodeHeader() {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-green-100 rounded-lg">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create Promo Code</h1>
          <p className="text-sm text-gray-600">Add a new discount code for your customers</p>
        </div>
      </div>
    </div>
  )
}


