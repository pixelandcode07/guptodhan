export const dynamic = 'force-dynamic'
import Image from 'next/image'

import demo_products_img from '../../../../../../../public/img/demo_products_img.png'
import { Button } from '@/components/ui/button'

export default function RemoveDemoProducts() {
    return (
        <div className='m-5 p-5 border'>
            <div >
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Remove Demo Products</span>
                </h1>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6  mb-2'>
                <div className="image">
                    <Image src={demo_products_img} alt="Demo Products" width={500} height={300} />
                </div>
                <div className='mt-10 space-y-20'>
                    <div className="des">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt rem aperiam quae? Esse numquam perferendis, eveniet similique quod necessitatibus, iste velit unde illum amet accusantium excepturi fugiat quibusdam cum doloribus! Repudiandae quos praesentium at ullam commodi enim, corrupti aperiam facere accusamus officiis, explicabo soluta excepturi officia iure sit quisquam reiciendis.
                    </div>
                    <Button className='bg-red-700 hover:bg-red-700 text-white cursor-pointer w-full'>Remove Demo Products</Button>
                </div>
            </div>
        </div>
    )
}
