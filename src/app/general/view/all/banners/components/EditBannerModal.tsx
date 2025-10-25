'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Banner } from '@/components/TableHelper/banner_columns';
import EditBannerForm from './EditBannerForm';

interface EditBannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
  onSuccess: () => void;
}

export default function EditBannerModal({
  open,
  onOpenChange,
  banner,
  onSuccess
}: EditBannerModalProps) {
  if (!banner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Banner: {banner.bannerTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <EditBannerForm 
            initialData={banner}
            onSuccess={onSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
