'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onSuccess: () => void;
}

export default function ReturnRequestModal({ isOpen, onClose, orderId, onSuccess }: ReturnRequestModalProps) {
  const [reasonType, setReasonType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reasonType) {
      toast.error('Please select a reason for return');
      return;
    }

    setLoading(true);
    try {
      // কারণ এবং বিবরণ একসাথে পাঠানো হচ্ছে
      const fullReason = description 
        ? `${reasonType}: ${description}` 
        : reasonType;
      
      const response = await axios.post('/api/v1/product-order/return-request', {
        orderId,
        reason: fullReason,
      });

      if (response.data.success) {
        toast.success('Return request submitted successfully');
        onSuccess(); // Parent component refresh হবে
        onClose();   // Modal বন্ধ হবে
        
        // Reset form
        setReasonType('');
        setDescription('');
      }
    } catch (error: any) {
      console.error('Return request error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to submit return request';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Request Item Return</DialogTitle>
          <DialogDescription>
            Please provide a reason for returning this item. Our team will review your request.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          {/* Reason Select */}
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for Return <span className="text-red-500">*</span></Label>
            <Select onValueChange={setReasonType} value={reasonType}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Damaged Product">Damaged / Broken Product</SelectItem>
                <SelectItem value="Wrong Item">Wrong Item Sent</SelectItem>
                <SelectItem value="Size Issue">Size / Fit Issue</SelectItem>
                <SelectItem value="Quality Issue">Quality Not As Expected</SelectItem>
                <SelectItem value="Missing Parts">Missing Parts / Accessories</SelectItem>
                <SelectItem value="Changed Mind">Changed Mind</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Details Textarea */}
          <div className="grid gap-2">
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea 
              id="details"
              placeholder="Please describe the issue in detail..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !reasonType} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}