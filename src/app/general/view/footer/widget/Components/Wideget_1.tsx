'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';

type WidgetRow = {
  title: string;
  url: string;
};

interface FooterWidgetProps {
  widget?: {
    _id: string;
    widgetTitle: string;
    links: WidgetRow[];
  };
}

export default function FooterWidget1({ widget }: FooterWidgetProps) {
  const [widgetTitle, setWidgetTitle] = useState(widget?.widgetTitle || '');
  const [rows, setRows] = useState<WidgetRow[]>(widget?.links || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const addRow = () => {
    setRows(prev => [...prev, { title: '', url: '' }]);
  };

  const removeRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: 'title' | 'url',
    value: string
  ) => {
    setRows(prev =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // 🔹 Save (POST or PATCH depending on widget existence)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const method = widget?._id ? 'PATCH' : 'POST';
      const url = widget?._id
        ? `http://localhost:3000/api/v1/footer-widgets/${widget._id}`
        : 'http://localhost:3000/api/v1/footer-widgets';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Added Authorization header
        },
        body: JSON.stringify({
          widgetTitle,
          links: rows,
        }),
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

  return (
    <div className="col-12 active">
      <div className="bg-white">
        <div className=" p-3 bg-gray-200 flex justify-between items-center">
          <h4 className="text-md font-semibold">Footer Widget 1</h4>
        </div>

        <form className="p-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="widget1_title">Widget Title</Label>
            <Input
              id="widget1_title"
              value={widgetTitle}
              onChange={e => setWidgetTitle(e.target.value)}
              placeholder="Widget 1 Title"
              className="w-full mt-2"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left">Widget Title</th>
                  <th className="border px-2 py-1 text-left">Widget Link</th>
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td className="px-2 py-1">
                      <Input
                        value={row.title}
                        onChange={e =>
                          handleChange(index, 'title', e.target.value)
                        }
                        placeholder="Link Label"
                        className="w-full"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        value={row.url}
                        onChange={e =>
                          handleChange(index, 'url', e.target.value)
                        }
                        placeholder="URL"
                        className="w-full"
                      />
                    </td>
                    <td className="px-2 py-1 text-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeRow(index)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
              type="button"
              variant="default"
              className="mt-2"
              onClick={addRow}>
              Add New Link
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button type="submit" variant="default" disabled={loading}>
              {widget?._id ? 'Update Widget' : 'Create Widget'}
            </Button>
            {loading && (
              <span className="text-sm text-gray-500">Saving...</span>
            )}
          </div>

          {message && (
            <div className="mt-3 text-sm text-blue-600">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}
