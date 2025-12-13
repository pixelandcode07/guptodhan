'use client';

import { useEffect, useState } from 'react';
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
import SectionTitle from '@/components/ui/SectionTitle';
import Loadding from '../../all/faqs/Components/Loadding';

type FactType = {
  factTitle: string;
  factCount: number;
  shortDescription: string;
  status: 'active' | 'inactive';
};

export default function EditFactPage() {
  const searchParams = useSearchParams();
  const id = searchParams!.get('id');

  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  // Prefill from search params
  const [fact, setFact] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/v1/public/about/facts');
        const filterData = data?.data?.filter(
          (item: { _id: string | null }) => item._id === id
        );

        setFact(filterData[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching facts:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    try {
      const res = await axios.patch(`/api/v1/about/facts/${id}`, fact, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success('Fact updated successfully!');
        router.push('/general/view/facts');
      } else {
        toast.error('Failed to update fact');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loadding />;

  return (
    <div className="mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-2xl pt-6">
      <SectionTitle text="Edit Fact" />

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
            {loading ? 'Updating...' : 'Update Fact'}
          </Button>
        </div>
      </form>
    </div>
  );
}
