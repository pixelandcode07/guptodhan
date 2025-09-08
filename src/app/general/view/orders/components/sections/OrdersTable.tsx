import { DataTable } from '@/components/TableHelper/data-table'
import { OrderRow, ordersColumns } from '@/components/TableHelper/orders_columns'

const data: OrderRow[] = [
    { id: '1', sl: 1, orderNo: '1753607894617', orderDate: '2025-08-27', from: 'Mobile App', name: 'Etti Ahmed Tanjil', phone: '01333061763', total: 2400, payment: 'Unpaid', status: 'Pending' },
]

export default function OrdersTable() {
    return (
        <DataTable columns={ordersColumns} data={data} />
    )
}


