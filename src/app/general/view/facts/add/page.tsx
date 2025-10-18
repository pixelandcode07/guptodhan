'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import SectionTitle from '@/components/ui/SectionTitle';

type FactType = {
  factTitle: string;
  factCount: number;
  shortDescription: string;
  status: 'active' | 'inactive';
};

export default function AddFactPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [fact, setFact] = useState<FactType>({
    factTitle: '',
    factCount: 0,
    shortDescription: '',
    status: 'active',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post(`/api/v1/about/facts`, fact, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success('Fact added successfully!');
        router.push('/general/view/facts'); // Facts list page
      } else {
        toast.error('Failed to add fact');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-2xl pt-6">
      <SectionTitle text="Add Fact" />

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Title + Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="factTitle">
              Fact Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="factTitle"
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
              min={0}
              value={fact.factCount}
              onChange={e =>
                setFact({ ...fact, factCount: Number(e.target.value) })
              }
              required
            />
          </div>
        </div>

        {/* Short Description */}
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

        {/* Status */}
        <div className="w-40 space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={fact.status}
            onValueChange={val =>
              setFact({ ...fact, status: val as 'active' | 'inactive' })
            }>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Adding...' : 'Add Fact'}
          </Button>
        </div>
      </form>
    </div>
  );
}
