import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import { DonationCampaignServices } from "@/lib/modules/donation-campaign/donation-campaign.service";
import DonationDetailsClient from "../components/DonationDetailsClient";
import { Metadata } from "next";
import { IDonationCampaign } from "@/lib/modules/donation-campaign/donation-campaign.interface";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  await dbConnect();
  const campaign = (await DonationCampaignServices.getCampaignByIdFromDB(id)) as unknown as IDonationCampaign;

  if (!campaign) return { title: "Campaign Not Found" };

  return {
    title: `${campaign.title} | Guptodhan`,
    description: campaign.description?.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      images: [campaign.images?.[0] || ""],
    },
  };
}

export default async function DonationDetailsPage({ params }: Props) {
  const { id } = await params;
  await dbConnect();
  const campaign = await DonationCampaignServices.getCampaignByIdFromDB(id);

  if (!campaign) notFound();

  const serializedCampaign = JSON.parse(JSON.stringify(campaign));

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <DonationDetailsClient campaign={serializedCampaign} />
    </div>
  );
}