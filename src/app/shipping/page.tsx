import { Metadata } from "next";
import ShippingClient from "./component/shippingClient";

// ✅ ISR Configuration: প্রতি ১ ঘণ্টা (3600 সেকেন্ড) পর পর পেজটি রি-ভ্যালিডেট হবে।
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shipping Policy | Guptodhan",
  description: "Learn about Guptodhan's shipping methods, delivery times, and costs across Bangladesh.",
};

async function getShippingPolicy() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // পাবলিক API থেকে ডাটা ফেচ করা হচ্ছে
    const res = await fetch(`${baseUrl}/api/v1/public/shipping-policy`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Error fetching shipping policy:", error);
    return null;
  }
}

export default async function ShippingPage() {
  const policyData = await getShippingPolicy();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <ShippingClient data={policyData} />
    </main>
  );
}