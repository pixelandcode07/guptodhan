import PageHeader from '@/components/ReusableComponents/PageHeader';
import ProductGrid from '@/components/ReusableComponents/ProductGrid';
import { fetchBestSellingData } from '@/lib/MainHomePage/fetchBestSellingData';
import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';

export async function generateMetadata() {
    return generateGuptodhanMetadata({
        title: "Best Selling | Guptodhan",
        description:
            "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.",
        urlPath: "/home/view/all/best-sell/products",
        imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
    })
}



export default async function BestSellProductsPage() {
    const products = await fetchBestSellingData()

    return (
        <section className="container mx-auto">
            <div className='flex justify-center items-center mt-5'>
                <PageHeader
                    title='Best Selling Products'
                />
            </div>
            <div className='max-w-[80vw] xl:container mx-auto px-2 md:px-10 py-4 h-screen'>
                <ProductGrid products={products} />
            </div>
        </section>
    );
}
