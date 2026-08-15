import { Metadata } from "next";
import TermsClient from "./component/termsClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms & Conditions | Guptodhan",
  description: "Read Guptodhan Terms and Conditions and user service guidelines.",
};

async function getTermsData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/v1/terms-condition`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    return null;
  }
}

export default async function TermsPage() {
  const termsData = await getTermsData();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <TermsClient data={termsData} />
    </main>
  );
}
