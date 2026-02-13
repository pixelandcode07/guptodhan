import { getServerSession } from "next-auth";
import axios from "axios";
import { notFound } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditAdClient from "./EditAdClient";

async function getAd(id: string, token: string) {
    try {
        const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/classifieds/ads/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    } catch (err: any) {
        if (err.response?.status === 404) notFound();
        throw err;
    }
}

async function getCategories() {
    const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/v1/public/categories-with-subcategories`);
    return res.data.data;
}

export default async function BuySellEditPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return <div>Please log in as admin to edit ads.</div>;
    }

    const token = session.accessToken;

    if (!token) {
        return <div>Access token missing. Please log in again.</div>;
    }

    let ad = null;
    let categories = [];

    try {
        [ad, categories] = await Promise.all([
            getAd(id, token as string),
            getCategories(),
        ]);
    } catch (err) {
        console.error("Failed to load ad or categories:", err);
        notFound();
    }

    return <EditAdClient ad={ad} categories={categories} token={token as string} adId={id} />;
}