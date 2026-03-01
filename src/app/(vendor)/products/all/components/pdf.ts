import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function downloadProductsPDF(rows: any[]) {
    if (rows.length === 0) return false;

    const doc = new jsPDF();
    doc.text('Vendor Products Report', 14, 15);

    // ইমেজ লোড করার Helper function
    const fetchImage = (url: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
        });
    };

    // ডাটাবেস থেকে thumbnailImage ফেচ করা
    const imagePromises = rows.map((p) => {
        const imgUrl = p.thumbnailImage || p.photoGallery?.[0]; // আপনার স্কিমার ইমেজ ফিল্ড
        return imgUrl ? fetchImage(imgUrl) : Promise.resolve(null);
    });

    const images = await Promise.all(imagePromises);

    autoTable(doc, {
        startY: 20,
        head: [['ID', 'Product Name', 'Category', 'Price', 'Stock', 'Image']],
        body: rows.map((p) => [
            p.productId || p._id || '-',
            p.productTitle || '-', // ডাটাবেসের productTitle
            p.category?.name || '-', // ডাটাবেসের category.name
            `${p.productPrice || 0} Tk`, // ডাটাবেসের productPrice
            p.stock || 0,
            '', // ইমেজের জায়গা
        ]),
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        bodyStyles: { minCellHeight: 18, valign: 'middle' },
        didDrawCell: (data) => {
            if (data.column.index === 5 && data.cell.section === 'body') {
                const img = images[data.row.index];
                if (img) {
                    const dim = data.cell.height - 4;
                    const xPos = data.cell.x + (data.cell.width - dim) / 2;
                    const yPos = data.cell.y + 2;
                    doc.addImage(img, 'JPEG', xPos, yPos, dim, dim);
                }
            }
        },
    });

    doc.save(`products_report_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
}