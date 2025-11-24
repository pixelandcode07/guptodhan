'use client';

import { useState } from 'react';
import { AlertTriangle, Flag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import axios from 'axios';

type ReportReason = 'spam' | 'scam' | 'prohibited_item' | 'false_information' | 'other';

const reasonOptions: { value: ReportReason; label: string }[] = [
  { value: 'spam', label: 'This is spam' },
  { value: 'scam', label: 'Scam or fraud' },
  { value: 'prohibited_item', label: 'Prohibited item' },
  { value: 'false_information', label: 'Fake or misleading information' },
  { value: 'other', label: 'Other' },
];

interface ReportDialogProps {
  adId: string;
  adTitle: string;
  sellerName: string;
  trigger?: React.ReactNode;
}

export default function ReportDialog({
  adId,
  adTitle,
  sellerName,
  trigger,
}: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<ReportReason[]>([]);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const showDetailsBox = selectedReasons.length > 0;
  const canSubmit = selectedReasons.length > 0;

  const toggleReason = (reason: ReportReason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('Please select at least one reason.');
      return;
    }

    setLoading(true);

    try {
      const primaryReason = selectedReasons[0];
      const finalDetails = details.trim()
        ? `${selectedReasons.join(', ')} — ${details.trim()}`
        : selectedReasons.join(', ');

      await axios.post('/api/v1/reports', {
        adId,
        reason: primaryReason,
        details: finalDetails,
      });

      toast.success('Report submitted successfully. Thank you!');
      setOpen(false);
      setSelectedReasons([]);
      setDetails('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="text-red-600 hover:bg-red-50 w-full justify-start">
            <Flag className="w-4 h-4 mr-2" />
            Report this Ad
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md max-h-screen">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 text-xl">
            <AlertTriangle className="w-6 h-6" />
            Report This Ad
          </DialogTitle>
          <DialogDescription>
            Help us keep Guptodhan safe and clean.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="max-h-[65vh] overflow-y-auto px-1 -mx-6 pb-4">
          <div className="px-6 space-y-5">
            {/* Ad Info */}
            <div className="text-sm space-y-3">
              <div>
                <Label className="text-gray-600">Ad Title</Label>
                <p className="font-medium bg-gray-50 p-3 rounded-lg mt-1">{adTitle}</p>
              </div>
              <div>
                <Label className="text-gray-600">Seller</Label>
                <p className="font-medium bg-gray-50 p-3 rounded-lg mt-1">{sellerName}</p>
              </div>
            </div>

            <Separator />

            {/* Reason Checkboxes */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Select reason <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3">
                {reasonOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={option.value}
                      checked={selectedReasons.includes(option.value)}
                      onCheckedChange={() => toggleReason(option.value)}
                      disabled={loading}
                    />
                    <label
                      htmlFor={option.value}
                      className="text-sm font-medium cursor-pointer select-none"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Box */}
            {showDetailsBox && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="details">Additional details (optional)</Label>
                <Textarea
                  id="details"
                  placeholder="You can write more details here if you want..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="min-h-28 resize-none"
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="flex-col sm:flex-row gap-3 border-t pt-4 bg-white">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}