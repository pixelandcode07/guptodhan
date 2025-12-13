import CreateTicketForm from './Components/CreateTicketForm';
import { UserServices } from '@/lib/modules/user/user.service';
import dbConnect from '@/lib/db';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import FancyLoadingPage from '@/app/general/loading';

export default async function CreateSupportTicketPage() {
  await dbConnect();
  
  // Fetch all users to populate the "Select Customer" dropdown
  const allUsers = await UserServices.getAllUsersFromDB();

  return (
    <div className="bg-gray-50 p-4 sm:p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Support Ticket</h1>
        <Button asChild variant="outline">
            <Link href="/general/support/tickets">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Tickets
            </Link>
        </Button>
      </div>
      <Suspense fallback={<FancyLoadingPage />}>
        <CreateTicketForm 
          customers={JSON.parse(JSON.stringify(allUsers))}
        />
      </Suspense>
    </div>
  );
}