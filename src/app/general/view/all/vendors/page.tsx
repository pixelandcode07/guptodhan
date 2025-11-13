// import { approved_vendor_columns, Payment } from '@/components/TableHelper/approved_vendor_columns'
// import { DataTable } from '@/components/TableHelper/data-table'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Download } from 'lucide-react'



// const getData = async (): Promise<Payment[]> => {
//     return [
//         {
//             serial: '1',
//             vendor_id: 1,
//             owner_name: 'Jimmy',
//             owner_email: 'wendy26@vasquez.com',
//             owner_phone: '01867290988',
//             Business_name: 'Shannon-Knight',
//             trade_license_number: 41870791677,
//             store: 'No',
//             status: 'pending',
//             created_at: '2024-09-03',
//         },
//         {
//             serial: '2',
//             vendor_id: 2,
//             owner_name: 'Heather',
//             owner_email: 'jameswheeler@ingram-jones.info',
//             owner_phone: '01778024863',
//             Business_name: 'Meyer LLC',
//             trade_license_number: 87704912830,
//             store: 'No',
//             status: "active",
//             created_at: '2024-01-08',
//         },
//         {
//             serial: '3',
//             vendor_id: 3,
//             owner_name: 'Melissa',
//             owner_email: 'taylorparker@hotmail.com',
//             owner_phone: '01597314742',
//             Business_name: 'Thompson-Cruz',
//             trade_license_number: 22481898956,
//             store: 'No',
//             status: 'pending',
//             created_at: '2024-10-03',
//         },
//         {
//             serial: '4',
//             vendor_id: 4,
//             owner_name: 'Andrea',
//             owner_email: 'jonathan73@moore.com',
//             owner_phone: '01335177003',
//             Business_name: 'Frank, Zavala and Williams',
//             trade_license_number: 90588177896,
//             store: 'No',
//             status: "inactive",
//             created_at: '2024-12-27',
//         },
//         {
//             serial: '5',
//             vendor_id: 5,
//             owner_name: 'Jeremy',
//             owner_email: 'harrislydia@neal.org',
//             owner_phone: '01469494982',
//             Business_name: 'Fuentes PLC',
//             trade_license_number: 93364266452,
//             store: 'Yes',
//             status: 'pending',
//             created_at: '2025-04-05',
//         },
//         {
//             serial: '6',
//             vendor_id: 6,
//             owner_name: 'Renee',
//             owner_email: 'jayraymond@greene.com',
//             owner_phone: '01547616447',
//             Business_name: 'Carroll PLC',
//             trade_license_number: 77327304859,
//             store: 'Yes',
//             status: "inactive",
//             created_at: '2023-09-14',
//         },
//         {
//             serial: '7',
//             vendor_id: 7,
//             owner_name: 'William',
//             owner_email: 'millerchristine@gmail.com',
//             owner_phone: '01424640026',
//             Business_name: 'Mccarthy and Sons',
//             trade_license_number: 30216204688,
//             store: 'No',
//             status: "active",
//             created_at: '2025-02-11',
//         },
//         {
//             serial: '8',
//             vendor_id: 8,
//             owner_name: 'Cameron',
//             owner_email: 'michaelamcmahon@gmail.com',
//             owner_phone: '01932201553',
//             Business_name: 'Adams and Sons',
//             trade_license_number: 64161416744,
//             store: 'Yes',
//             status: "active",
//             created_at: '2024-11-08',
//         },
//         {
//             serial: '9',
//             vendor_id: 9,
//             owner_name: 'Lauren',
//             owner_email: 'julie61@yahoo.com',
//             owner_phone: '01448845944',
//             Business_name: 'Reynolds-Wilson',
//             trade_license_number: 94386269097,
//             store: 'No',
//             status: "active",
//             created_at: '2023-09-23',
//         },
//         {
//             serial: '10',
//             vendor_id: 10,
//             owner_name: 'Robert',
//             owner_email: 'shermantodd@ortiz.com',
//             owner_phone: '01584654483',
//             Business_name: 'Petty, Garcia and Hurst',
//             trade_license_number: 37561287209,
//             store: 'No',
//             status: "inactive",
//             created_at: '2024-06-25',
//         },
//         {
//             serial: '11',
//             vendor_id: 11,
//             owner_name: 'Nicholas',
//             owner_email: 'twilliams@gmail.com',
//             owner_phone: '01814442786',
//             Business_name: 'Rivas-Ortiz',
//             trade_license_number: 27030459792,
//             store: 'No',
//             status: "inactive",
//             created_at: '2025-03-10',
//         },
//         {
//             serial: '12',
//             vendor_id: 12,
//             owner_name: 'James',
//             owner_email: 'angela89@gmail.com',
//             owner_phone: '01554494165',
//             Business_name: 'Everett-Smith',
//             trade_license_number: 68713388469,
//             store: 'No',
//             status: 'pending',
//             created_at: '2025-02-10',
//         },
//         {
//             serial: '13',
//             vendor_id: 13,
//             owner_name: 'Jordan',
//             owner_email: 'shannondavies@ball.org',
//             owner_phone: '01428201683',
//             Business_name: 'Wright, Jones and Valentine',
//             trade_license_number: 34357689902,
//             store: 'Yes',
//             status: 'pending',
//             created_at: '2024-10-23',
//         },
//         {
//             serial: '14',
//             vendor_id: 14,
//             owner_name: 'Kevin',
//             owner_email: 'hansenemily@hotmail.com',
//             owner_phone: '01569704128',
//             Business_name: 'Owens-Hoffman',
//             trade_license_number: 23931842003,
//             store: 'Yes',
//             status: "active",
//             created_at: '2024-06-28',
//         },
//         {
//             serial: '15',
//             vendor_id: 15,
//             owner_name: 'Carolyn',
//             owner_email: 'mcneiljon@cox-wallace.biz',
//             owner_phone: '01995059811',
//             Business_name: 'Guerrero, Obrien and Atkinson',
//             trade_license_number: 56827943563,
//             store: 'Yes',
//             status: "active",
//             created_at: '2025-06-01',
//         },
//         {
//             serial: '16',
//             vendor_id: 16,
//             owner_name: 'Debra',
//             owner_email: 'keithperez@gmail.com',
//             owner_phone: '01884908759',
//             Business_name: 'Leblanc LLC',
//             trade_license_number: 97976757324,
//             store: 'Yes',
//             status: 'pending',
//             created_at: '2024-01-01',
//         },
//         {
//             serial: '17',
//             vendor_id: 17,
//             owner_name: 'Nancy',
//             owner_email: 'kellibass@york-mclaughlin.com',
//             owner_phone: '01695589243',
//             Business_name: 'Miller Group',
//             trade_license_number: 89001077068,
//             store: 'No',
//             status: 'pending',
//             created_at: '2023-12-29',
//         },
//         {
//             serial: '18',
//             vendor_id: 18,
//             owner_name: 'Lisa',
//             owner_email: 'keithbrewer@hotmail.com',
//             owner_phone: '01837056998',
//             Business_name: 'Shea, Jenkins and Moore',
//             trade_license_number: 96108256758,
//             store: 'No',
//             status: "inactive",
//             created_at: '2023-11-13',
//         },
//         {
//             serial: '19',
//             vendor_id: 19,
//             owner_name: 'Marc',
//             owner_email: 'robert19@brown-pitts.info',
//             owner_phone: '01452301547',
//             Business_name: 'Turner-Harris',
//             trade_license_number: 15272078233,
//             store: 'No',
//             status: "active",
//             created_at: '2024-02-22',
//         },
//         {
//             serial: '20',
//             vendor_id: 20,
//             owner_name: 'Marc',
//             owner_email: 'samuel02@gmail.com',
//             owner_phone: '01721065856',
//             Business_name: 'Rosales-Dominguez',
//             trade_license_number: 14885246982,
//             store: 'Yes',
//             status: "active",
//             created_at: '2023-09-17',
//         },
//         {
//             serial: '21',
//             vendor_id: 21,
//             owner_name: 'Carly',
//             owner_email: 'brian68@gmail.com',
//             owner_phone: '01976095142',
//             Business_name: 'Sanders-Myers',
//             trade_license_number: 57128990354,
//             store: 'No',
//             status: "active",
//             created_at: '2025-01-02',
//         },
//         {
//             serial: '22',
//             vendor_id: 22,
//             owner_name: 'Stacey',
//             owner_email: 'miguelramirez@warren.org',
//             owner_phone: '01631778889',
//             Business_name: 'Tran PLC',
//             trade_license_number: 15911132417,
//             store: 'No',
//             status: "inactive",
//             created_at: '2023-11-28',
//         },
//         {
//             serial: '23',
//             vendor_id: 23,
//             owner_name: 'Jorge',
//             owner_email: 'tiffany64@yahoo.com',
//             owner_phone: '01575247509',
//             Business_name: 'Padilla Group',
//             trade_license_number: 84143469031,
//             store: 'Yes',
//             status: "inactive",
//             created_at: '2025-07-07',
//         },
//         {
//             serial: '24',
//             vendor_id: 24,
//             owner_name: 'Bailey',
//             owner_email: 'kimberly58@yahoo.com',
//             owner_phone: '01723688487',
//             Business_name: 'Barnes-Garcia',
//             trade_license_number: 81107969009,
//             store: 'Yes',
//             status: "active",
//             created_at: '2025-02-20',
//         },
//         {
//             serial: '25',
//             vendor_id: 25,
//             owner_name: 'Melissa',
//             owner_email: 'jonathanjones@ward.com',
//             owner_phone: '01839260640',
//             Business_name: 'Hampton-Kirk',
//             trade_license_number: 94609468828,
//             store: 'Yes',
//             status: 'pending',
//             created_at: '2024-07-31',
//         }
//     ]
// }

