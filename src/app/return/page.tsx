import { Metadata } from "next";
import ReturnClient from "./component/returnClient";

// ✅ ISR Configuration: প্রতি ১ ঘণ্টা (3600 সেকেন্ড) পর পর পেজটি রি-ভ্যালিডেট হবে।
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Return & Refund Policy | Guptodhan",
  description: "Understand Guptodhan's return process, refund eligibility, and exchange guidelines.",
};

async function getReturnPolicy() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // পাবলিক API থেকে ডাটা ফেচ করা হচ্ছে
    const res = await fetch(`${baseUrl}/api/v1/public/return-policy`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Error fetching return policy:", error);
    return null;
  }
}

export default async function ReturnPage() {
  const policyData = await getReturnPolicy();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <ReturnClient data={policyData} />
    </main>
  );
}