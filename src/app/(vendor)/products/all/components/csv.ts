export function downloadProductsCSV(rows: any[]) {
    if (rows.length === 0) return false;

    const headers = [
        'SL', 'Product Name', 'Category', 'Store', 'Price', 'Offer Price', 'Stock', 'Status'
    ];

    // ✅ এখানে p.id এর বদলে (index + 1) ব্যবহার করা হয়েছে সিরিয়াল নাম্বারের জন্য
    const csvData = rows.map((p, index) => [
        index + 1, 
        p.name || p.productTitle || '', 
        p.category || '', 
        p.store || p.vendorName || '',
        p.price || p.productPrice || '0', 
        p.offer_price || p.discountPrice || '0',
        p.stock || '0',
        p.status || ''
    ]);

    const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
}