import { fetchAllPublicServiceCategories } from "@/lib/ServicePageApis/fetchAllPublicCategories";
import ClientServiceRegister from "../components/ClientServiceRegister";


export default async function ServiceRegisterPage() {
    const categories = await fetchAllPublicServiceCategories();

    return <ClientServiceRegister categories={categories} />;
}