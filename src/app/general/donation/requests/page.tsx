import { DataTable } from '@/components/TableHelper/data-table'
import { donation_request, DonationReqDataType } from '@/components/TableHelper/donation_request'
import { Input } from '@/components/ui/input'




const getData = async (): Promise<DonationReqDataType[]> => {
    return [
        {
            serial: '1',
            user_name: 'Shannon-Knight',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'pending',
        },
        {
            serial: '2',
            user_name: 'Meyer LLC',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'active',

        },
        {
            serial: '3',
            user_name: 'Thompson-Cruz',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'pending',

        },
        {
            serial: '4',
            user_name: 'Frank, Zavala and Williams',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'inactive',

        },
        {
            serial: '5',
            user_name: 'Fuentes PLC',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'pending',

        },
        {
            serial: '6',
            user_name: 'Carroll PLC',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'inactive',

        },
        {
            serial: '7',
            user_name: 'Mccarthy and Sons',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'active',

        },
        {
            serial: '8',
            user_name: 'Adams and Sons',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'active',

        },
        {
            serial: '9',
            user_name: 'Reynolds-Wilson',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'active',

        },
        {
            serial: '10',
            user_name: 'Petty, Garcia and Hurst',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'inactive',

        },
        {
            serial: '11',
            user_name: 'Rivas-Ortiz',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'inactive',

        },
        {
            serial: '12',
            user_name: 'Everett-Smith',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'pending',

        },
        {
            serial: '13',
            user_name: 'Wright, Jones and Valentine',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'pending',

        },
        {
            serial: '14',
            user_name: 'Owens-Hoffman',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'active',

        },
        {
            serial: '15',
            user_name: 'Guerrero, Obrien and Atkinson',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'active',

        },
        {
            serial: '16',
            user_name: 'Leblanc LLC',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'pending',

        },
        {
            serial: '17',
            user_name: 'Miller Group',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'pending',

        },
        {
            serial: '18',
            user_name: 'Shea, Jenkins and Moore',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'inactive',

        },
        {
            serial: '19',
            user_name: 'Turner-Harris',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'active',

        },
        {
            serial: '20',
            user_name: 'Rosales-Dominguez',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'active',

        },
        {
            serial: '21',
            user_name: 'Sanders-Myers',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'active',

        },
        {
            serial: '22',
            user_name: 'Tran PLC',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'inactive',

        },
        {
            serial: '23',
            user_name: 'Padilla Group',
            user_email: 'user@gmail.com',
            user_mobile: +8645685565510,
            adress: 'Dhaka',
            message: "This is a Good Product",
            status: 'inactive',

        }
    ]

}

export default async function DonationRequest() {
    const data = await getData();
    return (
        <div className="m-5 p-5 border ">
            <div >
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Donation Request</span>
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
            <DataTable columns={donation_request} data={data} />
        </div>
    )
}
