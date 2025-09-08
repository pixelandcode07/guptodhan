import { DataTable } from '@/components/TableHelper/data-table'
import { OrderRow, ordersColumns } from '@/components/TableHelper/orders_columns'

const data: OrderRow[] = [
    { id: '1', sl: 1, orderNo: '1753607894617', orderDate: '2025-08-27', from: 'Mobile App', name: 'Etti Ahmed Tanjil', phone: '01333061763', total: 2400, payment: 'Unpaid', status: 'Pending' },
    { id: '2', sl: 2, orderNo: '175452809551', orderDate: '2025-08-01', from: 'Mobile App', name: 'Mr X', phone: '01792522355', total: 200, payment: 'Unpaid', status: 'Pending' },
    { id: '3', sl: 3, orderNo: '1753773458929', orderDate: '2025-07-29', from: 'Mobile App', name: 'Ms Y', phone: '01792522355', total: 3350, payment: 'Unpaid', status: 'Pending' },
    { id: '4', sl: 4, orderNo: '1753769354561', orderDate: '2025-07-29', from: 'Mobile App', name: 'MD Sifat Hossain', phone: '01792522355', total: 5359, payment: 'Unpaid', status: 'Pending' },
    { id: '5', sl: 5, orderNo: '1753601068101', orderDate: '2025-07-27', from: 'Mobile App', name: 'Mr Z', phone: '01792522355', total: 2290, payment: 'Unpaid', status: 'Pending' },
]

export default function OrdersTable({ initialStatus }: { initialStatus?: string }) {
    const filtered = Array.isArray(data) && initialStatus
        ? data.filter(d => d.status.toLowerCase() === initialStatus)
        : data
    return (
        <DataTable columns={ordersColumns} data={filtered} />
    )
}


