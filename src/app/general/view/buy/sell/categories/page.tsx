import { DataTable } from '@/components/TableHelper/data-table'
import { BuySellDataType, view_buy_sell_columns } from '@/components/TableHelper/view_buy_sell_columns'
import { Input } from '@/components/ui/input'




const getData = async (): Promise<BuySellDataType[]> => {
    return [
        {
            serial: '1',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Shannon-Knight',
            slug: 'Shannon-Knight LLC',
            status: 'pending',

        },
        {
            serial: '2',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Meyer LLC',
            slug: 'Meyer LLC',
            status: 'active',

        },
        {
            serial: '3',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Thompson-Cruz',
            slug: 'Thompson-Cruz Ltd.',
            status: 'pending',

        },
        {
            serial: '4',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Frank, Zavala and Williams',
            slug: 'Frank PLC',
            status: 'inactive',

        },
        {
            serial: '5',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Fuentes PLC',
            slug: 'Fuentes PLC',
            status: 'pending',

        },
        {
            serial: '6',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Carroll PLC',
            slug: 'Carroll PLC',
            status: 'inactive',

        },
        {
            serial: '7',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Mccarthy and Sons',
            slug: 'Mccarthy & Sons',
            status: 'active',

        },
        {
            serial: '8',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Adams and Sons',
            slug: 'Adams & Sons',
            status: 'active',

        },
        {
            serial: '9',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Reynolds-Wilson',
            slug: 'Reynolds-Wilson Ltd.',
            status: 'active',

        },
        {
            serial: '10',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Petty, Garcia and Hurst',
            slug: 'Petty PLC',
            status: 'inactive',

        },
        {
            serial: '11',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Rivas-Ortiz',
            slug: 'Rivas-Ortiz Ltd.',
            status: 'inactive',

        },
        {
            serial: '12',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Everett-Smith',
            slug: 'Everett-Smith LLC',
            status: 'pending',

        },
        {
            serial: '13',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Wright, Jones and Valentine',
            slug: 'Wright Group',
            status: 'pending',

        },
        {
            serial: '14',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Owens-Hoffman',
            slug: 'Owens-Hoffman Ltd.',
            status: 'active',

        },
        {
            serial: '15',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Guerrero, Obrien and Atkinson',
            slug: 'Guerrero LLC',
            status: 'active',

        },
        {
            serial: '16',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Leblanc LLC',
            slug: 'Leblanc LLC',
            status: 'pending',

        },
        {
            serial: '17',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Miller Group',
            slug: 'Miller Group',
            status: 'pending',

        },
        {
            serial: '18',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Shea, Jenkins and Moore',
            slug: 'Shea PLC',
            status: 'inactive',

        },
        {
            serial: '19',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Turner-Harris',
            slug: 'Turner-Harris Ltd.',
            status: 'active',

        },
        {
            serial: '20',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Rosales-Dominguez',
            slug: 'Rosales-Dominguez LLC',
            status: 'active',

        },
        {
            serial: '21',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Sanders-Myers',
            slug: 'Sanders LLC',
            status: 'active',

        },
        {
            serial: '22',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Tran PLC',
            slug: 'Tran PLC',
            status: 'inactive',

        },
        {
            serial: '23',
            store_logo: 'https://static.vecteezy.com/system/resources/previews/019/166/318/non_2x/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg',
            category_name: 'Padilla Group',
            slug: 'Padilla LLC',
            status: 'inactive',

        }
    ]

}

export default async function ViewBuySellCategories() {
    const data = await getData();
    return (
        <div className="m-5 p-5 shadow-sm border border-gray-200 rounded-md bg-white transition-all duration-300 hover:shadow-lg hover:border-gray-300">
            <div className='py-5'>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Category List</span>
                </h1>
            </div>
            {/* <DataTable columns={view_buy_sell_columns} data={data} /> */}
            <DataTable
                columns={view_buy_sell_columns}
                data={data}
                rearrangePath="/general/rearrange/buy/sell/categories"
            />
        </div>
    )
}
