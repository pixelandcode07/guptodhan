export interface OrderInvoiceData {
  id: string;
  orderNo: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  total: number;
  deliveryCharge: number;
  payment: string;
  status: string;
  deliveryMethod?: string;
  trackingId?: string;
  parcelId?: string;
  orderDate?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  store?: {
    name?: string;
    id?: string;
  };
  items: Array<{
    productTitle: string;
    thumbnailImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    size?: string;
    color?: string;
  }>;
}

// ✅ এরর ফিক্সড: Promise<string> নির্দিষ্ট করে দেওয়া হয়েছে
const toBase64 = (url: string): Promise<string> => 
  fetch(url)
    .then(res => res.blob())
    .then(blob => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    })).catch(() => url);

export const generateInvoice = async (order: OrderInvoiceData) => {
  const invoiceDate = order.orderDate || new Date().toLocaleDateString('en-GB');
  const invoiceTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  
  const deliveryCharge = order.deliveryCharge || 0;
  const subtotal = order.total - deliveryCharge;

  // লোগো এবং লোগো না থাকলে হ্যান্ডলিং
  const logoBase64 = await toBase64('/img/logo.png');

  const productRowsPromises = (order.items || []).map(async (item, index) => {
    const imgBase64 = await toBase64(item.thumbnailImage || '/img/placeholder.png');
    return `
      <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px; text-align: center; color: #777;">${index + 1}</td>
          <td style="padding: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                  <img src="${imgBase64}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #f0f0f0;" alt="p" />
                  <div>
                      <div style="font-weight: bold; font-size: 13px; color: #111;">${item.productTitle}</div>
                      <div style="font-size: 10px; color: #888; margin-top: 2px;">
                        ${item.size && item.size !== '—' ? `Size: ${item.size}` : ''} 
                        ${item.color && item.color !== '—' ? ` | Color: ${item.color}` : ''}
                      </div>
                  </div>
              </div>
          </td>
          <td style="padding: 12px; text-align: center; font-weight: bold;">${item.quantity}</td>
          <td style="padding: 12px; text-align: right;">৳${item.unitPrice.toLocaleString('en-US')}</td>
          <td style="padding: 12px; text-align: right; font-weight: bold; color: #2563eb;">৳${item.totalPrice.toLocaleString('en-US')}</td>
      </tr>`;
  });

  const productRows = (await Promise.all(productRowsPromises)).join('');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - ${order.orderNo}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 0; }
        .invoice-box { max-width: 800px; margin: auto; padding: 35px; border: 1px solid #eee; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; font-size: 12px; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .items-table th { background: #2563eb; color: white; padding: 12px; font-size: 11px; text-transform: uppercase; text-align: left; letter-spacing: 0.5px; }
        .summary-wrapper { display: flex; justify-content: flex-end; margin-top: 35px; }
        .summary-table { width: 260px; background: #f8fafc; padding: 20px; border-radius: 10px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
        .grand-total { border-top: 2px solid #2563eb; padding-top: 12px; margin-top: 10px; font-weight: bold; font-size: 18px; color: #2563eb; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <img src="${logoBase64}" style="width: 150px; height: auto;" alt="Guptodhan" />
            <div style="text-align: right;">
                <h1 style="margin: 0; color: #2563eb; font-size: 28px; letter-spacing: -1px;">INVOICE</h1>
                <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold; color: #111;">Order #${order.orderNo}</p>
                <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">${invoiceDate} | ${invoiceTime}</p>
            </div>
        </div>

        <div class="info-grid">
            <div style="background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #f1f5f9;">
                <h4 style="margin: 0 0 8px 0; color: #2563eb; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Shipping Address</h4>
                <p style="font-size: 14px; margin: 0 0 4px 0;"><strong>${order.name}</strong></p>
                <p style="margin: 0 0 4px 0;">${order.phone}</p>
                <p style="color: #64748b; font-style: italic; line-height: 1.5; margin: 0;">${order.address || 'Address not available'}</p>
            </div>
            <div style="text-align: right; background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #f1f5f9;">
                <h4 style="margin: 0 0 8px 0; color: #2563eb; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Order Details</h4>
                <p style="margin: 0 0 4px 0;">Status: <strong style="color: #111;">${order.status}</strong></p>
                <p style="margin: 0 0 4px 0;">Payment: <strong style="color: #111;">${order.payment}</strong></p>
                <p style="margin: 0;">Method: ${order.deliveryMethod || 'Standard'}</p>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 40px; text-align: center;">SL</th>
                    <th>Product Description</th>
                    <th style="width: 60px; text-align: center;">Qty</th>
                    <th style="width: 100px; text-align: right;">Price</th>
                    <th style="width: 100px; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>${productRows}</tbody>
        </table>

        <div class="summary-wrapper">
            <div class="summary-table">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>৳${subtotal.toLocaleString('en-US')}</span>
                </div>
                <div class="summary-row">
                    <span>Delivery Charge:</span>
                    <span>৳${deliveryCharge.toLocaleString('en-US')}</span>
                </div>
                <div class="summary-row grand-total">
                    <span>Grand Total:</span>
                    <span>৳${order.total.toLocaleString('en-US')}</span>
                </div>
            </div>
        </div>

        <div style="margin-top: 60px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 25px; font-size: 11px; color: #94a3b8;">
            <p style="margin: 0 0 5px 0; color: #64748b;"><strong>Guptodhan Digital Marketplace</strong></p>
            <p style="margin: 0;">Shariatpur Sadar, Dhaka, Bangladesh | Support: guptodhan24@gmail.com</p>
            <p style="margin: 15px 0 0 0; color: #2563eb; font-weight: bold; font-size: 12px;">Thank you for shopping with us!</p>
        </div>
    </div>
</body>
</html>`;

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