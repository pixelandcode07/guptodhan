'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import FileUpload from '@/components/ReusableComponents/FileUpload';

type SocialLink = {
  label: string;
  url: string;
  icon?: string | File;
  _id?: string; // DB id
  id: string; // local id
};

interface SocialLinksProps {
  initialLinks?: SocialLink[];
}

export default function SocialLinks({ initialLinks = [] }: SocialLinksProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    initialLinks.length
      ? initialLinks.map(link => ({
          ...link,
          id: link._id || Date.now().toString(),
        }))
      : [{ label: '', url: '', id: Date.now().toString() }]
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addSocialLink = () => {
    setSocialLinks(prev => [
      ...prev,
      { label: '', url: '', id: Date.now().toString() },
    ]);
  };

  const removeSocialLink = (id: string, _id?: string) => {
    if (_id) handleDelete(_id);
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

  const handleSave = async (link: SocialLink) => {
    try {
      setLoading(true);

      const method = link?._id ? 'PATCH' : 'POST';
      const url = link?._id
        ? `http://localhost:3000/api/v1/social-links/${link._id}`
        : `http://localhost:3000/api/v1/social-links`;

      const payload: any = {
        label: link.label,
        url: link.url,
      };

      if (typeof link.icon === 'string' && link.icon.trim() !== '') {
        payload.icon = link.icon;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed! Status: ${res.status}`);

      const data = await res.json();
      setMessage(data.message || 'Widget saved successfully!');
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    if (!token) {
      setMessage('Unauthorized! Please log in first.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.delete(
        `http://localhost:3000/api/v1/social-links/${_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || 'Deleted successfully!');
    } catch (err: any) {
      setMessage(
        err.response?.data?.message || err.message || 'Failed to delete'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 bg-white min-h-screen">
      <div className="bg-white">
        <div className="p-3 bg-gray-200">
          <h2 className="text-md font-semibold">Social Links</h2>
        </div>

        <div className="overflow-x-auto p-4">
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
                  <td className="border max-w-20 max-h-10 px-3 py-2">
                    <div className="w-full h-full ">
                      <FileUpload
                        label=""
                        name="icon"
                        preview={
                          typeof link.icon === 'string' ? link.icon : undefined
                        }
                        onUploadComplete={(name, url) =>
                          updateSocialLink(link.id, 'icon', url)
                        }
                      />
                    </div>
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
                  <td className="border px-3 py-2 space-y-1">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => handleSave(link)}
                      disabled={loading}>
                      Save
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => removeSocialLink(link.id, link._id)}
                      disabled={loading}>
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

        {message && <p className="mt-2 text-sm text-blue-600">{message}</p>}
      </div>
    </div>
  );
}
