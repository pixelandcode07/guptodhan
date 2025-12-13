'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [widgetTitle, setWidgetTitle] = useState('');
  const [rows, setRows] = useState<WidgetRow[]>([{ title: '', url: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (widget) {
      setWidgetTitle(widget.widgetTitle || 'Footer Widget 1');
      setRows(widget.links?.length ? widget.links : [{ title: '', url: '' }]);
    }
  }, [widget]);


  const addRow = () => setRows(prev => [...prev, { title: '', url: '' }]);
  const removeRow = (index: number) => setRows(prev => prev.filter((_, i) => i !== index));
  const handleChange = (index: number, field: 'title' | 'url', value: string) => {
    setRows(prev => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Authentication required.");
    setLoading(true);

    try {
      const method = widget?._id ? 'PATCH' : 'POST';
      const url = widget?._id
        ? `/api/v1/footer-widgets/${widget._id}`
        : '/api/v1/footer-widgets';

      const res = await axios({
        method,
        url,
        data: { widgetTitle, links: rows },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success(`Widget ${widget?._id ? 'updated' : 'created'} successfully!`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="widget1_title">Widget Title</Label>
          <Input id="widget1_title" value={widgetTitle} onChange={e => setWidgetTitle(e.target.value)} className="mt-2" />
        </div>

        <div className="space-y-2">
            <Label>Links</Label>
            {rows.map((row, index) => (
                <div key={index} className="flex gap-2 items-center">
                    <Input value={row.title} onChange={e => handleChange(index, 'title', e.target.value)} placeholder="Link Label" />
                    <Input value={row.url} onChange={e => handleChange(index, 'url', e.target.value)} placeholder="URL (e.g., /about)" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeRow(index)}>X</Button>
                </div>
            ))}
        </div>
        
        <Button type="button" variant="outline" className="mt-3" onClick={addRow}>Add New Link</Button>

        <div className="mt-6 flex items-center">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {loading ? 'Saving...' : 'Save Widget'}
          </Button>
        </div>
      </form>
    </div>
  );
}