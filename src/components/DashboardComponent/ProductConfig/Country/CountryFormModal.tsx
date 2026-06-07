// src/components/DashboardComponent/ProductConfig/Country/CountryFormModal.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { ICountry, CountryFormData } from '@/hooks/useCountry';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CountryFormData) => Promise<boolean>;
  submitting: boolean;
  editData?: ICountry | null;
}

const EMPTY_FORM: CountryFormData = {
  name: '',
  code: '',
  flag: '',
  status: 'active',
};

export default function CountryFormModal({
  open,
  onClose,
  onSubmit,
  submitting,
  editData,
}: Props) {
  const [form, setForm] = useState<CountryFormData>(EMPTY_FORM);

  // Edit mode হলে existing data দিয়ে form fill করো
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        code: editData.code || '',
        flag: editData.flag || '',
        status: editData.status,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editData, open]);

  const handleSubmit = async () => {
    const ok = await onSubmit({
      name: form.name.trim(),
      code: form.code?.trim().toUpperCase() || undefined,
      flag: form.flag?.trim() || undefined,
      status: form.status,
    });
    if (ok) onClose();
  };

  const isEdit = !!editData;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? 'Edit Country' : 'Add New Country'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Country Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Country Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Bangladesh"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          {/* Country Code */}
          <div className="space-y-1.5">
            <Label htmlFor="code">
              Country Code{' '}
              <span className="text-muted-foreground text-xs">(ISO 3166 — e.g. BD)</span>
            </Label>
            <Input
              id="code"
              placeholder="BD"
              maxLength={3}
              value={form.code}
              onChange={(e) =>
                setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
              }
            />
          </div>

          {/* Flag Emoji */}
          <div className="space-y-1.5">
            <Label htmlFor="flag">
              Flag Emoji{' '}
              <span className="text-muted-foreground text-xs">(optional — e.g. 🇧🇩)</span>
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="flag"
                placeholder="🇧🇩"
                value={form.flag}
                onChange={(e) => setForm((p) => ({ ...p, flag: e.target.value }))}
                className="flex-1"
              />
              {form.flag && (
                <span className="text-3xl leading-none">{form.flag}</span>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, status: v as 'active' | 'inactive' }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !form.name.trim()}
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? 'Update Country' : 'Add Country'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}