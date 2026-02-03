import { Metadata } from "next";
import PrivacyClient from "./component/privacyClient";

// ✅ ISR: প্রতি ১ ঘণ্টায় আপডেট হবে
export const revalidate = 3600; 

export const metadata: Metadata = {
  title: "Privacy Policy | Guptodhan",
  description: "Guptodhan Privacy Policy - How we collect, use, and protect your personal data.",
};

async function getPrivacyPolicy() {
  // আপনার এনভায়রনমেন্ট ভেরিয়েবল চেক করুন
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/v1/public/privacy-policy`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    return null;
  }
}

export default async function PrivacyPage() {
  const policyData = await getPrivacyPolicy();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <PrivacyClient data={policyData} />
    </main>
  );
}