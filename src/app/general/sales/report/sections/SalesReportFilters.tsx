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
import { DataTable } from '@/components/TableHelper/data-table';
import { OrderReport, sales_report_columns } from '@/components/TableHelper/sales_report_columns';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Printer, Download } from 'lucide-react';

export default function SalesReportClient() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderStatus, setOrderStatus] = useState<string | undefined>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined);

  const [reportData, setReportData] = useState<OrderReport[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const onGenerate = async () => {
    if (!token) return toast.error("Authentication required.");
    setIsLoading(true);
    setReportData(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (orderStatus) params.append('orderStatus', orderStatus);
      if (paymentStatus) params.append('paymentStatus', paymentStatus);
      if (paymentMethod) params.append('paymentMethod', paymentMethod);

      const res = await axios.get(`/api/v1/product-order/reports/sales?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setReportData(res.data.data);
        toast.success(`Report generated with ${res.data.data.length} orders.`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!reportData || reportData.length === 0) {
      toast.error('No data to print. Please generate a report first.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print the report.');
      return;
    }

    // Calculate totals
    const totalOrders = reportData.length;
    const totalAmount = reportData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalDeliveryCharge = reportData.reduce((sum, order) => sum + (order.deliveryCharge || 0), 0);

    // Generate filter summary
    const filterSummary = [];
    if (startDate) filterSummary.push(`Start Date: ${startDate}`);
    if (endDate) filterSummary.push(`End Date: ${endDate}`);
    if (orderStatus) filterSummary.push(`Order Status: ${orderStatus}`);
    if (paymentStatus) filterSummary.push(`Payment Status: ${paymentStatus}`);
    if (paymentMethod) filterSummary.push(`Payment Method: ${paymentMethod}`);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            .header h1 {
              font-size: 24px;
              margin-bottom: 5px;
            }
            .header p {
              color: #666;
              font-size: 14px;
            }
            .filters {
              background: #f5f5f5;
              padding: 15px;
              margin-bottom: 20px;
              border-radius: 5px;
            }
            .filters h3 {
              font-size: 16px;
              margin-bottom: 10px;
            }
            .filters p {
              font-size: 13px;
              color: #555;
              margin-bottom: 5px;
            }
            .summary {
              display: flex;
              justify-content: space-around;
              margin-bottom: 20px;
              gap: 10px;
            }
            .summary-card {
              flex: 1;
              background: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              text-align: center;
              border: 1px solid #ddd;
            }
            .summary-card h4 {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            .summary-card p {
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #333;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            @media print {
              .no-print { display: none; }
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Sales Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>

          ${filterSummary.length > 0 ? `
            <div class="filters">
              <h3>Applied Filters:</h3>
              ${filterSummary.map(f => `<p>${f}</p>`).join('')}
            </div>
          ` : ''}

          <div class="summary">
            <div class="summary-card">
              <h4>Total Orders</h4>
              <p>${totalOrders}</p>
            </div>
            <div class="summary-card">
              <h4>Total Amount</h4>
              <p>৳${totalAmount.toFixed(2)}</p>
            </div>
            <div class="summary-card">
              <h4>Delivery Charges</h4>
              <p>৳${totalDeliveryCharge.toFixed(2)}</p>
            </div>
            <div class="summary-card">
              <h4>Net Revenue</h4>
              <p>৳${(totalAmount - totalDeliveryCharge).toFixed(2)}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Method</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map(order => `
                <tr>
                  <td>${order.orderId || 'N/A'}</td>
                  <td>${order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                  <td>${order.shippingName || 'N/A'}</td>
                  <td>${order.orderStatus || 'N/A'}</td>
                  <td>${order.paymentStatus || 'N/A'}</td>
                  <td>${order.paymentMethod || 'N/A'}</td>
                  <td>৳${(order.totalAmount || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>This is a computer-generated report. No signature required.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleExportCSV = () => {
    if (!reportData || reportData.length === 0) {
      toast.error('No data to export. Please generate a report first.');
      return;
    }

    // Create CSV content
    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'City', 'Order Status', 'Payment Status', 'Payment Method', 'Delivery Charge', 'Total Amount'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(order => [
        order.orderId || '',
        order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '',
        order.shippingName || '',
        order.shippingPhone || '',
        order.shippingCity || '',
        order.orderStatus || '',
        order.paymentStatus || '',
        order.paymentMethod || '',
        order.deliveryCharge || 0,
        order.totalAmount || 0
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV file downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="border border-[#e4e7eb] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
          <div>
            <Label className="mb-1 block">Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">End Date</Label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Order Status</Label>
            <Select value={orderStatus} onValueChange={setOrderStatus}>
              <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">Payment Status</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger><SelectValue placeholder="All Methods" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">Cash On Delivery</SelectItem>
                <SelectItem value="card">Online (Card/Mobile)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[#e4e7eb]">
          <Button onClick={onGenerate} disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Generate Report
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
        </div>
      )}

      {reportData && reportData.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {reportData.length} orders
            </p>
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
            </div>
          </div>
          <div className="border border-[#e4e7eb] rounded-lg">
            <DataTable columns={sales_report_columns} data={reportData} />
          </div>
        </div>
      )}

      {reportData && reportData.length === 0 && (
        <div className="text-center py-10 border border-[#e4e7eb] rounded-lg">
          <p className="text-gray-500">No orders found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}