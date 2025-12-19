// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { notFound, redirect } from "next/navigation";
// import axios from "axios";
// import EditSeoForm from "./EditSeoForm";

// async function getSeoPage(id: string, token: string) {
//     const baseUrl = process.env.NEXTAUTH_URL;
//     const res = await axios.get(`${baseUrl}/api/v1/seo-settings/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data.data;
// }

// export default async function EditSeoPage({ params }: { params: { id: string } }) {
//     const id = await params.id;
//     const session = await getServerSession(authOptions);
//     if (!session || (session.user as any).role !== "admin") {
//         redirect("/");
//     }

//     const token = (session as any).accessToken;
//     if (!token) redirect("/");

//     let seoPage;
//     try {
//         seoPage = await getSeoPage(id, token);
//     } catch (err: any) {
//         if (err.response?.status === 404) notFound();
//         console.error(err);
//         return <div>Error loading page data.</div>;
//     }

//     return (
//         <div className="container mx-auto py-10 max-w-5xl">
//             <h1 className="text-3xl font-bold mb-8">Edit SEO Page</h1>
//             <EditSeoForm initialData={seoPage} token={token} />
//         </div>
//     );
// }


// src/app/general/edit/seo/[id]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import EditSeoForm from "./EditSeoForm";
import axios from "axios";

async function getSeoPage(id: string, token: string) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    try {
        const res = await axios.get(`${baseUrl}/api/v1/seo-settings/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    } catch (err: any) {
        if (err.response?.status === 404) notFound();
        throw err; // let caller handle
    }
}

export default async function EditSeoPage({
    params,
}: {
    params: Promise<{ id: string }>; // ← params is Promise
}) {
    const { id } = await params; // ← Await the whole params object

    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        redirect("/");
    }

    const token = (session as any).accessToken;
    if (!token) {
        redirect("/");
    }

    let seoPage;
    try {
        seoPage = await getSeoPage(id, token);
    } catch (err) {
        console.error("Failed to fetch SEO page:", err);
        return (
            <div className="container mx-auto py-10 text-center">
                <h1 className="text-2xl font-bold text-red-600">Error loading page</h1>
                <p>Could not fetch the SEO settings. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 max-w-7xl">
            <h1 className="text-3xl font-bold mb-8">Edit SEO Page - {seoPage.metaTitle}</h1>
            <EditSeoForm initialData={seoPage} token={token} />
        </div>
    );
}