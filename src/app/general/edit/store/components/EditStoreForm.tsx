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

type EditStoreFormProps = {
  store: StoreInterface;
};

export default function StoreForm({ store }: EditStoreFormProps) {
  const form = useForm<StoreInterface>({
    defaultValues: store,
  });

  const router = useRouter();

  const onSubmit = async (values: StoreInterface) => {
    try {
      await toast.promise(
        updateStore(store._id, values),
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
        {/* Store Name */}
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

        {/* Store Address */}
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

        {/* Phone */}
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

        {/* Email */}
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

        {/* Short Description */}
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

        {/* Full Description */}
        <FormField
          control={form.control}
          name="fullDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description (HTML)</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commission"
          render={(field) => (
            <FormItem>
              <FormLabel>Commission (%)</FormLabel>
              <FormControl>
                <Input type="number" step="1" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Social Links */}
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(store.storeSocialLinks).map((key) => (
            <FormField
              key={key}
              control={form.control}
              name={`storeSocialLinks.${key}` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{key}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Enter ${key} link`} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Meta Title */}
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

        {/* Meta Keywords */}
        <FormField
          control={form.control}
          name="storeMetaKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Keywords (comma separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="keyword1, keyword2"
                  value={field.value.join(", ")}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Status */}
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
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
