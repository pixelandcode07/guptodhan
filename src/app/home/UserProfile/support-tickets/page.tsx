'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, UploadCloud, ArrowRight, MessageSquarePlus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// সাপোর্ট টিকেট টাইপ
type SupportTicket = {
  _id: string;
  ticketNo: string;
  subject: string;
  status: string;
  createdAt: string;
};

export default function UserSupportTicketsPage() {
  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // নতুন টিকেট ফর্মের জন্য State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const router = useRouter();

  // --- ডেটা Fetch করার ফাংশন ---
  useEffect(() => {
    const fetchMyTickets = async () => {
      if (token) {
        try {
          setIsLoading(true);
          const res = await axios.get('/api/v1/crm-modules/support-ticket/my-tickets', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyTickets(res.data.data);
        } catch (error) {
          toast.error("Failed to load your tickets.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchMyTickets();
  }, [token]);

  // --- নতুন টিকেট সাবমিট করার ফাংশন ---
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Authentication required.");
    if (!subject || !message) return toast.error("Subject and Message are required.");
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);
      // 'reporter' আইডি ব্যাকএন্ডে টোকেন থেকে নেওয়া হয়

      if (attachment) {
        formData.append('attachment', attachment);
      }

      await axios.post('/api/v1/crm-modules/support-ticket', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Support ticket created successfully!");
      setSubject('');
      setMessage('');
      setAttachment(null);
      // ডেটা রিফ্রেশ করার জন্য API আবার কল করা (ঐচ্ছিক)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="my_tickets">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="my_tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="create_new">Create New Ticket</TabsTrigger>
        </TabsList>
        
        {/* --- "My Tickets" ট্যাব --- */}
        <TabsContent value="my_tickets">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin" /></div>
              ) : myTickets.length === 0 ? (
                <p className="text-gray-500 text-center">You have not created any support tickets yet.</p>
              ) : (
                <div className="border rounded-md">
                  {myTickets.map(ticket => (
                    <div key={ticket._id} className="flex justify-between items-center p-4 border-b last:border-b-0">
                      <div>
                        <p className="font-semibold text-blue-600">{ticket.subject}</p>
                        <p className="text-sm text-gray-500">Ticket ID: {ticket.ticketNo}</p>
                        <p className="text-xs text-gray-400">Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-medium px-3 py-1 rounded-full text-xs ${
                          ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'Solved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>{ticket.status}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/home/UserProfile/support-tickets/view/${ticket._id}`)} // ভিউ পেজের লিঙ্ক
                        >
                          View <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- "Create New Ticket" ট্যাব --- */}
        <TabsContent value="create_new">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div>
                  <Label htmlFor="subject" className="font-semibold">Subject *</Label>
                  <Input 
                    id="subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    required 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="font-semibold">Message *</Label>
                  <Textarea 
                    id="message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    rows={8} 
                    required 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="attachment" className="font-semibold">Attachment (Optional)</Label>
                  <label htmlFor="attachment" className="mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition bg-gray-50">
                    {attachment ? (
                      <span className="text-green-600 font-medium">{attachment.name}</span>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4">
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">Drag and drop a file or click to upload</p>
                      </div>
                    )}
                  </label>
                  <Input 
                    id="attachment" 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)} 
                  />
                </div>
                <div className="text-right">
                  <Button type="submit" disabled={isSubmitting} size="lg">
                    {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    {isSubmitting ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}