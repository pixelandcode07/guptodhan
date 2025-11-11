import SectionTitle from '@/components/ui/SectionTitle';
import { SupportTicketServices } from '@/lib/modules/crm-modules/support-ticket/supportTicket.service';
import dbConnect from '@/lib/db';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TicketViewClient from '../../Components/TicketViewClient';

interface PageProps {
    params: { id: string };
}

export default async function ViewSupportTicketPage({ params }: PageProps) {
  const { id } = params;
  await dbConnect();
  
  // সার্ভারে সরাসরি সার্ভিস ফাংশন কল করে নির্দিষ্ট টিকেটটি আনা হচ্ছে
  const ticketData = await SupportTicketServices.getSupportTicketByIdFromDB(id);

  if (!ticketData) {
    return (
        <div className="bg-gray-50 p-4 sm:p-6 min-h-screen text-center">
            <SectionTitle text="Ticket Not Found" />
            <p className="mt-4">The requested support ticket could not be found.</p>
            <Button asChild className="mt-4">
                <Link href="/general/support/tickets">Back to All Tickets</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6 min-h-screen">
      <div className="flex justify-between items-center">
        <SectionTitle text={`Support Ticket Details: #${ticketData.ticketNo}`} />
        <Button asChild>
            <Link href="/general/pending/support/tickets">All Tickets</Link>
        </Button>
      </div>
      <div className="mt-6">
        <Suspense fallback={<Loader2 className="animate-spin" />}>
          <TicketViewClient 
            initialTicket={JSON.parse(JSON.stringify(ticketData))}
          />
        </Suspense>
      </div>
    </div>
  );
}