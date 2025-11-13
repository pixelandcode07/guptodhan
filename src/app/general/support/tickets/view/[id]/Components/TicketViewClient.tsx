'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Download, Upload, User, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ISupportTicket } from '@/lib/modules/crm-modules/support-ticket/supportTicket.interface';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TicketViewClientProps {
    initialTicket: ISupportTicket;
}

export default function TicketViewClient({ initialTicket }: TicketViewClientProps) {
  const [ticket, setTicket] = useState(initialTicket);
  const [newStatus, setNewStatus] = useState<string>(ticket.status);
  const [note, setNote] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyAttachment, setReplyAttachment] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const router = useRouter();

  // --- Update Status Function ---
  const handleUpdateStatus = async () => {
    if (!token) return toast.error("Authentication required.");
    setIsUpdating(true);
    try {
      const res = await axios.patch(`/api/v1/crm-modules/support-ticket/${ticket._id}`, 
        { status: newStatus, note: note }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTicket(res.data.data); // Update state with the new ticket data
      toast.success("Ticket status updated successfully!");
      setNote('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Send Reply Function ---
  const handleSendReply = async () => {
    if (!replyMessage.trim()) return toast.error("Reply message cannot be empty.");
    if (!token) return toast.error("Authentication required.");
    setIsReplying(true);

    try {
      const formData = new FormData();
      formData.append('message', replyMessage);
      formData.append('sender', 'admin'); // Since this is the admin panel

      if (replyAttachment) {
        formData.append('attachment', replyAttachment);
      }

      const res = await axios.post(`/api/v1/crm-modules/support-ticket/reply/${ticket._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setTicket(res.data.data); // Refresh ticket data with the new reply
      setReplyMessage('');
      setReplyAttachment(null);
      toast.success("Reply sent!");

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reply.');
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* --- Left Column: Ticket Info & Status --- */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader><CardTitle>Ticket Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ticket No:</span>
              <span className="font-medium">{ticket.ticketNo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subject:</span>
              <span className="font-medium text-right">{ticket.subject}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                ticket.status === 'Solved' ? 'bg-green-100 text-green-800' :
                ticket.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>{ticket.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Created:</span>
              <span className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newStatus">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="newStatus"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Solved">Solved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea 
                id="note" 
                placeholder="Add a note about this status change..." 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
              />
            </div>
            <Button onClick={handleUpdateStatus} disabled={isUpdating} className="w-full">
              {isUpdating && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Update Status
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Status History</CardTitle></CardHeader>
          <CardContent>
            {/* This is a placeholder. You would need to log status changes in the 'conversation' array to show history */}
            <p className="text-sm text-gray-500">No status changes yet.</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Right Column: Conversation --- */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader><CardTitle>Conversation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {ticket.conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg p-4 rounded-lg ${
                  msg.sender === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {msg.sender === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    <span className="font-semibold text-sm">{msg.sender === 'admin' ? 'Admin' : ticket.reporter.name}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  {msg.attachment && (
                    <a 
                      href={msg.attachment} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`mt-2 inline-flex items-center gap-2 text-sm font-medium ${msg.sender === 'admin' ? 'text-blue-200 hover:text-white' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      <Download className="w-4 h-4" /> Download Attachment
                    </a>
                  )}
                  <p className={`text-xs opacity-70 text-right mt-2 ${msg.sender === 'admin' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Send Reply</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="replyMessage">Type your message here...</Label>
              <Textarea 
                id="replyMessage" 
                rows={5} 
                value={replyMessage} 
                onChange={(e) => setReplyMessage(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="replyAttachment">Attachment (Optional)</Label>
              <Input 
                id="replyAttachment" 
                type="file" 
                onChange={(e) => setReplyAttachment(e.target.files ? e.target.files[0] : null)}
              />
            </div>
            <div className="text-right">
              <Button onClick={handleSendReply} disabled={isReplying}>
                {isReplying && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}