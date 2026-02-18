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

// ✅ FIXED: Promise<string> explicit return type added
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

  const logoBase64 = await toBase64('/img/logo.png');

  const productRowsPromises = (order.items || []).map(async (item, index) => {
    const imgBase64 = await toBase64(item.thumbnailImage || '/img/placeholder.png');
    
    // ভেরিয়েন্ট দেখানোর স্মার্ট লজিক
    let variantText = '';
    if (item.size && item.size !== '—') variantText += `Size: ${item.size} `;
    if (item.color && item.color !== '—') variantText += `${variantText ? '| ' : ''}Color: ${item.color}`;

    return `
      <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px; text-align: center; color: #777;">${index + 1}</td>
          <td style="padding: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                  <img src="${imgBase64}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #f0f0f0;" alt="p" />
                  <div>
                      <div style="font-weight: bold; font-size: 13px; color: #111;">${item.productTitle}</div>
                      ${variantText ? `<div style="font-size: 10px; color: #888; margin-top: 2px;">${variantText}</div>` : ''}
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
        .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .items-table th { background: #2563eb; color: white; padding: 12px; font-size: 11px; text-transform: uppercase; text-align: left; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <img src="${logoBase64}" style="width: 150px;" alt="Guptodhan" />
            <div style="text-align: right;">
                <h1 style="margin: 0; color: #2563eb; font-size: 28px;">INVOICE</h1>
                <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold;">Order #${order.orderNo}</p>
                <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">${invoiceDate} | ${invoiceTime}</p>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; font-size: 12px;">
            <div style="background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #f1f5f9;">
                <h4 style="margin: 0 0 8px 0; color: #2563eb; text-transform: uppercase;">Shipping Address</h4>
                <p style="font-size: 14px; margin: 0;"><strong>${order.name}</strong></p>
                <p style="margin: 4px 0;">${order.phone}</p>
                <p style="color: #64748b; font-style: italic; margin: 0;">${order.address || 'N/A'}</p>
            </div>
            <div style="text-align: right; background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #f1f5f9;">
                <h4 style="margin: 0 0 8px 0; color: #2563eb; text-transform: uppercase;">Details</h4>
                <p style="margin: 4px 0;">Status: <strong>${order.status}</strong></p>
                <p style="margin: 0;">Payment: <strong>${order.payment}</strong></p>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 40px; text-align: center;">SL</th>
                    <th>Product</th>
                    <th style="width: 60px; text-align: center;">Qty</th>
                    <th style="width: 100px; text-align: right;">Price</th>
                    <th style="width: 100px; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>${productRows}</tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-top: 35px;">
            <div style="width: 260px; background: #f8fafc; padding: 20px; border-radius: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                    <span>Subtotal:</span><span>৳${subtotal.toLocaleString('en-US')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                    <span>Delivery:</span><span>৳${deliveryCharge.toLocaleString('en-US')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 2px solid #2563eb; padding-top: 12px; font-weight: bold; font-size: 18px; color: #2563eb;">
                    <span>Grand Total:</span><span>৳${order.total.toLocaleString('en-US')}</span>
                </div>
            </div>
        </div>

        <div style="margin-top: 60px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 25px; font-size: 11px; color: #94a3b8;">
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