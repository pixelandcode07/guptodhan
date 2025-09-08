'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type WidgetRow = {
  id: number;
  linkLabel: string;
  url: string;
};

export default function FooterWidget1() {
  const [widgetTitle, setWidgetTitle] = useState('Company');
  const [rows, setRows] = useState<WidgetRow[]>([
    { id: 0, linkLabel: 'Home', url: '/' },
    { id: 1, linkLabel: 'About Us', url: '/about' },
    { id: 2, linkLabel: 'contact-us', url: '/contact-us' },
    { id: 3, linkLabel: 'Blogs', url: '/blogs' },
    { id: 4, linkLabel: 'Vendor Shops', url: '/vendor/shops' },
  ]);

  const addRow = () => {
    setRows(prev => [...prev, { id: prev.length, linkLabel: '', url: '' }]);
  };

  const removeRow = (id: number) => {
    setRows(prev => prev.filter(row => row.id !== id));
  };

  const handleChange = (
    id: number,
    field: 'linkLabel' | 'url',
    value: string
  ) => {
    setRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ widgetTitle, rows });
  };

  return (
    <div className="col-12 active">
      <div className="bg-white">
        <div className="mb-4">
          <h4 className="text-lg font-semibold">Footer Widget 1</h4>
        </div>

        <form onSubmit={handleSubmit}>
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
            <table className="table-auto w-full  ">
              <thead>
                <tr className="">
                  <th className="border px-2 py-1 text-left">Widget Title</th>
                  <th className="border px-2 py-1 text-left">Widget Link</th>
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td className="borde px-2 py-1">
                      <Input
                        value={row.linkLabel}
                        onChange={e =>
                          handleChange(row.id, 'linkLabel', e.target.value)
                        }
                        placeholder="Link Label"
                        className="w-full"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <Input
                        value={row.url}
                        onChange={e =>
                          handleChange(row.id, 'url', e.target.value)
                        }
                        placeholder="URL"
                        className="w-full"
                      />
                    </td>
                    <td className=" px-2 py-1 text-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeRow(row.id)}>
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

          <div className="mt-4">
            <Button type="submit" variant="default">
              Save Widget
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
