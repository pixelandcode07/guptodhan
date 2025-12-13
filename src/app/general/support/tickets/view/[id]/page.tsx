import SectionTitle from '@/components/ui/SectionTitle';
import TicketViewClient from './Components/TicketViewClient';
import { SupportTicketServices } from '@/lib/modules/crm-modules/support-ticket/supportTicket.service';
import dbConnect from '@/lib/db';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ISupportTicket } from '@/lib/modules/crm-modules/support-ticket/supportTicket.interface';

// ✅ FIX: props-এর টাইপ Promise<{ id: string }> হিসেবে আপডেট করা হয়েছে
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ViewSupportTicketPage({ params }: PageProps) {
  // ✅ FIX: params অবজেক্টটিকে এখানে await করা হয়েছে
  const { id } = await params; 
  await dbConnect();
  
  let ticketData: ISupportTicket | null = null;

  try {
    // এখন 'id'-এর সঠিক ভ্যালু এখানে পাস হবে
    ticketData = await SupportTicketServices.getSupportTicketByIdFromDB(id);
  } catch (error: any) {
    console.error("Error fetching ticket:", error.message);
  }

  if (!ticketData) {
    return (
        <div className="bg-gray-50 p-4 sm:p-6 min-h-screen text-center">
            <SectionTitle text="Ticket Not Found" />
            <p className="mt-4">The support ticket you are looking for does not exist or may have been deleted.</p>
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
            <Link href="/general/support/tickets">All Tickets</Link>
        </Button>
      </div>
      <div className="mt-6">
        <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-10 h-10 animate-spin" /></div>}>
          <TicketViewClient 
            initialTicket={JSON.parse(JSON.stringify(ticketData))}
          />
        </Suspense>
      </div>
    </div>
  );
}