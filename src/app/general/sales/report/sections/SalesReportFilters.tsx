'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SalesReportFilters() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderStatus, setOrderStatus] = useState<string | undefined>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined);

  const onGenerate = () => {
    const payload = {
      startDate,
      endDate,
      orderStatus,
      paymentStatus,
      paymentMethod,
    };
    // TODO: hook up API once available
    // For now, log to verify values
    console.log('Generate Sales Report with:', payload);
  };

  return (
    <div className="border border-[#e4e7eb] rounded-xs">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
        <div>
          <Label className="mb-1 block">Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1 block">End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1 block">Order Status</Label>
          <Select value={orderStatus} onValueChange={setOrderStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="intransit">Intransit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Payment Status</Label>
          <Select value={paymentStatus} onValueChange={setPaymentStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="success">Payment Successfull</SelectItem>
              <SelectItem value="failed">Payment Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Change Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cod">Cash On Delivery</SelectItem>
              <SelectItem value="bkash">Bkash</SelectItem>
              <SelectItem value="nagad">Nagad</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-end p-4 border-t border-[#e4e7eb]">
        <Button onClick={onGenerate}>
          ⇄ Generate Report
        </Button>
      </div>
    </div>
  );
}


