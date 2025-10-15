import { Label } from '@/components/ui/label'

export default function OrdersFilters() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 items-end">
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Order No</Label>
                <input className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' placeholder='12354698' />
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Source</Label>
                <select className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'>
                    <option>Select One</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Payment Status</Label>
                <select className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'>
                    <option>Select One</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Customer Name</Label>
                <input className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' placeholder='Mr/Mrs.' />
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Customer Phone</Label>
                <input className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' placeholder='+8801' />
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Order Status</Label>
                <select className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'>
                    <option>Select One</option>
                </select>
            </div>
            <div className='sm:col-span-2'>
                <Label className='mb-1 block text-xs md:text-sm'>Ordered Product</Label>
                <select className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'>
                    <option>Select One</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Delivery Method</Label>
                <select className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'>
                    <option>Select One</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Coupon Code</Label>
                <input className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' placeholder='ex. OFF10' />
            </div>
            <div className='sm:col-span-2'>
                <Label className='mb-1 block text-xs md:text-sm'>Purchase Date Range</Label>
                <input className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' placeholder='-'
                />
            </div>
            <div>
                <button className='h-10 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition text-white rounded-md px-4 w-full sm:w-max text-sm'>Clear Filters</button>
            </div>
        </div>
    );
}


