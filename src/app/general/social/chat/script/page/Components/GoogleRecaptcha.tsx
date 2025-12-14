'use client';

import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

export default function RecaptchaForm() {
  const [loading, setLoading] = useState(false);
  const [captchaStatus, setCaptchaStatus] = useState('0');
  const [siteKey, setSiteKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/public/integrations');
      const data = await res.json();
      if (data.success) {
        setCaptchaStatus(data.data?.googleRecaptchaEnabled ? '1' : '0');
        setSiteKey(data.data?.recaptchaSiteKey || '');
        setSecretKey(data.data?.recaptchaSecretKey || '');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        googleRecaptchaEnabled: captchaStatus === '1',
        recaptchaSiteKey: siteKey,
        recaptchaSecretKey: secretKey,
      };

      const res = await fetch('/api/v1/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Google reCAPTCHA updated successfully!');
        fetchData();
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-pane fade bg-white w-full mx-auto">
      <form className="space-y-4 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-1 w-full">
          <Label htmlFor="captcha_status">Allow Recaptcha</Label>
          <Select value={captchaStatus} onValueChange={setCaptchaStatus}>
            <SelectTrigger id="captcha_status" className="w-full">
              <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="1">Enable Recaptcha</SelectItem>
              <SelectItem value="0">Disable Recaptcha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-1 w-full">
          <Label htmlFor="captcha_site_key">Captcha Site Key</Label>
          <Input
            id="captcha_site_key"
            value={siteKey}
            onChange={(e) => setSiteKey(e.target.value)}
            placeholder="6Lc..."
            className="w-full"
          />
        </div>

        <div className="flex flex-col space-y-1 w-full">
          <Label htmlFor="captcha_secret_key">Captcha Secret Key</Label>
          <Input
            id="captcha_secret_key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="6Lc..."
            className="w-full"
          />
        </div>

        <div className="w-full">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : '✓ Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}