import { SupportTicketServices } from '@/lib/modules/crm-modules/support-ticket/supportTicket.service';
import dbConnect from '@/lib/db';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import TicketViewClient from './Components/TicketViewClient';
import { ISupportTicket } from '@/lib/modules/crm-modules/support-ticket/supportTicket.interface';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// ✅ FIX 1: Update the interface to show that params is a Promise
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ViewUserSupportTicketPage({ params }: PageProps) {
  // ✅ FIX 2: Await the params Promise to get the 'id'
  const { id } = await params; 
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  
  let ticketData: ISupportTicket | null = null;

  try {
    // Now 'id' will be a valid string
    ticketData = await SupportTicketServices.getSupportTicketByIdFromDB(id);
  } catch (error: any) {
    console.error("Error fetching ticket:", error.message);
  }

  // Security Check: Make sure the ticket belongs to the logged-in user
  if (!ticketData || ticketData.reporter.toString() !== userId) {
    return (
        <div className="p-4 sm:p-6 min-h-[50vh] flex flex-col items-center justify-center text-center">
            <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-2 text-gray-600">This ticket was not found or does not belong to you.</p>
            <Button asChild className="mt-4">
                <Link href="/home/UserProfile/support-tickets">Back to My Tickets</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Ticket Details: #{ticketData.ticketNo}</h1>
        <Button asChild variant="outline">
            <Link href="/home/UserProfile/support-tickets">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Tickets
            </Link>
        </Button>
      </div>
      <Suspense fallback={<div className="flex justify-center p-10"><Loader2 className="w-10 h-10 animate-spin" /></div>}>
        <TicketViewClient 
          initialTicket={JSON.parse(JSON.stringify(ticketData))}
        />
      </Suspense>
    </div>
  );
}