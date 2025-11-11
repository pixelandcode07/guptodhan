import SectionTitle from '@/components/ui/SectionTitle';
import { UserServices } from '@/lib/modules/user/user.service'; // User সার্ভিস ইম্পোর্ট করুন
import dbConnect from '@/lib/db';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CreateTicketForm from '../Components/CreateTicketForm';

export default async function CreateSupportTicketPage() {
  await dbConnect();
  
  // সার্ভারে সরাসরি সার্ভিস ফাংশন কল করে সব ইউজার আনা হচ্ছে
  const allUsers = await UserServices.getAllUsersFromDB();

  return (
    <div className="bg-gray-50 p-4 sm:p-6 min-h-screen">
      <div className="flex justify-between items-center">
        <SectionTitle text="Create Support Ticket" />
        <Button asChild>
            <Link href="/general/support/tickets">All Tickets</Link>
        </Button>
      </div>
      <div className="mt-6">
        <Suspense fallback={<Loader2 className="animate-spin" />}>
          <CreateTicketForm 
            customers={JSON.parse(JSON.stringify(allUsers))}
          />
        </Suspense>
      </div>
    </div>
  );
}