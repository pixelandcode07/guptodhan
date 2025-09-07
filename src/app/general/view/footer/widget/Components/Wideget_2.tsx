'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type WidgetLink = {
  id: number;
  label: string;
  url: string;
};

export default function FooterWidget2() {
  const [title, setTitle] = useState('My Account');
  const [links, setLinks] = useState<WidgetLink[]>([
    { id: 0, label: 'My Dashboard', url: '/home' },
    { id: 1, label: 'My Orders', url: '/my/orders' },
    { id: 2, label: 'My Wishlist', url: '/my/wishlists' },
    { id: 3, label: 'My Payments', url: '/my/payments' },
    { id: 4, label: 'Promo/Coupons', url: '/promo/coupons' },
  ]);

  const addLink = () => {
    const newId = links.length ? links[links.length - 1].id + 1 : 0;
    setLinks([...links, { id: newId, label: '', url: '' }]);
  };

  const removeLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleLinkChange = (
    id: number,
    field: 'label' | 'url',
    value: string
  ) => {
    setLinks(
      links.map(link => (link.id === id ? { ...link, [field]: value } : link))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, links });
  };

  return (
    <div className=" bg-white  w-full">
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Footer Widget 2</h4>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Widget Title */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="widget2_title">Widget Title</Label>
          <Input
            id="widget2_title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Widget Title"
            className="w-full"
          />
        </div>

        {/* Widget Links */}
        <div className="space-y-2">
          {links.map(link => (
            <div key={link.id} className="flex space-x-2 w-full">
              <Input
                className="flex-1"
                placeholder="Link Label"
                value={link.label}
                onChange={e =>
                  handleLinkChange(link.id, 'label', e.target.value)
                }
              />
              <Input
                className="flex-1"
                placeholder="URL"
                value={link.url}
                onChange={e => handleLinkChange(link.id, 'url', e.target.value)}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeLink(link.id)}>
                Remove
              </Button>
            </div>
          ))}

          <Button type="button" onClick={addLink} variant="default">
            Add New Link
          </Button>
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="default">
          ✓ Update
        </Button>
      </form>
    </div>
  );
}
