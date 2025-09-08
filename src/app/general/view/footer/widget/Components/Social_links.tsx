'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SocialLink = {
  label: string;
  url: string;
  icon?: string | File;
  id: string;
};

export default function SocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { label: 'Facebook', url: 'https://facebook.com', icon: '', id: '0' },
    { label: 'Twitter', url: '#', icon: '', id: '1' },
  ]);

  const addSocialLink = () => {
    setSocialLinks(prev => [
      ...prev,
      { label: '', url: '', id: Date.now().toString() },
    ]);
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  const updateSocialLink = (
    id: string,
    key: 'label' | 'url' | 'icon',
    value: string | File
  ) => {
    setSocialLinks(prev =>
      prev.map(link => (link.id === id ? { ...link, [key]: value } : link))
    );
  };

  return (
    <div className=" space-y-8 bg-white min-h-screen">
      <div className="bg-white ">
        <h2 className="text-xl font-semibold mb-6">Social Links</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2 text-left">Label</th>
                <th className="border px-3 py-2 text-left">Icon</th>
                <th className="border px-3 py-2 text-left">URL</th>
                <th className="border px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {socialLinks.map(link => (
                <tr key={link.id}>
                  <td className="border px-3 py-2">
                    <Input
                      value={link.label}
                      onChange={e =>
                        updateSocialLink(link.id, 'label', e.target.value)
                      }
                      placeholder="Label"
                      className="w-full"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e =>
                        e.target.files &&
                        updateSocialLink(link.id, 'icon', e.target.files[0])
                      }
                      className="block w-full text-sm text-gray-500 file:border file:border-gray-300 file:rounded file:px-2 file:py-1 file:bg-gray-50"
                    />
                    {/* Preview */}
                    {link.icon instanceof File && (
                      <img
                        src={URL.createObjectURL(link.icon)}
                        alt={link.label}
                        className="w-6 h-6 mt-2"
                      />
                    )}
                    {typeof link.icon === 'string' && link.icon && (
                      <img
                        src={link.icon}
                        alt={link.label}
                        className="w-6 h-6 mt-2"
                      />
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    <Input
                      value={link.url}
                      onChange={e =>
                        updateSocialLink(link.id, 'url', e.target.value)
                      }
                      placeholder="URL"
                      className="w-full"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <Button
                      variant="destructive"
                      onClick={() => removeSocialLink(link.id)}
                      className="w-full">
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button className="mt-4" onClick={addSocialLink}>
          Add New Social Link
        </Button>
      </div>
    </div>
  );
}
