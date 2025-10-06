'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';

type FactType = {
  factTitle: string;
  factCount: number;
  shortDescription: string;
  status: 'active' | 'inactive';
};

export default function EditFactPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fact, setFact] = useState<FactType>({
    factTitle: searchParams.get('factTitle') || '',
    factCount: Number(searchParams.get('factCount')) || 0,
    shortDescription: searchParams.get('shortDescription') || '',
    status: (searchParams.get('status') as 'active' | 'inactive') || 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.patch(
        `http://localhost:3000/api/v1/about/facts/${id}`,
        fact,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success('Fact updated successfully ');
        router.push('/general/view/facts');
      } else {
        toast.error('Failed to update fact ');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6">
      <h4 className="text-xl font-semibold mb-4">Edit Fact</h4>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="factTitle">
              Fact Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="factTitle"
              type="text"
              value={fact.factTitle}
              onChange={e => setFact({ ...fact, factTitle: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="factCount">Fact Count</Label>
            <Input
              id="factCount"
              type="number"
              value={fact.factCount}
              onChange={e =>
                setFact({ ...fact, factCount: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            rows={3}
            maxLength={250}
            value={fact.shortDescription}
            onChange={e =>
              setFact({ ...fact, shortDescription: e.target.value })
            }
          />
        </div>

        <div className="w-40 space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={fact.status}
            onValueChange={val =>
              setFact({ ...fact, status: val as 'active' | 'inactive' })
            }>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select One" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}
