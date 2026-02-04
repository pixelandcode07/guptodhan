import { Metadata } from "next";
import SupportClient from "./component/supportClient";

export const metadata: Metadata = {
  title: "Support Center | Guptodhan",
  description: "Get help with your orders, returns, and account issues on Guptodhan. We are here to assist you 24/7.",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <SupportClient />
    </main>
  );
}