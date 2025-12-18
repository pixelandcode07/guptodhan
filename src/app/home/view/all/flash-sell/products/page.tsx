
import ProductGrid from '@/components/ReusableComponents/ProductGrid';
import { fetchFlashSaleData } from '@/lib/MainHomePage/fetchFlashSaleData';
import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';

export async function generateMetadata() {
    return generateGuptodhanMetadata({
        title: "Flash Sell | Guptodhan",
        description:
            "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.",
        urlPath: "/home/view/all/flash-sell/products",
        imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
    })
}

export default async function FlashProductsPage() {
    const products = await fetchFlashSaleData();
    return (
        <section className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 bg-gradient-to-b from-red-50 to-white py-10">
            <ProductGrid products={products} />
        </section>
    )
}


