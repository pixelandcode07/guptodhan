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
  // ✅ টাইপ মিসম্যাচ দূর করতে এগুলো অপশনাল (?) করা হয়েছে
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

// ইমেজকে Base64 এ রূপান্তরের হেল্পার (যাতে ডাউনলোড করার পর অফলাইনেও ছবি দেখা যায়)
const toBase64 = (url: string): Promise<string> => 
  fetch(url)
    .then(res => res.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    })).catch(() => url);

export const generateInvoice = async (order: OrderInvoiceData) => {
  const invoiceDate = order.orderDate || new Date().toLocaleDateString('en-GB');
  const invoiceTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  
  const logoBase64 = await toBase64('/img/logo.png'); // ✅ লোগো পাথ ফিক্সড

  const productRowsPromises = (order.items || []).map(async (item, index) => {
    const imgBase64 = await toBase64(item.thumbnailImage || '/img/placeholder.png');
    return `
      <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px; text-align: center;">${index + 1}</td>
          <td style="padding: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${imgBase64}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" alt="p" />
                  <div>
                      <div style="font-weight: bold; font-size: 12px;">${item.productTitle}</div>
                      <div style="font-size: 10px; color: #777;">
                        ${item.size && item.size !== '—' ? `Size: ${item.size}` : ''} 
                        ${item.color && item.color !== '—' ? ` | Color: ${item.color}` : ''}
                      </div>
                  </div>
              </div>
          </td>
          <td style="padding: 10px; text-align: center; font-weight: bold;">${item.quantity}</td>
          <td style="padding: 10px; text-align: right;">৳${item.unitPrice.toLocaleString()}</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; color: #2563eb;">৳${item.totalPrice.toLocaleString()}</td>
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
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,.05); background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .items-table th { background: #2563eb; color: white; padding: 12px; font-size: 11px; text-transform: uppercase; text-align: left; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <img src="${logoBase64}" style="width: 130px;" alt="Guptodhan" />
            <div style="text-align: right;">
                <h2 style="margin: 0; color: #2563eb;">INVOICE</h2>
                <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">Order #${order.orderNo}</p>
                <p style="margin: 0; font-size: 10px; color: #666;">${invoiceDate} | ${invoiceTime}</p>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; font-size: 12px;">
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                <h4 style="margin: 0 0 5px 0; color: #2563eb;">Shipping Address</h4>
                <p><strong>${order.name}</strong></p>
                <p>${order.phone}</p>
                <p style="color: #666; font-style: italic;">${order.address || 'N/A'}</p>
            </div>
            <div style="text-align: right; background: #f8fafc; padding: 15px; border-radius: 8px;">
                <h4 style="margin: 0 0 5px 0; color: #2563eb;">Summary</h4>
                <p>Status: <strong>${order.status}</strong></p>
                <p>Payment: <strong>${order.payment}</strong></p>
            </div>
        </div>
        <table class="items-table">
            <thead>
                <tr><th style="width: 40px; text-align: center;">SL</th><th>Description</th><th style="width: 60px; text-align: center;">Qty</th><th style="width: 100px; text-align: right;">Price</th><th style="width: 100px; text-align: right;">Total</th></tr>
            </thead>
            <tbody>${productRows}</tbody>
        </table>
        <div style="float: right; width: 250px; background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Subtotal:</span><span>৳${(order.total - order.deliveryCharge).toLocaleString()}</span></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span>Shipping:</span><span>৳${order.deliveryCharge.toLocaleString()}</span></div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #2563eb; padding-top: 10px; font-weight: bold; font-size: 16px; color: #2563eb;">
                <span>Grand Total:</span><span>৳${order.total.toLocaleString()}</span>
            </div>
        </div>
        <div style="clear: both; margin-top: 60px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; font-size: 11px; color: #94a3b8;">
            <p>Thank you for shopping with <strong>Guptodhan Digital Marketplace</strong>!</p>
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