// ✅ src/app/home/donation/[id]/page.tsx
// Full Solved Code - No Type Errors

import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import { DonationCampaignServices } from "@/lib/modules/donation-campaign/donation-campaign.service";
import DonationDetailsClient from "../components/DonationDetailsClient";
import { Metadata } from "next";

// ✅ Proper TypeScript Interface
interface IDonationCampaign {
  _id: string;
  title: string;
  description?: string;
  images?: string[];
  item: string;
  category?: { _id: string; name: string };
  creator?: { _id: string; name: string; profilePicture?: string };
  status?: string;
  moderationStatus?: string;
  goalAmount?: number;
  raisedAmount?: number;
  donorsCount?: number;
  createdAt?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// ✅ Generate Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    await dbConnect();

    const campaign = (await DonationCampaignServices.getCampaignByIdFromDB(id)) as unknown as IDonationCampaign;

    if (!campaign) {
      return { title: "Campaign Not Found" };
    }

    // ✅ Clean HTML from description for metadata
    const cleanDescription = campaign.description
      ?.replace(/<[^>]*>/g, "")
      .slice(0, 160) || "";

    return {
      title: `${campaign.title} | Guptodhan Donation`,
      description: cleanDescription,
      openGraph: {
        title: campaign.title,
        description: cleanDescription,
        images: [campaign.images?.[0] || ""],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: campaign.title,
        description: cleanDescription,
        images: [campaign.images?.[0] || ""],
      },
    };
  } catch (error) {
    return { title: "Guptodhan - Donation Campaign" };
  }
}

// ✅ Main Page Component
export default async function DonationDetailsPage({ params }: PageProps) {
  const { id } = await params;

  try {
    await dbConnect();

    // ✅ Fetch campaign from database
    const campaign = (await DonationCampaignServices.getCampaignByIdFromDB(id)) as unknown as IDonationCampaign;

    if (!campaign) {
      notFound();
    }

    // ✅ Proper serialization for client component
    const serializedCampaign = JSON.parse(JSON.stringify(campaign));

    return (
      <div className="bg-slate-50 min-h-screen">
        <DonationDetailsClient campaign={serializedCampaign} />
      </div>
    );
  } catch (error) {
    console.error("Error loading donation campaign:", error);
    notFound();
  }
}