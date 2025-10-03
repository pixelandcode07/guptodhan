import { buySellListing_columns, BuySellListingType } from '@/components/TableHelper/buySellListing_columns'
import { DataTable } from '@/components/TableHelper/data-table'
import { Input } from '@/components/ui/input'



const getBuySellListing = async (): Promise<BuySellListingType[]> => {
    return [
        {
            serial: '1',
            category: 'Gadaget',
            product_image: 'https://www.publicdomainpictures.net/pictures/260000/nahled/photographer-sunset-evening-sky.jpg',
            title: 'Smart watch',
            price: 1000,
            discount: 10,
            phone: '+91 9876543210',
            postedBy: 'Shannon-Knight',
            status: 'approved',
        },
        {
            serial: '2',
            category: 'Gadaget',
            product_image: 'https://www.publicdomainpictures.net/pictures/260000/nahled/photographer-sunset-evening-sky.jpg',
            title: 'Smart watch',
            price: 1000,
            discount: 10,
            phone: '+91 9876543210',
            postedBy: 'Shannon-Knight',
            status: 'pending',
        },
        {
            serial: '3',
            category: 'Gadaget',
            product_image: 'https://www.publicdomainpictures.net/pictures/260000/nahled/photographer-sunset-evening-sky.jpg',
            title: 'Smart watch',
            price: 1000,
            discount: 10,
            phone: '+91 9876543210',
            postedBy: 'Shannon-Knight',
            status: 'rejected',
        }
    ]

}

export default async function BuySellListing() {
    const buySellListing = await getBuySellListing()
    return (
        <>
            <div className='py-5'>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Buy Sell Listing</span>
                </h1>
            </div>


            <div>
                <DataTable columns={buySellListing_columns} data={buySellListing} />
            </div>
        </>
    )
}
