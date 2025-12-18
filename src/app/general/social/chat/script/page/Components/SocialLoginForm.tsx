'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function SocialLoginForm() {
  const [loading, setLoading] = useState(false);
  const [fbLogin, setFbLogin] = useState('1');
  const [fbAppId, setFbAppId] = useState('');
  const [fbAppSecret, setFbAppSecret] = useState('');

  const [gmailLogin, setGmailLogin] = useState('1');
  const [gmailClientId, setGmailClientId] = useState('');
  const [gmailSecret, setGmailSecret] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/public/integrations');
      const data = await res.json();
      if (data.success) {
        setFbLogin(data.data?.facebookLoginEnabled ? '1' : '0');
        setFbAppId(data.data?.facebookAppId || '');
        setFbAppSecret(data.data?.facebookAppSecret || '');
        setGmailLogin(data.data?.googleLoginEnabled ? '1' : '0');
        setGmailClientId(data.data?.googleClientId || '');
        setGmailSecret(data.data?.googleClientSecret || '');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        facebookLoginEnabled: fbLogin === '1',
        facebookAppId: fbAppId,
        facebookAppSecret: fbAppSecret,
        googleLoginEnabled: gmailLogin === '1',
        googleClientId: gmailClientId,
        googleClientSecret: gmailSecret,
      };

      const res = await fetch('/api/v1/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Social Login settings updated successfully!');
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
    <div className="p-5 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Facebook Login */}
        <div>
          <Label htmlFor="fb_login_status">Allow Login with Facebook</Label>
          <Select value={fbLogin} onValueChange={setFbLogin}>
            <SelectTrigger id="fb_login_status">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Enable Facebook Login</SelectItem>
              <SelectItem value="0">Disable Facebook Login</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fb_app_id">Facebook App Id</Label>
          <Input
            id="fb_app_id"
            value={fbAppId}
            onChange={(e) => setFbAppId(e.target.value)}
            placeholder="ex. 123456789012345"
          />
        </div>

        <div>
          <Label htmlFor="fb_app_secret">Facebook App Secret</Label>
          <Input
            id="fb_app_secret"
            value={fbAppSecret}
            onChange={(e) => setFbAppSecret(e.target.value)}
            placeholder="ex. dummy_fb_secret"
          />
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Gmail Login */}
        <div>
          <Label htmlFor="gmail_login_status">Allow Login with Gmail</Label>
          <Select value={gmailLogin} onValueChange={setGmailLogin}>
            <SelectTrigger id="gmail_login_status">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Allow Gmail Login</SelectItem>
              <SelectItem value="0">Disallow Gmail Login</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gmail_client_id">Gmail Client Id</Label>
          <Input
            id="gmail_client_id"
            value={gmailClientId}
            onChange={(e) => setGmailClientId(e.target.value)}
            placeholder="ex. dummy-client-id.apps.googleusercontent.com"
          />
        </div>

        <div>
          <Label htmlFor="gmail_secret_id">Gmail Secret Id</Label>
          <Input
            id="gmail_secret_id"
            value={gmailSecret}
            onChange={(e) => setGmailSecret(e.target.value)}
            placeholder="ex. dummy-gmail-secret"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? 'Updating...' : '✓ Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}