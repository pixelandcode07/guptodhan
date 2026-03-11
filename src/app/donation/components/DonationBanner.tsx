import Image from 'next/image';

async function getDonationConfig() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const response = await fetch(`${baseUrl}/api/v1/public/donation-configs`, {
            cache: 'no-store', // ✅ cache disabled
        });
        const result = await response.json();
        return result.success ? result.data : null;
    } catch (error) {
        return null;
    }
}

export default async function DonationBanner() {
    const config = await getDonationConfig();

    const displayConfig = config || {
        title: "Donate for Humanity",
        image: "/img/banner.png",
    };

    return (
        <div className="py-6">
            <div className="md:max-w-[95vw] xl:container mx-auto px-4 md:px-8">
                <div className="relative w-full aspect-[4/3] md:aspect-[2/1] lg:aspect-[16/5] rounded-2xl overflow-hidden bg-gray-200">
                    <Image
                        src={displayConfig.image}
                        alt={displayConfig.title}
                        fill
                        priority
                        className='object-cover object-center'
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    />
                </div>
            </div>
        </div>
    );
}