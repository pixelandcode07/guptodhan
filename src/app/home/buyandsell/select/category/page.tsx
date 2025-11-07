
import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata'
import PostAdWizard from '../../components/PostAdWizard/PostAdWizard'

export async function generateMetadata() {
    return generateGuptodhanMetadata({
        title: "Post Ad | Guptodhan Marketplace",
        description:
            "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.",
        urlPath: "/home/buyandsell",
        imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
    })
}

export default function SelectCategoryPage() {
    return (
        <div>
            {/* <SelectItems /> */}
            <PostAdWizard />
        </div>
    )
}
