import { Button } from '@/components/ui/button'

export default function OrdersToolbar() {
    return (
        <div className='flex flex-wrap items-center gap-2 justify-between border border-[#e4e7eb] rounded-xs p-3'>
            <div className='flex items-center gap-2'>
                <span className='text-sm'>All Orders</span>
                <select className='h-9 border border-gray-300 rounded px-2 text-sm'>
                    <option>Select Status</option>
                </select>
                <Button variant={'default'} className='h-9'>Change Selected Orders</Button>
                <Button variant={'default'} className='h-9'>Print Selected Orders</Button>
                <Button variant={'default'} className='h-9'>Courier Status</Button>
            </div>
            <div className='flex items-center gap-2'>
                <span className='text-sm'>Show</span>
                <select className='h-9 border border-gray-300 rounded px-2 text-sm'>
                    <option>20</option>
                </select>
                <span className='text-sm'>entries</span>
                <input className='h-9 border border-gray-300 rounded px-3 text-sm' placeholder='Search:' />
            </div>
        </div>
    )
}


