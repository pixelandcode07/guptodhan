import { OrderRow } from '@/components/TableHelper/orders_columns';

interface PrintOrdersOptions {
    orders: OrderRow[];
    status: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const printOrders = ({ orders, status, onSuccess, onError }: PrintOrdersOptions) => {
    try {
        if (orders.length === 0) {
            onError?.('No orders to print');
            return;
        }

        // Determine title based on status
        const title = status === 'Select Status' ? 'All Orders' : status + ' Orders';

        // Create print content
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            onError?.('Unable to open print window. Please check your popup blocker.');
            return;
        }

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Orders Print - ${title}</title>
    <meta charset="utf-8">
    <style>
        @page {
            margin: 1cm;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
        }
        .print-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #333;
        }
        .print-header h1 {
            font-size: 24px;
            color: #1a1a1a;
            margin-bottom: 5px;
        }
        .print-header .subtitle {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
        }
        .print-meta {
            margin-bottom: 15px;
            font-size: 10px;
            color: #555;
            text-align: center;
        }
        .order-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 11px;
        }
        .order-table th {
            background-color: #f5f5f5;
            color: #333;
            font-weight: bold;
            padding: 8px 6px;
            text-align: left;
            border: 1px solid #ddd;
            font-size: 10px;
        }
        .order-table td {
            padding: 6px;
            border: 1px solid #ddd;
            vertical-align: top;
        }
        .order-table tr:nth-child(even) {
            background-color: #fafafa;
        }
        .order-table tr:hover {
            background-color: #f0f0f0;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .font-bold {
            font-weight: bold;
        }
        .summary-row {
            background-color: #f8f8f8 !important;
            font-weight: bold;
        }
        .total-row {
            background-color: #e8e8e8 !important;
            font-weight: bold;
            font-size: 13px;
        }
        .print-footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        @media print {
            @page {
                size: landscape;
                margin: 0.5cm;
            }
            body {
                margin: 0;
            }
            .print-header {
                border-bottom: 2px solid #000;
            }
            .order-table {
                font-size: 9px;
            }
            .order-table th {
                font-size: 9px;
                padding: 4px;
            }
            .order-table td {
                padding: 4px;
            }
            button, .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="print-header">
        <h1>${title}</h1>
        <div class="subtitle">Guptodhan E-Commerce System</div>
    </div>
    <div class="print-meta">
        Generated on: ${new Date().toLocaleString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        })}
    </div>
    
    <table class="order-table">
        <thead>
            <tr>
                <th>SL</th>
                <th>Order No</th>
                <th>Order Date</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th class="text-right">Total Amount</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Delivery Method</th>
                <th>Tracking ID</th>
                <th>Parcel ID</th>
            </tr>
        </thead>
        <tbody>
            ${orders.map((order, index) => {
                const total = order.total || 0;
                return `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td><strong>${order.orderNo || '-'}</strong></td>
                    <td>${order.orderDate || '-'}</td>
                    <td>${order.name || '-'}</td>
                    <td>${order.phone || '-'}</td>
                    <td>${order.email || '-'}</td>
                    <td class="text-right"><strong>৳${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
                    <td>${order.payment || '-'}</td>
                    <td><strong>${order.status || '-'}</strong></td>
                    <td>${order.deliveryMethod || '-'}</td>
                    <td>${order.trackingId || '-'}</td>
                    <td>${order.parcelId || '-'}</td>
                </tr>
            `;
            }).join('')}
        </tbody>
        <tfoot>
            <tr class="summary-row">
                <td colspan="7" class="text-right font-bold">Total Orders:</td>
                <td colspan="5" class="font-bold">${orders.length}</td>
            </tr>
            <tr class="total-row">
                <td colspan="6" class="text-right font-bold">Total Amount:</td>
                <td class="text-right font-bold">৳${orders.reduce((sum, order) => sum + (order.total || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td colspan="5"></td>
            </tr>
        </tfoot>
    </table>
    
    <div class="print-footer">
        <p>This document was generated by Guptodhan E-Commerce System</p>
        <p>For any inquiries, please contact support</p>
    </div>
    
    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load before triggering print
        printWindow.addEventListener('load', function() {
            setTimeout(() => {
                printWindow.print();
                onSuccess?.();
            }, 1000);
        });

    } catch (error) {
        console.error('Print error:', error);
        onError?.(error instanceof Error ? error.message : 'Failed to print orders');
    }
};

