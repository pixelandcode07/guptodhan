'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

// Type for the form data
interface SocialLinksForm {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    messenger?: string;
    whatsapp?: string;
    telegram?: string;
    youtube?: string;
    tiktok?: string;
    pinterest?: string;
    viber?: string;
}

interface SocialLinksProps {
  initialData?: SocialLinksForm & { _id?: string };
}

export default function SocialLinks({ initialData }: SocialLinksProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SocialLinksForm>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        facebook: initialData.facebook || '',
        twitter: initialData.twitter || '',
        instagram: initialData.instagram || '',
        linkedin: initialData.linkedin || '',
        messenger: initialData.messenger || '',
        whatsapp: initialData.whatsapp || '',
        telegram: initialData.telegram || '',
        youtube: initialData.youtube || '',
        tiktok: initialData.tiktok || '',
        pinterest: initialData.pinterest || '',
        viber: initialData.viber || '',
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Authentication required.");
    setLoading(true);

    try {
      // The POST API handles both create and update (upsert)
      await axios.post('/api/v1/social-links', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Social links updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update links.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded pt-4">
      <form onSubmit={handleUpdate} className="space-y-4 p-4 text-sm mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(formData).map((key) => (
                <div key={key}>
                    <Label htmlFor={key} className="block text-sm font-medium mb-1 capitalize">
                        {key}:
                    </Label>
                    <Input
                        id={key}
                        name={key}
                        value={formData[key as keyof SocialLinksForm] || ''}
                        onChange={handleInputChange}
                        placeholder={`https://www.${key}.com/`}
                    />
                </div>
            ))}
        </div>
        <div className="flex justify-center gap-2 pt-4">
          <Button type="button" variant="destructive" onClick={() => setFormData(initialData || {})}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {loading ? 'Updating...' : 'Update Links'}
          </Button>
        </div>
      </form>
    </div>
  );
}