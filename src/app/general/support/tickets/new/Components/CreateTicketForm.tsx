'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, UploadCloud } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// User type
interface Customer {
  _id: string;
  name: string;
  email: string;
}

interface CreateTicketFormProps {
  customers: Customer[];
}

export default function CreateTicketForm({ customers }: CreateTicketFormProps) {
  // Find the admin user ID from the session to set as default
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const adminId = (session?.user as any)?.id; 

  const [customerId, setCustomerId] = useState<string>(adminId || 'admin_generated');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Authentication required.");
    if (!subject || !message) return toast.error("Subject and Message are required.");
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);
      
      // Use the selected customer ID or the admin's ID if "No Customer" is selected
      formData.append('reporter', customerId === 'admin_generated' ? adminId : customerId); 
      
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
      router.push('/general/support/tickets'); // Redirect to the main tickets page

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg border border-gray-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <Label htmlFor="customer" className="font-semibold">Select Customer (Optional)</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger id="customer" className="mt-1">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={adminId || 'admin_generated'}>No Customer (Admin Generated)</SelectItem>
                {customers.map(customer => (
                  <SelectItem key={customer._id} value={customer._id}>
                    {customer.name} {customer.email ? `(${customer.email})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Leave empty for admin-generated tickets without a specific customer.</p>
          </div>

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
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {isLoading ? "Submitting..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}