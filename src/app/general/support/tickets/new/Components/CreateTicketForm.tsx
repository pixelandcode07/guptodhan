'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, UploadCloud, Check, ChevronsUpDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// ✅ MAGIC FIX: Searchable Dropdown-এর জন্য Command এবং Popover ইম্পোর্ট করা হলো
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const adminId = (session?.user as any)?.id; 

  const [customerId, setCustomerId] = useState<string>(adminId || 'admin_generated');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false); // ✅ Combobox Open State
  
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
      router.push('/general/support/tickets'); 

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Selected Customer এর নাম বের করার লজিক
  const selectedCustomerDetails = customerId === 'admin_generated' 
    ? { name: 'No Customer (Admin Generated)', email: '' }
    : customers.find((c) => c._id === customerId);

  return (
    <Card className="max-w-4xl mx-auto shadow-lg border border-gray-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ✅ MAGIC FIX: Searchable Combobox */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customer" className="font-semibold">Select Customer (Optional)</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between font-normal bg-white h-11"
                >
                  <span className="truncate">
                    {selectedCustomerDetails 
                      ? `${selectedCustomerDetails.name} ${selectedCustomerDetails.email ? `(${selectedCustomerDetails.email})` : ''}`
                      : "Select a customer..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search customer by name or email..." />
                  <CommandList>
                    <CommandEmpty>No customer found.</CommandEmpty>
                    <CommandGroup>
                      {/* Default Admin Option */}
                      <CommandItem
                        value="admin generated no customer"
                        onSelect={() => {
                          setCustomerId('admin_generated');
                          setOpenCombobox(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            customerId === 'admin_generated' ? "opacity-100" : "opacity-0"
                          )}
                        />
                        No Customer (Admin Generated)
                      </CommandItem>
                      
                      {/* Customer List */}
                      {customers.map((customer) => (
                        <CommandItem
                          key={customer._id}
                          value={`${customer.name} ${customer.email}`} // Search text
                          onSelect={() => {
                            setCustomerId(customer._id);
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              customerId === customer._id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="truncate">
                            {customer.name} {customer.email ? `(${customer.email})` : ''}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500">Leave empty for admin-generated tickets without a specific customer.</p>
          </div>

          <div>
            <Label htmlFor="subject" className="font-semibold">Subject *</Label>
            <Input 
              id="subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              required 
              className="mt-1 h-11"
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
              className="mt-1 resize-none"
            />
          </div>

          <div>
            <Label htmlFor="attachment" className="font-semibold">Attachment (Optional)</Label>
            <label htmlFor="attachment" className="mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition bg-gray-50 hover:bg-gray-100">
              {attachment ? (
                <span className="text-green-600 font-medium px-4 text-center">{attachment.name}</span>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">Drag and drop a file or click to upload</p>
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
            <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto min-w-[200px]">
              {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {isLoading ? "Submitting..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}