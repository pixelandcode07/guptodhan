"use client";

import { useRouter } from "next/navigation";
import { useForm, type Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const formSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  storeAddress: z.string().min(2, "Address is required"),
  storePhone: z.string().min(5, "Phone number is required"),
  storeEmail: z.string().email("Invalid email"),
  commission: z.coerce.number().min(0, "Commission must be positive"),
  status: z.enum(["active", "inactive", "pending"]),
  vendorShortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  linkedIn: z.string().url().optional().or(z.literal("")),
  whatsapp: z.string().url().optional().or(z.literal("")),
  tiktok: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditStoreForm({
  store,
  token,
}: {
  store: any;
  token: string;
}) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: store.storeName || "",
      storeAddress: store.storeAddress || "",
      storePhone: store.storePhone || "",
      storeEmail: store.storeEmail || "",
      commission: store.commission || 0,
      status: store.status || "active",
      vendorShortDescription: store.vendorShortDescription || "",
      fullDescription: store.fullDescription || "",
      facebook: store.storeSocialLinks?.facebook || "",
      instagram: store.storeSocialLinks?.instagram || "",
      twitter: store.storeSocialLinks?.twitter || "",
      linkedIn: store.storeSocialLinks?.linkedIn || "",
      whatsapp: store.storeSocialLinks?.whatsapp || "",
      tiktok: store.storeSocialLinks?.tiktok || "",
    },
  });
  const control = control as unknown as Control<FormValues>;

  

  const onSubmit = async (values: FormValues) => {
    try {
      const baseUrl = window.location.origin;

      await axios.patch(
        `${baseUrl}/api/v1/vendor-store/${store._id}`,
        {
          ...values,
          storeSocialLinks: {
            facebook: values.facebook,
            instagram: values.instagram,
            twitter: values.twitter,
            linkedIn: values.linkedIn,
            whatsapp: values.whatsapp,
            tiktok: values.tiktok,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Store updated successfully!");
      router.push("/admin/stores");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update store");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              🏪 Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter store name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="storeEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="storePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="015..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="storeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Store Media Section */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              🖼️ Store Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="font-medium mb-2">Store Logo</p>
                {store.storeLogo ? (
                  <Image
                    src={store.storeLogo}
                    alt="Store Logo"
                    width={150}
                    height={150}
                    className="rounded-lg border"
                  />
                ) : (
                  <p className="text-gray-500">No logo available</p>
                )}
              </div>
              <div>
                <p className="font-medium mb-2">Store Banner</p>
                {store.storeBanner ? (
                  <Image
                    src={store.storeBanner}
                    alt="Store Banner"
                    width={250}
                    height={150}
                    className="rounded-lg border"
                  />
                ) : (
                  <p className="text-gray-500">No banner available</p>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              📝 Description
            </h2>
            <FormField
              control={control}
              name="vendorShortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Short info..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="fullDescription"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Full store details..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              🌐 Social Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                "facebook",
                "instagram",
                "twitter",
                "linkedIn",
                "whatsapp",
                "tiktok",
              ].map((platform) => (
                <FormField
                  key={platform}
                  control={control}
                  name={platform as keyof FormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{platform}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`https://${platform}.com/...`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Other Info */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              ⚙️ Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={control}
                name="commission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
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
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" className="px-6">
              💾 Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
