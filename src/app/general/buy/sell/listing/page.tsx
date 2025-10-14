import { buySellListing_columns, BuySellListingType } from '@/components/TableHelper/buySellListing_columns'
import { DataTable } from '@/components/TableHelper/data-table'
import { Input } from '@/components/ui/input'



const getBuySellListing = async (): Promise<BuySellListingType[]> => {
    return [
        {
            id: '1',
            serial: 'Gadaget',
            product_name: 'Smart watch',
            product_image: 'https://www.publicdomainpictures.net/pictures/260000/nahled/photographer-sunset-evening-sky.jpg',
            category: 'phone',
            actual_price: 1020,
            discount_price: 900,
            status: "pending",
            postedBy: 'Shakib',
        },
        {
            id: '2',
            serial: 'Gadaget',
            product_name: 'Smart watch',
            product_image: 'https://www.publicdomainpictures.net/pictures/260000/nahled/photographer-sunset-evening-sky.jpg',
            category: 'watch',
            actual_price: 1500,
            discount_price: 500,
            status: "approved",
            postedBy: 'Tasif',
        },
        {
            id: '3',
            serial: 'Gadaget',
            product_name: 'Smart watch',
            product_image: 'https://www.publicdomainpictures.net/pictures/260000/nahled/photographer-sunset-evening-sky.jpg',
            category: 'watch',
            actual_price: 2000,
            discount_price: 1200,
            status: "rejected",
            postedBy: 'Shawon',
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
