'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Download, Upload, User, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { ISupportTicket } from '@/lib/modules/crm-modules/support-ticket/supportTicket.interface';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TicketViewClientProps {
    initialTicket: ISupportTicket;
}

export default function TicketViewClient({ initialTicket }: TicketViewClientProps) {
  const [ticket, setTicket] = useState(initialTicket);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyAttachment, setReplyAttachment] = useState<File | null>(null);
  const [isReplying, setIsReplying] = useState(false);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  // --- Send Reply Function ---
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return toast.error("Reply message cannot be empty.");
    if (!token) return toast.error("Authentication required.");
    setIsReplying(true);

    try {
      const formData = new FormData();
      formData.append('message', replyMessage);
      formData.append('sender', 'user'); // This is from the user

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
      toast.success("Reply sent successfully!");

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reply.');
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Ticket Information --- */}
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

      {/* --- Conversation --- */}
      <Card>
        <CardHeader><CardTitle>Conversation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {ticket.conversation.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-lg p-4 rounded-lg ${
                msg.sender === 'user' ? 'bg-gray-100 text-gray-900' : 'bg-blue-600 text-white'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  <span className="font-semibold text-sm">{msg.sender === 'user' ? (ticket.reporter as any).name : 'Support Team'}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                {msg.attachment && (
                  <a 
                    href={msg.attachment} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`mt-2 inline-flex items-center gap-2 text-sm font-medium ${msg.sender === 'user' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-200 hover:text-white'}`}
                  >
                    <Download className="w-4 h-4" /> Download Attachment
                  </a>
                )}
                <p className={`text-xs opacity-70 text-right mt-2 ${msg.sender === 'user' ? 'text-gray-500' : 'text-blue-200'}`}>
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* --- Send Reply Form (Only if ticket is not Solved or Rejected) --- */}
      {ticket.status !== 'Solved' && ticket.status !== 'Rejected' && (
        <Card>
          <CardHeader><CardTitle>Send a Reply</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <Label htmlFor="replyMessage">Your Message</Label>
                <Textarea 
                  id="replyMessage" 
                  rows={5} 
                  value={replyMessage} 
                  onChange={(e) => setReplyMessage(e.target.value)} 
                  placeholder="Type your message to the support team..."
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
                <Button type="submit" disabled={isReplying}>
                  {isReplying && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}