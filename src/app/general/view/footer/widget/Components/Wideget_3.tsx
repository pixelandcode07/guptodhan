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

export default function FooterWidget3() {
  const [title, setTitle] = useState('Customer Service');
  const [links, setLinks] = useState<WidgetLink[]>([
    { id: 0, label: 'Track My Order', url: '/track/order' },
    { id: 1, label: 'Support Ticket', url: '/support/tickets' },
    { id: 2, label: 'Terms of Services', url: '/terms/of/services' },
    { id: 3, label: 'Privacy Policy', url: '/privacy/policy' },
    { id: 4, label: 'Shipping Policy', url: '/shipping/policy' },
    { id: 5, label: 'Return Policy', url: '/return/policy' },
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
    <div className=" bg-white w-full">
      <div className=" p-3 bg-gray-200">
        <h4 className="text-md font-semibold">Footer Widget 3</h4>
      </div>
      <form className="space-y-6 p-4" onSubmit={handleSubmit}>
        {/* Widget Title */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="widget3_title">Widget Title</Label>
          <Input
            id="widget3_title"
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
