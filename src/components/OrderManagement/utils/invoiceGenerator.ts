export interface OrderInvoiceData {
  id: string;
  orderNo: string;
  name: string;
  phone: string;
  email?: string;
  total: number;
  deliveryCharge?: number;
  payment: string;
  status: string;
  deliveryMethod?: string;
  trackingId?: string;
  parcelId?: string;
  orderDate?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  store?: {
    name: string;
    id: string;
  };
}

export const generateInvoice = (order: OrderInvoiceData) => {
  const invoiceDate = order.orderDate || new Date().toLocaleDateString('en-GB');
  const invoiceTime = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const deliveryCharge = order.deliveryCharge || 0;
  const subtotal = order.total - deliveryCharge;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice - ${order.orderNo}</title>
    <meta charset="utf-8">
    <style>
        @page {
            margin: 1.5cm;
            size: A4;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1a1a1a;
        }
        .invoice-header-left h1 {
            font-size: 28px;
            color: #1a1a1a;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .invoice-header-left .company-name {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .invoice-header-right {
            text-align: right;
        }
        .invoice-header-right h2 {
            font-size: 20px;
            color: #1a1a1a;
            margin-bottom: 10px;
        }
        .invoice-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        .info-section {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }
        .info-section h3 {
            font-size: 14px;
            color: #1a1a1a;
            margin-bottom: 10px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 5px;
        }
        .info-section p {
            margin: 5px 0;
            font-size: 12px;
            color: #555;
        }
        .info-section .label {
            font-weight: bold;
            color: #333;
            display: inline-block;
            width: 100px;
        }
        .order-details {
            margin: 30px 0;
        }
        .order-details h3 {
            font-size: 16px;
            color: #1a1a1a;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #ddd;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .details-table th {
            background-color: #1a1a1a;
            color: white;
            font-weight: bold;
            padding: 12px;
            text-align: left;
            border: 1px solid #333;
        }
        .details-table td {
            padding: 10px 12px;
            border: 1px solid #ddd;
            vertical-align: top;
        }
        .details-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-section {
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 13px;
        }
        .total-row.final {
            font-size: 18px;
            font-weight: bold;
            color: #1a1a1a;
            border-top: 2px solid #1a1a1a;
            padding-top: 15px;
            margin-top: 10px;
        }
        .invoice-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: bold;
            margin-top: 5px;
        }
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-processing {
            background-color: #cfe2ff;
            color: #084298;
        }
        .status-shipped {
            background-color: #d1ecf1;
            color: #055160;
        }
        .status-delivered {
            background-color: #d4edda;
            color: #155724;
        }
        .status-cancelled {
            background-color: #f8d7da;
            color: #721c24;
        }
        .payment-paid {
            background-color: #d4edda;
            color: #155724;
        }
        .payment-pending {
            background-color: #fff3cd;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div class="invoice-header-left">
                <h1>INVOICE</h1>
                <div class="company-name">Guptodhan E-Commerce</div>
            </div>
            <div class="invoice-header-right">
                <h2>Order #${order.orderNo}</h2>
                <p style="font-size: 11px; color: #666; margin-top: 5px;">
                    Date: ${invoiceDate}<br>
                    Time: ${invoiceTime}
                </p>
            </div>
        </div>

        <div class="invoice-info">
            <div class="info-section">
                <h3>Bill To</h3>
                <p><span class="label">Name:</span> ${order.name}</p>
                <p><span class="label">Phone:</span> ${order.phone}</p>
                ${order.email ? `<p><span class="label">Email:</span> ${order.email}</p>` : ''}
                ${order.customer?.email ? `<p><span class="label">Customer Email:</span> ${order.customer.email}</p>` : ''}
            </div>
            <div class="info-section">
                <h3>Order Information</h3>
                <p><span class="label">Order No:</span> ${order.orderNo}</p>
                <p><span class="label">Order Date:</span> ${invoiceDate}</p>
                <p><span class="label">Status:</span> 
                    <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                </p>
                <p><span class="label">Payment:</span> 
                    <span class="status-badge ${order.payment.toLowerCase().includes('paid') ? 'payment-paid' : 'payment-pending'}">${order.payment}</span>
                </p>
                ${order.deliveryMethod ? `<p><span class="label">Delivery:</span> ${order.deliveryMethod}</p>` : ''}
                ${order.trackingId ? `<p><span class="label">Tracking ID:</span> ${order.trackingId}</p>` : ''}
                ${order.parcelId ? `<p><span class="label">Parcel ID:</span> ${order.parcelId}</p>` : ''}
            </div>
        </div>

        <div class="order-details">
            <h3>Order Summary</h3>
            <table class="details-table">
                <thead>
                    <tr>
                        <th style="width: 60%;">Description</th>
                        <th class="text-center" style="width: 20%;">Quantity</th>
                        <th class="text-right" style="width: 20%;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Order #${order.orderNo}</td>
                        <td class="text-center">1</td>
                        <td class="text-right">৳${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>৳${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="total-row">
                <span>Delivery Charge:</span>
                <span>৳${deliveryCharge.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="total-row final">
                <span>Total Amount:</span>
                <span>৳${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
        </div>

        <div class="invoice-footer">
            <p>Thank you for your business!</p>
            <p style="margin-top: 5px;">This is a computer-generated invoice. No signature required.</p>
            <p style="margin-top: 5px;">Generated on ${new Date().toLocaleString('en-GB')}</p>
        </div>
    </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${order.orderNo}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

