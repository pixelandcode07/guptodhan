'use client';

// src/components/DashboardComponent/ProductConfig/Country/CountryFormModal.tsx

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, X, ImageIcon } from 'lucide-react';
import { ICountry } from '@/hooks/useCountry';

interface Props {
  open:       boolean;
  onClose:    () => void;
  onSubmit:   (formData: FormData) => Promise<boolean>;
  submitting: boolean;
  editData?:  ICountry | null;
}

const ALLOWED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
const MAX_MB  = 2;

export default function CountryFormModal({
  open,
  onClose,
  onSubmit,
  submitting,
  editData,
}: Props) {
  // ── Text fields ───────────────────────────────────────────────────────────
  const [name,   setName]   = useState('');
  const [code,   setCode]   = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // ── Flag upload ───────────────────────────────────────────────────────────
  const [flagFile,    setFlagFile]    = useState<File | null>(null);
  const [flagPreview, setFlagPreview] = useState<string>('');
  const [fileError,   setFileError]   = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // ── Reset / populate on open ──────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setName(editData?.name    ?? '');
      setCode(editData?.code    ?? '');
      setStatus(editData?.status ?? 'active');
      setFlagPreview(editData?.flag ?? '');
      setFlagFile(null);
      setFileError('');
    }
  }, [open, editData]);

  // ── File select ───────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      setFileError('Only PNG, JPG, WEBP, SVG allowed');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setFileError(`File must be under ${MAX_MB}MB`);
      return;
    }

    setFileError('');
    setFlagFile(file);
    setFlagPreview(URL.createObjectURL(file)); // instant local preview
  };

  const handleRemove = () => {
    setFlagFile(null);
    setFlagPreview('');
    setFileError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append('name',   name.trim());
    fd.append('status', status);
    if (code.trim())  fd.append('code', code.trim().toUpperCase());
    if (flagFile)     fd.append('flag', flagFile); // backend Cloudinary-তে upload করবে

    const ok = await onSubmit(fd);
    if (ok) onClose();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {editData ? 'Edit Country' : 'Add New Country'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* Country Name */}
          <div className="space-y-1.5">
            <Label htmlFor="c-name">
              Country Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="c-name"
              placeholder="e.g. Bangladesh"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Country Code */}
          <div className="space-y-1.5">
            <Label htmlFor="c-code">
              Country Code{' '}
              <span className="text-muted-foreground text-xs">(ISO 3166 — e.g. BD)</span>
            </Label>
            <Input
              id="c-code"
              placeholder="BD"
              maxLength={3}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>

          {/* Flag Upload */}
          <div className="space-y-1.5">
            <Label>
              Flag Image{' '}
              <span className="text-muted-foreground text-xs">
                (PNG, JPG, WEBP, SVG — max {MAX_MB}MB)
              </span>
            </Label>

            {flagPreview ? (
              /* ── Preview card ────────────────────────────────────────── */
              <div className="flex items-center gap-3 border-2 border-dashed border-muted rounded-lg p-3">
                <div className="relative h-12 w-20 rounded overflow-hidden bg-muted shrink-0 border">
                  <Image
                    src={flagPreview}
                    alt="Flag preview"
                    fill
                    className="object-cover"
                    unoptimized // blob URL-এর জন্য
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {flagFile ? flagFile.name : 'Current flag image'}
                  </p>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => inputRef.current?.click()}
                  >
                    Change image
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* ── Dropzone ────────────────────────────────────────────── */
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <div className="p-2 rounded-full bg-muted">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Click to upload flag image</span>
                <span className="text-xs">PNG, JPG, WEBP, SVG up to {MAX_MB}MB</span>
              </button>
            )}

            {/* Hidden file input */}
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
            />

            {fileError && (
              <p className="text-xs text-red-500">{fileError}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as 'active' | 'inactive')}
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
            disabled={submitting || !name.trim()}
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editData ? 'Update Country' : 'Add Country'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}