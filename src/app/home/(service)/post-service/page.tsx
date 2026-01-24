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
        // <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="">
            {/* <h1 className="text-3xl font-bold mb-8">Post a New Service</h1> */}
            <ClientServicePostForm
                categories={categories}
            />
        </div>
    );
}