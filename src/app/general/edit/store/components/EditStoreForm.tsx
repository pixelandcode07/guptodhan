"use client";

import { useForm } from "react-hook-form";
import { StoreInterface } from "@/types/StoreInterface";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import RichTextEditor from "@/components/ReusableComponents/RichTextEditor";
import { updateStore } from "@/lib/MultiVendorApis/updateStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UploadImage from "@/components/ReusableComponents/UploadImage";

type EditStoreFormProps = {
  store: StoreInterface;
};

export default function StoreForm({ store }: EditStoreFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // ✅ টাইপস্ক্রিপ্ট ফিক্স ১: Social Links এর টাইপ ঠিক করা হলো
  const cleanedStore: Partial<StoreInterface> = {
    ...store,
    storeLogo: store.storeLogo || undefined,
    storeBanner: store.storeBanner || undefined,
    storePhone: store.storePhone ?? "",
    storeEmail: store.storeEmail ?? "",
    storeAddress: store.storeAddress ?? "",
    storeMetaTitle: store.storeMetaTitle ?? "",
    storeMetaKeywords: Array.isArray(store.storeMetaKeywords) ? store.storeMetaKeywords : [],
    storeSocialLinks: {
      facebook: store.storeSocialLinks?.facebook ?? "",
      whatsapp: store.storeSocialLinks?.whatsapp ?? "",
      linkedIn: store.storeSocialLinks?.linkedIn ?? "",
      tiktok: store.storeSocialLinks?.tiktok ?? "",
      twitter: store.storeSocialLinks?.twitter ?? "",
      instagram: store.storeSocialLinks?.instagram ?? "",
    },
  };

  const form = useForm<StoreInterface>({
    defaultValues: cleanedStore as StoreInterface,
  });

  const router = useRouter();

  const onSubmit = async (values: StoreInterface) => {
    console.log('Edit from------->', values)
    try {
      values._id = store._id;
      values.commission = values.commission ? Number(values.commission) : 0;

      // ✅ টাইপস্ক্রিপ্ট ফিক্স ২: Object.fromEntries কে টাইপ কাস্ট করা হলো
      values.storeSocialLinks = Object.fromEntries(
        Object.entries(values.storeSocialLinks || {}).map(([key, val]) => [
          key,
          val?.trim() ? (val.startsWith("http") ? val : `https://${val}`) : null,
        ])
      ) as StoreInterface["storeSocialLinks"];
      
      await toast.promise(
        updateStore(store._id, values, {
          logo: logoFile || undefined,
          banner: bannerFile || undefined,
        }),
        {
          loading: "Updating store...",
          success: "Store updated successfully!",
          error: (err) => err.message || "Failed to update store",
        }
      );

      router.push("/general/view/all/stores");
      router.refresh();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6 p-4 border rounded-lg bg-white"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-rows-2 gap-5">
          <div>
            <FormField
              control={form.control}
              name="storeLogo"
              render={() => (
                <FormItem>
                  <FormLabel>Store Logo</FormLabel>
                  <FormControl>
                    <UploadImage
                      name="logo"
                      label="Upload Store Logo"
                      preview={store.storeLogo}
                      onChange={(name, file) => setLogoFile(file)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="storeBanner"
              render={() => (
                <FormItem>
                  <FormLabel>Store Banner</FormLabel>
                  <FormControl>
                    <UploadImage
                      name="banner"
                      label="Upload Store Banner"
                      preview={store.storeBanner}
                      onChange={(name, file) => setBannerFile(file)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="storeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <FormControl>
                <Input placeholder="Store Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Address</FormLabel>
              <FormControl>
                <Input placeholder="Store Address" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storePhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Phone Number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email Address" type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vendorShortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description (HTML)</FormLabel>
              <FormControl>
                {/* ✅ টাইপস্ক্রিপ্ট ফিক্স ৩: undefined এড়ানোর জন্য fallback string */}
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="commission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission (%)</FormLabel>
              <FormControl>
                <Input type="number" step="1" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {Object.keys(store.storeSocialLinks || {}).map((key) => (
            <FormField
              key={key}
              control={form.control}
              name={`storeSocialLinks.${key}` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{key}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Enter ${key} link`} {...field} value={field.value ?? ""} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="storeMetaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Title</FormLabel>
              <FormControl>
                <Input placeholder="Meta Title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeMetaKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Keywords (comma separated)</FormLabel>
              <FormControl>
                {/* ✅ টাইপস্ক্রিপ্ট ফিক্স ৪: Array ঠিকভাবে handle করা হলো */}
                <Input
                  placeholder="keyword1, keyword2"
                  value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}