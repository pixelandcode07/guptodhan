export function downloadProductsCSV(rows: any[]) {
    if (rows.length === 0) return false;

    const headers = [
        'ID', 'Product Name', 'Category', 'Store', 'Price', 'Offer Price', 'Stock', 'Status'
    ];

    const csvData = rows.map(p => [
        p.id || p._id || '',
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