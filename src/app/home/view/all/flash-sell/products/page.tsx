
import PageHeader from '@/components/ReusableComponents/PageHeader';
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
        <section className="container mx-auto">
            <div className='flex justify-center items-center mt-5'>
                <PageHeader
                title='Flash Sale Products'
                />
            </div>
            <div className='max-w-[80vw] xl:container mx-auto px-2 md:px-10 py-4 h-screen'>
                <ProductGrid products={products} />
            </div>
        </section>
    )
}


