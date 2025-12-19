"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import RichTextEditor from "@/components/ReusableComponents/RichTextEditor";
import Image from "next/image";
import { X, Image as ImageIcon, Trash2 } from "lucide-react";

type SeoPage = {
  _id: string;
  pageIdentifier: string;
  metaTitle: string;
  metaKeywords: string[];
  metaDescription: string;
  pageContent?: string;
  showInHeader?: boolean;
  showInFooter?: boolean;
  ogImage?: string;
  // add others if needed
};

type Props = {
  initialData: SeoPage;
  token: string;
};

export default function EditSeoForm({ initialData, token }: Props) {
  const router = useRouter();

  const [pageTitle, setPageTitle] = useState(initialData.metaTitle);
  const [metaTitle, setMetaTitle] = useState(initialData.metaTitle);
  const [metaKeywords, setMetaKeywords] = useState<string[]>(initialData.metaKeywords || []);
  const [keywordInput, setKeywordInput] = useState("");
  const [metaDescription, setMetaDescription] = useState(initialData.metaDescription);
  const [pageContent, setPageContent] = useState(initialData.pageContent || "");
  const [showInHeader, setShowInHeader] = useState(initialData.showInHeader || false);
  const [showInFooter, setShowInFooter] = useState(initialData.showInFooter || false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData.ogImage || null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const pageIdentifier = pageTitle
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && keywordInput.trim()) {
      e.preventDefault();
      const kw = keywordInput.trim();
      if (!metaKeywords.includes(kw)) {
        setMetaKeywords((prev) => [...prev, kw]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setMetaKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Image must be less than 1MB");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(initialData.ogImage || null);
  };

  const handleUpdate = async () => {
    if (!metaTitle.trim()) return toast.error("Meta Title is required");
    if (!metaDescription.trim()) return toast.error("Meta Description is required");

    setLoading(true);
    const payload = {
      metaTitle,
      metaKeywords,
      metaDescription,
      pageContent: pageContent || undefined,
      showInHeader,
      showInFooter,
      // only send ogImage if a new file is selected
      ...(image ? { ogImage: "new-file-will-be-uploaded" } : {}),
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
    if (image) formData.append("ogImage", image);

    // Note: Your PATCH route expects JSON, but your create route uses FormData.
    // Since PATCH uses updateSeoSettings which reads req.json(), we send JSON.
    // Only send FormData if a new image is uploaded.

    try {
      if (image) {
        // If new image → use the same createOrUpdate endpoint (FormData + pageIdentifier)
        await axios.post("/api/v1/seo-settings", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            // Let browser set multipart boundary
          },
        });
      } else {
        // No new image → use PATCH /api/v1/seo-settings/[id] with JSON
        await axios.patch(`/api/v1/seo-settings/${initialData._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      toast.success("SEO page updated successfully!");
      router.refresh(); // refresh server data on list page if you go back
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this page? This action cannot be undone.")) return;

    setDeleting(true);
    try {
      // You don't have a DELETE route yet — add one later.
      // For now, we'll just redirect back.
      toast.error("Delete endpoint not implemented yet");
      // Example if you add DELETE later:
      // await axios.delete(`/api/v1/seo-settings/${initialData._id}`, { headers: { Authorization: `Bearer ${token}` } });
      // router.push("/admin/seo");
    } catch (error: any) {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - SEO */}
        <div className="space-y-6">
          {/* OG Image */}
          <div>
            <Label>OG Image (1200×630 recommended)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center mt-2">
              {preview ? (
                <div className="relative inline-block">
                  <Image src={preview} alt="OG" width={400} height={210} className="rounded mx-auto" />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <Input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="ogimg" />
                  <label htmlFor="ogimg" className="cursor-pointer text-blue-600 hover:underline">
                    Choose Image (max 1MB)
                  </label>
                </>
              )}
            </div>
          </div>

          <div>
            <Label>Meta Title *</Label>
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </div>

          <div>
            <Label>Meta Keywords</Label>
            <div className="border rounded p-3 flex flex-wrap gap-2 items-center min-h-12">
              {metaKeywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="pl-3 pr-2 py-1">
                  {kw}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeKeyword(kw)} />
                </Badge>
              ))}
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Type & press Enter"
                className="border-0 flex-1 min-w-32"
              />
            </div>
          </div>

          <div>
            <Label>Meta Description *</Label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* Right Column - Page Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Label>Page Title (used for slug)</Label>
            <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
            <p className="text-sm text-gray-600 mt-2">
              URL Slug: <code className="bg-gray-100 px-2 py-1 rounded">{pageIdentifier || "—"}</code>
            </p>
          </div>

          <div>
            <Label>Page Content</Label>
            <RichTextEditor value={pageContent} onChange={setPageContent} />
          </div>

          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <Checkbox checked={showInHeader} onCheckedChange={setShowInHeader} />
              <Label>Show in Header Menu</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={showInFooter} onCheckedChange={setShowInFooter} />
              <Label>Show in Footer Menu</Label>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? "Deleting..." : "Delete Page"}
            </Button>

            <div className="space-x-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving..." : "Update Page"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}