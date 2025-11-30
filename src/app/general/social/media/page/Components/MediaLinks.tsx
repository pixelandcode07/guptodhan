'use client';

import SectionTitle from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Facebook,
  Film,
  Instagram,
  Linkedin,
  MessageCircle,
  MessageSquareHeart,
  PhoneCall,
  Send,
  Smartphone,
  Twitter,
  Youtube,
} from 'lucide-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface SocialLinksData {
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

const platformConfig = [
  { key: 'facebook', icon: <Facebook className="w-4 h-4 text-blue-600" />, label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
  { key: 'twitter', icon: <Twitter className="w-4 h-4 text-sky-500" />, label: 'Twitter', placeholder: 'https://twitter.com/username' },
  { key: 'instagram', icon: <Instagram className="w-4 h-4 text-pink-500" />, label: 'Instagram', placeholder: 'https://instagram.com/username' },
  { key: 'linkedin', icon: <Linkedin className="w-4 h-4 text-blue-700" />, label: 'Linkedin', placeholder: 'https://linkedin.com/in/username' },
  { key: 'messenger', icon: <MessageCircle className="w-4 h-4 text-teal-400" />, label: 'Messenger', placeholder: 'https://m.me/username' },
  { key: 'whatsapp', icon: <Smartphone className="w-4 h-4 text-green-600" />, label: 'WhatsApp', placeholder: 'https://wa.me/8801xxxxxxxxx' },
  { key: 'telegram', icon: <Send className="w-4 h-4 text-sky-600" />, label: 'Telegram', placeholder: 'https://t.me/username' },
  { key: 'youtube', icon: <Youtube className="w-4 h-4 text-red-600" />, label: 'Youtube', placeholder: 'https://youtube.com/@channel' },
  { key: 'tiktok', icon: <Film className="w-4 h-4" />, label: 'Tiktok', placeholder: 'https://tiktok.com/@username' },
  { key: 'pinterest', icon: <MessageSquareHeart className="w-4 h-4 text-red-700" />, label: 'Pinterest', placeholder: 'https://pinterest.com/username' },
  { key: 'viber', icon: <PhoneCall className="w-4 h-4 text-purple-700" />, label: 'Viber', placeholder: 'viber://chat?number=...' },
] as const;

export default function MediaPage() {
  const { data: session, status } = useSession();
  const [links, setLinks] = useState<SocialLinksData>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const token = (session as any)?.accessToken;

  // Load existing social links
  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const { data } = await axios.get('/api/v1/social_links');

        if (data.success && data.data) {
          setLinks({
            facebook: data.data.facebook || '',
            twitter: data.data.twitter || '',
            instagram: data.data.instagram || '',
            linkedin: data.data.linkedin || '',
            messenger: data.data.messenger || '',
            whatsapp: data.data.whatsapp || '',
            telegram: data.data.telegram || '',
            youtube: data.data.youtube || '',
            tiktok: data.data.tiktok || '',
            pinterest: data.data.pinterest || '',
            viber: data.data.viber || '',
          });
        }
      } catch (err: any) {
        toast.error('Failed to load social links');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSocialLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload: Partial<SocialLinksData> = {};

    for (const [key, value] of formData.entries()) {
      const val = value.toString().trim();
      payload[key as keyof SocialLinksData] = val || '';
    }

    try {
      const response = await axios.post('/api/v1/social_links', payload, {
        headers: {
          'Content-Type': 'application/json', // এটা ঠিক করো
          Authorization: `Bearer ${token}`,   // টোকেন আছে কিনা চেক করো
        },
      });

      if (response.data.success) {
        toast.success('Social media links updated successfully!');
        setLinks(payload as SocialLinksData);
      }
    } catch (err: any) {
      console.error('Update error:', err.response?.data);

      if (err.response?.status === 403) {
        toast.error('Access denied: Only Admin can update social links');
      } else if (err.response?.status === 401) {
        toast.error('Please login again');
      } else {
        toast.error(err.response?.data?.message || 'Failed to update social links');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg text-muted-foreground">Loading social links...</div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <SectionTitle text="Update Social Media Links" />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {platformConfig.map(({ key, icon, label, placeholder }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  {icon}
                  <span>{label}:</span>
                </label>
                <Input
                  id={key}
                  name={key}
                  type="url"
                  defaultValue={links[key as keyof SocialLinksData] || ''}
                  placeholder={placeholder}
                  disabled={submitting}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => window.location.reload()}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Update All Links'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}