// export default async function ApprovedVendors() {
//     const data = await getData();
//     const activeVendors = data.filter((vendor) => vendor.status === "active");
//     return (
//         <div className="m-4 p-4 border ">
//             <div className='mb-5'>
//                 <h1 className="text-lg font-semibold border-l-2 border-blue-500">
//                     <span className="pl-5">Category List</span>
//                 </h1>
//             </div>
//             <DataTable columns={approved_vendor_columns} data={activeVendors} />

//         </div>
//     )
// }

// src/app/(admin)/vendors/ApprovedVendors.tsx

import { approved_vendor_columns, Payment } from '@/components/TableHelper/approved_vendor_columns';
import { DataTable } from '@/components/TableHelper/data-table';
import axios from 'axios';

// ক্যাশিং বন্ধ করার জন্য
export const dynamic = 'force-dynamic';

interface VendorFromAPI {
  _id: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  business_name: string;
  trade_license_number: number;
  has_store: boolean;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  verified?: boolean;
}

async function fetchActiveVendors(): Promise<Payment[]> {
  const baseUrl = process.env.NEXTAUTH_URL;

  try {
    const response = await axios.get<{ success: boolean; data: VendorFromAPI[] }>(
      `${baseUrl}/api/v1/vendors`,
      {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
        },
      }
    );

    if (!response.data.success || !Array.isArray(response.data.data)) {
      console.warn('API returned invalid data:', response.data);
      return [];
    }

    const activeVendors = response.data.data
      .filter((vendor) => vendor.status === 'active')
      .map((vendor, index) => ({
        serial: (index + 1).toString(),
        vendor_id: vendor._id,
        owner_name: vendor.owner_name,
        owner_email: vendor.owner_email,
        owner_phone: vendor.owner_phone,
        Business_name: vendor.business_name,
        trade_license_number: vendor.trade_license_number,
        store: vendor.has_store ? 'Yes' : 'No',
        status: vendor.status,
        created_at: new Date(vendor.created_at).toISOString().split('T')[0],
        verified: vendor.verified ? 'Yes' : 'No',
      }));

    return activeVendors;
  } catch (error: any) {
    console.error('Failed to fetch vendors:', error.message);
    return [];
  }
}

export default async function ApprovedVendors() {
  const activeVendors = await fetchActiveVendors();

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-700 border-l-4 border-green-600 pl-3">
          Approved Vendors (Active Only)
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Total Active Vendors: <strong>{activeVendors.length}</strong>
        </p>
      </div>

      {activeVendors.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No active vendors found at the moment.</p>
        </div>
      ) : (
        <DataTable columns={approved_vendor_columns} data={activeVendors} />
      )}
    </div>
  );
}