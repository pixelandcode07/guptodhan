import { ShoppingCart, TrendingUp, Smile, Trash2 } from 'lucide-react'

export default function OrdersStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb]">
                <p className='text-xs text-gray-500'>Total Pending Orders</p>
                <p className='text-lg font-semibold'>৳ 13,599.00</p>
                <span className='absolute right-3 top-3 text-yellow-500/90'>
                    <ShoppingCart size={18} />
                </span>
            </div>
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb]">
                <p className='text-xs text-gray-500'>Total Approved Orders</p>
                <p className='text-lg font-semibold'>৳ 1,950.00</p>
                <span className='absolute right-3 top-3 text-blue-500/90'>
                    <TrendingUp size={18} />
                </span>
            </div>
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb]">
                <p className='text-xs text-gray-500'>Total Delivered Orders</p>
                <p className='text-lg font-semibold'>৳ 2,150.00</p>
                <span className='absolute right-3 top-3 text-green-600/90'>
                    <Smile size={18} />
                </span>
            </div>
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb]">
                <p className='text-xs text-gray-500'>Total Cancelled Orders</p>
                <p className='text-lg font-semibold'>৳ 1,100.00</p>
                <span className='absolute right-3 top-3 text-rose-600/90'>
                    <Trash2 size={18} />
                </span>
            </div>
        </div>
    );
}


