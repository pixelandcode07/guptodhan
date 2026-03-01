import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function downloadProductsPDF(rows: any[]) {
    if (rows.length === 0) return false;

    const doc = new jsPDF();

    // Image fetch korar Helper function
    const fetchImage = (url: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
        });
    };

    // Prothom product theke Vendor er nam ar logo ber kora
    const firstRow = rows[0];
    const vendorName = firstRow?.vendorStoreId?.storeName || firstRow?.vendorName || 'Vendor';
    const vendorLogoUrl = firstRow?.vendorStoreId?.storeLogo;

    let startYForTable = 20;

    // Logo jodi thake tahole set korbo
    if (vendorLogoUrl) {
        const logoImg = await fetchImage(vendorLogoUrl);
        if (logoImg) {
            // Logo bosanor size (x: 14, y: 10, width: 15, height: 15)
            doc.addImage(logoImg, 'JPEG', 14, 10, 15, 15); 
            doc.setFontSize(16);
            doc.text(`${vendorName} - Products Report`, 32, 20);
            startYForTable = 32; // Logo thakle table ektu nich theke shuru hobe
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

    // Database theke product er thumbnailImage fetch kora
    const imagePromises = rows.map((p) => {
        const imgUrl = p.thumbnailImage || p.photoGallery?.[0]; 
        return imgUrl ? fetchImage(imgUrl) : Promise.resolve(null);
    });

    const images = await Promise.all(imagePromises);

    // Table Create kora
    autoTable(doc, {
        startY: startYForTable, // Dynamically set hobe
        head: [['ID', 'Product Name', 'Current Price', 'Update Price', 'Stock', 'Image']],
        body: rows.map((p) => [
            p.productId || p._id || '-',
            p.productTitle || '-', 
            `${p.productPrice || 0} Tk`, 
            '', 
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