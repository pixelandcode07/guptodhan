import { Label } from '@/components/ui/label'

export default function OrdersFilters() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div>
                <Label className='mb-1 block'>Order No</Label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='12354698' />
            </div>
            <div>
                <Label className='mb-1 block'>Source</Label>
                <select className='h-10 w-full border border-gray-300 rounded px-3'>
                    <option>Select One</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block'>Payment Status</Label>
                <select className='h-10 w-full border border-gray-300 rounded px-3'>
                    <option>Select One</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block'>Customer Name</Label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='Mr/Mrs.' />
            </div>
            <div>
                <Label className='mb-1 block'>Customer Phone</Label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='+8801' />
            </div>
            <div>
                <Label className='mb-1 block'>Order Status</Label>
                <select className='h-10 w-full border border-gray-300 rounded px-3'>
                    <option>Select One</option>
                </select>
            </div>
            <div className='md:col-span-2'>
                <Label className='mb-1 block'>Ordered Product</Label>
                <select className='h-10 w-full border border-gray-300 rounded px-3'>
                    <option>Select One</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block'>Delivery Method</Label>
                <select className='h-10 w-full border border-gray-300 rounded px-3'>
                    <option>Select One</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block'>Coupon Code</Label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='ex. OFF10' />
            </div>
            <div className='md:col-span-2'>
                <Label className='mb-1 block'>Purchase Date Range</Label>
                <input className='h-10 w-full border border-gray-300 rounded px-3' placeholder='-'
                />
            </div>
            <div>
                <button className='h-10 bg-rose-600 text-white rounded px-4 w-max'>Clear Filters</button>
            </div>
        </div>
    );
}


