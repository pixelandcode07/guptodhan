import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function downloadProductsPDF(rows: any[]) {
    if (rows.length === 0) return false;

    const doc = new jsPDF();

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

    // প্রথম প্রোডাক্ট থেকে ভেন্ডরের নাম ও লোগো বের করা
    const firstRow = rows[0];
    const vendorName = firstRow?.store || firstRow?.vendorName || 'Vendor';
    const vendorLogoUrl = firstRow?.storeLogo || firstRow?.vendorStoreId?.storeLogo;

    let startYForTable = 20;

    // লোগো বসানোর লজিক
    if (vendorLogoUrl) {
        const logoImg = await fetchImage(vendorLogoUrl);
        if (logoImg) {
            doc.addImage(logoImg, 'JPEG', 14, 10, 15, 15); 
            doc.setFontSize(16);
            doc.text(`${vendorName} - Products Report`, 32, 20);
            startYForTable = 32; 
        } else {
            doc.setFontSize(16);
            doc.text(`${vendorName} - Products Report`, 14, 18);
            startYForTable = 25;
        }
    } else {
        doc.setFontSize(16);
        doc.text(`${vendorName} - Products Report`, 14, 18);
        startYForTable = 25;
    }

    // প্রোডাক্টের ইমেজ ফেচ করা
    const imagePromises = rows.map((p) => {
        const imgUrl = p.image || p.thumbnailImage || p.photoGallery?.[0]; 
        return imgUrl ? fetchImage(imgUrl) : Promise.resolve(null);
    });

    const images = await Promise.all(imagePromises);

    // টেবিল ড্র করা
    autoTable(doc, {
        startY: startYForTable,
        // ✅ হেডারে ID এর বদলে SL দেওয়া হলো
        head: [['SL', 'Product Name', 'Current Price', 'Update Price', 'Stock', 'Image']],
        // ✅ এখানে (index + 1) দিয়ে সিরিয়াল নাম্বার বসানো হয়েছে
        body: rows.map((p, index) => [
            index + 1,
            p.name || p.productTitle || '-', 
            `${p.price || p.productPrice || 0} Tk`, 
            '', // Update Price এর ঘর ফাঁকা
            p.stock || 0,
            '', 
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

    doc.save(`${vendorName}_products_report.pdf`);
    return true;
}