'use client';

import { useState } from 'react';
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

export default function SocialLoginForm() {
  const [fbLogin, setFbLogin] = useState('1');
  const [fbAppId, setFbAppId] = useState('123456789012345');
  const [fbAppSecret, setFbAppSecret] = useState('dummy_fb_secret');
  const [fbRedirect, setFbRedirect] = useState('http://localhost/fb-callback');

  const [gmailLogin, setGmailLogin] = useState('1');
  const [gmailClientId, setGmailClientId] = useState(
    'dummy-client-id.apps.googleusercontent.com'
  );
  const [gmailSecret, setGmailSecret] = useState('dummy-gmail-secret');
  const [gmailRedirect, setGmailRedirect] = useState('/auth/google/callback');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace this with actual API call
    console.log({
      fbLogin,
      fbAppId,
      fbAppSecret,
      fbRedirect,
      gmailLogin,
      gmailClientId,
      gmailSecret,
      gmailRedirect,
    });
    alert('Form submitted (dummy data)');
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
            onChange={e => setFbAppId(e.target.value)}
            placeholder="ex. 123456789012345"
          />
        </div>

        <div>
          <Label htmlFor="fb_app_secret">Facebook App Secret</Label>
          <Input
            id="fb_app_secret"
            value={fbAppSecret}
            onChange={e => setFbAppSecret(e.target.value)}
            placeholder="ex. dummy_fb_secret"
          />
        </div>

        <div>
          <Label htmlFor="fb_redirect_url">Facebook Redirect Url</Label>
          <Input
            id="fb_redirect_url"
            value={fbRedirect}
            onChange={e => setFbRedirect(e.target.value)}
            placeholder="ex. http://localhost/fb-callback"
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
            onChange={e => setGmailClientId(e.target.value)}
            placeholder="ex. dummy-client-id.apps.googleusercontent.com"
          />
        </div>

        <div>
          <Label htmlFor="gmail_secret_id">Gmail Secret Id</Label>
          <Input
            id="gmail_secret_id"
            value={gmailSecret}
            onChange={e => setGmailSecret(e.target.value)}
            placeholder="ex. dummy-gmail-secret"
          />
        </div>

        <div>
          <Label htmlFor="gmail_redirect_url">Gmail Redirect Url</Label>
          <Input
            id="gmail_redirect_url"
            value={gmailRedirect}
            onChange={e => setGmailRedirect(e.target.value)}
            placeholder="ex. /auth/google/callback"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="default">
            ✓ Update
          </Button>
        </div>
      </form>
    </div>
  );
}
