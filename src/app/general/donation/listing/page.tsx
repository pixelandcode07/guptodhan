import { DataTable } from '@/components/TableHelper/data-table'
import { donation_listing, DonationListingDataType } from '@/components/TableHelper/donation_listing'
import { Input } from '@/components/ui/input'




const getData = async (): Promise<DonationListingDataType[]> => {
    return [
        {
            serial: '1',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Shannon-Knight',
            slug: 'Shannon-Knight LLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'pending',

        },
        {
            serial: '2',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Meyer LLC',
            slug: 'Meyer LLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'active',

        },
        {
            serial: '3',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Thompson-Cruz',
            slug: 'Thompson-Cruz Ltd.',
            total_item: 10,
            donated_by: "Shifat",
            status: 'pending',

        },
        {
            serial: '4',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Frank, Zavala and Williams',
            slug: 'Frank PLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'inactive',

        },
        {
            serial: '5',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Fuentes PLC',
            slug: 'Fuentes PLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'pending',

        },
        {
            serial: '6',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Carroll PLC',
            slug: 'Carroll PLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'inactive',

        },
        {
            serial: '7',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Mccarthy and Sons',
            slug: 'Mccarthy & Sons',
            total_item: 10,
            donated_by: "Shifat",
            status: 'active',

        },
        {
            serial: '8',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Adams and Sons',
            slug: 'Adams & Sons',
            total_item: 10,
            donated_by: "Shifat",
            status: 'active',

        },
        {
            serial: '9',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Reynolds-Wilson',
            slug: 'Reynolds-Wilson Ltd.',
            total_item: 10,
            donated_by: "Shifat",
            status: 'active',

        },
        {
            serial: '10',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Petty, Garcia and Hurst',
            slug: 'Petty PLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'inactive',

        },
        {
            serial: '11',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Rivas-Ortiz',
            slug: 'Rivas-Ortiz Ltd.',
            total_item: 10,
            donated_by: "Shifat",
            status: 'inactive',

        },
        {
            serial: '12',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Everett-Smith',
            slug: 'Everett-Smith LLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'pending',

        },
        {
            serial: '13',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Wright, Jones and Valentine',
            slug: 'Wright Group',
            total_item: 10,
            donated_by: "Shifat",
            status: 'pending',

        },
        {
            serial: '14',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Owens-Hoffman',
            slug: 'Owens-Hoffman Ltd.',
            total_item: 10,
            donated_by: "Shifat",
            status: 'active',

        },
        {
            serial: '15',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Guerrero, Obrien and Atkinson',
            slug: 'Guerrero LLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'active',

        },
        {
            serial: '16',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Leblanc LLC',
            slug: 'Leblanc LLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'pending',

        },
        {
            serial: '17',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Miller Group',
            slug: 'Miller Group',
            total_item: 10,
            donated_by: "Shifat",
            status: 'pending',

        },
        {
            serial: '18',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Shea, Jenkins and Moore',
            slug: 'Shea PLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'inactive',

        },
        {
            serial: '19',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Turner-Harris',
            slug: 'Turner-Harris Ltd.',
            total_item: 10,
            donated_by: "Shifat",
            status: 'active',

        },
        {
            serial: '20',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Rosales-Dominguez',
            slug: 'Rosales-Dominguez LLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'active',

        },
        {
            serial: '21',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Sanders-Myers',
            slug: 'Sanders LLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'active',

        },
        {
            serial: '22',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Tran PLC',
            slug: 'Tran PLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'inactive',

        },
        {
            serial: '23',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Padilla Group',
            slug: 'Padilla LLC',
            total_item: 10,
            donated_by: "Shifat",
            status: 'inactive',

        }
    ]

}

export default async function DonationListing() {
    const data = await getData();
    return (
        <div className="m-5 p-5 border ">
            <div >
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Category List</span>
                </h1>
            </div>
            <div className="md:flex justify-between my-5 space-y-2.5">
                <p>Show (Pagination) entries</p>
                <span className="md:flex gap-4 space-y-2.5">
                    <span className="flex items-center gap-2">
                        Search:
                        <Input type="text" className="border border-gray-500" />
                    </span>
                </span>
            </div>
            <DataTable columns={donation_listing} data={data} />
        </div>
    )
}
