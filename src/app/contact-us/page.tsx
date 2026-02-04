import { Metadata } from "next";
import ContactClient from "./component/contactClinet";

export const metadata: Metadata = {
  title: "Contact Us | Guptodhan",
  description: "Get in touch with the Guptodhan team. Find our office address, contact numbers, email, or send us a message directly for any inquiries.",
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <ContactClient />
    </main>
  );
}