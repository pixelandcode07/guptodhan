'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '@/components/ui/SectionTitle';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export default function TeamEntryForm() {
  const [preview, setPreview] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const router = useRouter();

  const handleFileChange = (_name: string, file: File | null) => {
    setPreview(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return toast.error('Please upload an image!');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', preview as File);
      formData.append('name', name);
      formData.append('designation', designation);
      formData.append('socialLinks.linkedin', linkedin);
      formData.append('socialLinks.facebook', facebook);
      formData.append('socialLinks.instagram', instagram);

      const res = await axios.post('/api/v1/about/team', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success('Team member created!');
        // Redirect to /general/view/terms
        router.push('/general/view/terms');
      } else {
        toast.error('Failed to create member!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error creating member!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 border mt-5">
      <SectionTitle text="Team Entry Form" />
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 w-full">
              <UploadImage
                name="image"
                preview={preview ? URL.createObjectURL(preview) : ''}
                onChange={handleFileChange}
              />
            </div>

            <div className="lg:col-span-8 border-l pl-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="employee_name">
                    Employee Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    type="text"
                    id="employee_name"
                    required
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
              {loading ? 'Saving...' : 'Save Team'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
