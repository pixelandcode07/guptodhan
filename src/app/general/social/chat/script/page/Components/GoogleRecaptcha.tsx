'use client';

import { useState } from 'react';
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

export default function RecaptchaForm() {
  const [captchaStatus, setCaptchaStatus] = useState('0');
  const [siteKey, setSiteKey] = useState(
    '6LcVO6cbAAAAOzIEwPlU66nL1rxD4VAS38tjp45'
  );
  const [secretKey, setSecretKey] = useState(
    '6LcVO6cbAAAALVNrpZfNRfd0Gy_9a_fJRLiMV'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      captcha_status: captchaStatus,
      captcha_site_key: siteKey,
      captcha_secret_key: secretKey,
    };

    console.log(formData);
  };

  return (
    <div className="tab-pane fade  bg-white  w-full  mx-auto">
      <form className="space-y-4 w-full" onSubmit={handleSubmit}>
        {/* Allow Recaptcha */}
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

        {/* Captcha Site Key */}
        <div className="flex flex-col space-y-1 w-full">
          <Label htmlFor="captcha_site_key">Captcha Site Key</Label>
          <Input
            id="captcha_site_key"
            value={siteKey}
            onChange={e => setSiteKey(e.target.value)}
            placeholder="ex. 6LcVO6cbAAAAOzIEwPlU66nL1rxD4VAS38tjpBX"
            className="w-full"
          />
        </div>

        {/* Captcha Secret Key */}
        <div className="flex flex-col space-y-1 w-full">
          <Label htmlFor="captcha_secret_key">Captcha Secret Key</Label>
          <Input
            id="captcha_secret_key"
            value={secretKey}
            onChange={e => setSecretKey(e.target.value)}
            placeholder="ex. 6LcVO6cbAAAALVNrpZfNRfd0Gy_9a_fJRLiMVUI"
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="w-full">
          <Button type="submit">✓ Update</Button>
        </div>
      </form>
    </div>
  );
}
