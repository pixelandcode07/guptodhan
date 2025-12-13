import SectionTitle from '@/components/ui/SectionTitle';
import TicketsClient from './Components/TicketsClient'; // ✅ আমরা এই ক্লায়েন্ট কম্পোনেন্টটি তৈরি করব
import { SupportTicketServices } from '@/lib/modules/crm-modules/support-ticket/supportTicket.service';
import dbConnect from '@/lib/db';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function AllSupportTicketsPage() {
  await dbConnect();
  
  // সার্ভারে দুটি সার্ভিস ফাংশন একসাথে কল করা হচ্ছে
  const [ticketsData, statsData] = await Promise.all([
    SupportTicketServices.getAllTicketsFromDB(), // ✅ সব টিকেট আনা হচ্ছে
    SupportTicketServices.getTicketStatsFromDB()  // ✅ সব গণনা আনা হচ্ছে
  ]);

  return (
    <div className="bg-gray-50 p-4 sm:p-6 min-h-screen">
      <SectionTitle text="All Support Tickets" />
      <div className="mt-4">
        <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-10 h-10 animate-spin" /></div>}>
          <TicketsClient 
            initialTickets={JSON.parse(JSON.stringify(ticketsData))}
            initialStats={JSON.parse(JSON.stringify(statsData))}
          />
        </Suspense>
      </div>
    </div>
  );
}