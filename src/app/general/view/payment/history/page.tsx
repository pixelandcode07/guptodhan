import { payment_history_columns, PaymentHistoryData } from '@/components/TableHelper/payment_history_columns'
import { DataTable } from '@/components/TableHelper/data-table'
import { Input } from '@/components/ui/input'
import React from 'react'

const getPaymentHistoryData = async (): Promise<PaymentHistoryData[]> => {
  return [
    {
      serial: '1',
      payment_through: 'COD',
      transaction_id: '',
      card_type: '',
      card_brand: '',
      amount: 2400,
      store_amount: 2400,
      currency: 'BDT',
      bank_tran_id: '',
      datetime: '2025-08-27 21:14:54',
      status: 'VALID'
    },
    {
      serial: '2',
      payment_through: 'COD',
      transaction_id: '',
      card_type: '',
      card_brand: '',
      amount: 200,
      store_amount: 200,
      currency: 'BDT',
      bank_tran_id: '',
      datetime: '2025-08-01 18:53:30',
      status: 'VALID'
    },
    {
      serial: '3',
      payment_through: 'COD',
      transaction_id: '',
      card_type: '',
      card_brand: '',
      amount: 3350,
      store_amount: 3350,
      currency: 'BDT',
      bank_tran_id: '',
      datetime: '2025-07-28 15:42:12',
      status: 'VALID'
    },
    {
      serial: '4',
      payment_through: 'COD',
      transaction_id: '',
      card_type: '',
      card_brand: '',
      amount: 5359,
      store_amount: 5359,
      currency: 'BDT',
      bank_tran_id: '',
      datetime: '2025-07-25 12:30:45',
      status: 'VALID'
    },
    {
      serial: '5',
      payment_through: 'COD',
      transaction_id: '',
      card_type: '',
      card_brand: '',
      amount: 2290,
      store_amount: 2290,
      currency: 'BDT',
      bank_tran_id: '',
      datetime: '2025-07-20 09:15:30',
      status: 'VALID'
    },
    {
      serial: '6',
      payment_through: 'Credit Card',
      transaction_id: 'TXN123456789',
      card_type: 'Visa',
      card_brand: 'Visa',
      amount: 1500,
      store_amount: 1500,
      currency: 'BDT',
      bank_tran_id: 'BANK789456123',
      datetime: '2025-07-18 14:22:15',
      status: 'VALID'
    },
    {
      serial: '7',
      payment_through: 'Mobile Banking',
      transaction_id: 'MB987654321',
      card_type: '',
      card_brand: '',
      amount: 3200,
      store_amount: 3200,
      currency: 'BDT',
      bank_tran_id: 'BKASH456789123',
      datetime: '2025-07-15 16:45:20',
      status: 'PENDING'
    },
    {
      serial: '8',
      payment_through: 'Credit Card',
      transaction_id: 'TXN456789123',
      card_type: 'Mastercard',
      card_brand: 'Mastercard',
      amount: 4500,
      store_amount: 4500,
      currency: 'BDT',
      bank_tran_id: 'BANK123789456',
      datetime: '2025-07-12 11:30:45',
      status: 'INVALID'
    },
    {
      serial: '9',
      payment_through: 'COD',
      transaction_id: '',
      card_type: '',
      card_brand: '',
      amount: 1800,
      store_amount: 1800,
      currency: 'BDT',
      bank_tran_id: '',
      datetime: '2025-07-10 13:20:30',
      status: 'VALID'
    },
    {
      serial: '10',
      payment_through: 'Mobile Banking',
      transaction_id: 'MB123456789',
      card_type: '',
      card_brand: '',
      amount: 2800,
      store_amount: 2800,
      currency: 'BDT',
      bank_tran_id: 'ROCKET789123456',
      datetime: '2025-07-08 10:15:25',
      status: 'VALID'
    }
  ]
}

export default async function PaymentHistory() {
  const data = await getPaymentHistoryData();
  
  return (
    <div className="m-5 p-5 border">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Order Payment History</span>
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
      <DataTable columns={payment_history_columns} data={data} />
    </div>
  )
}
