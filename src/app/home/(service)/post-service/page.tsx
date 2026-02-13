import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchAllPublicServiceCategories } from "@/lib/ServicePageApis/fetchAllPublicCategories";
import { getServerSession } from "next-auth";
import ClientServicePostForm from "../components/ClientServicePostForm";


export default async function PostServicePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return <div>Please log in to post a service.</div>;
    }

    const categories = await fetchAllPublicServiceCategories();

    return (
        <div className="">
            <ClientServicePostForm
                categories={categories}
            />
        </div>
    );
}