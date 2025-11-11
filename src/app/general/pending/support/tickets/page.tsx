import SectionTitle from '@/components/ui/SectionTitle';
import PendingTicketsClient from './Components/PendingTicketsClient';
import { SupportTicketServices } from '@/lib/modules/crm-modules/support-ticket/supportTicket.service';
import dbConnect from '@/lib/db';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function PendingSupportTicketsPage() {
  await dbConnect();
  
  // সার্ভারে দুটি সার্ভিস ফাংশন একসাথে কল করা হচ্ছে
  const [ticketsData, statsData] = await Promise.all([
    SupportTicketServices.getAllTicketsFromDB('Pending'), // ✅ শুধু 'Pending' টিকেট আনা হচ্ছে
    SupportTicketServices.getTicketStatsFromDB()       // ✅ সব গণনা আনা হচ্ছে
  ]);

  return (
    <div className="bg-gray-50 p-4 sm:p-6 min-h-screen">
      <SectionTitle text="Pending Support Tickets" />
      <div className="mt-4">
        <Suspense fallback={<Loader2 className="animate-spin" />}>
          <PendingTicketsClient 
            initialTickets={JSON.parse(JSON.stringify(ticketsData))}
            initialStats={JSON.parse(JSON.stringify(statsData))}
          />
        </Suspense>
      </div>
    </div>
  );
}