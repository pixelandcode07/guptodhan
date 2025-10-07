'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import SectionTitle from '@/components/ui/SectionTitle';
import axios from 'axios';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EditTeamEntryForm() {
  const [preview, setPreview] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/public/about/team`
        );
        const member = res.data.data.find((m: any) => m._id === id);
        if (!member) return;

        setName(member.name);
        setDesignation(member.designation);
        setPreviewUrl(member.image); // show existing image
        setFacebook(member.socialLinks?.facebook || '');
        setLinkedin(member.socialLinks?.linkedin || '');
        setInstagram(member.socialLinks?.instagram || '');
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch team member!');
      }
    };

    fetchData();
  }, [id]);

  const handleFileChange = (_name: string, file: File | null) => {
    setPreview(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return toast.error('Member ID missing!');
    setLoading(true);

    try {
      let imageUrl = previewUrl;

      // Upload new image if selected
      if (preview) {
        const formData = new FormData();
        formData.append('image', preview);

        const uploadRes = await axios.post(
          `http://localhost:3000/api/v1/about/team`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        imageUrl = uploadRes.data.data.image;
      }

      const payload = {
        name,
        designation,
        image: imageUrl,
        socialLinks: { facebook, linkedin, instagram },
      };

      const res = await axios.patch(
        `http://localhost:3000/api/v1/about/team/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success('Team member updated!');
        router.push('/general/view/terms'); // ✅ redirect after update
      } else {
        toast.error('Failed to update!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating team member!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 border mt-5">
      <SectionTitle text="Edit Team Member" />
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 w-full">
              <UploadImage
                name="image"
                preview={preview ? URL.createObjectURL(preview) : previewUrl}
                onChange={handleFileChange}
              />
            </div>
            <div className="lg:col-span-8 border-l pl-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="employee_name">Employee Name</Label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    type="text"
                    id="employee_name"
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    type="text"
                    id="designation"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    value={facebook}
                    onChange={e => setFacebook(e.target.value)}
                    type="url"
                    id="facebook"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    type="url"
                    id="linkedin"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    type="url"
                    id="instagram"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Update Team'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
