"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Select from "react-select";
import { ArrowRight, ArrowLeft, User, Briefcase, Paperclip, Save } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import UploadImage from "@/components/ReusableComponents/UploadImage";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StepBadge from "@/components/ReusableComponents/StepBadge";
import Link from "next/link";



type CategoryOption = { value: string; label: string };

export type Inputs = {
  business_name: string;
  trade_license_number?: string;
  business_address?: string;
  owner_name: string;
  owner_number: string;
  owner_email: string;
  owner_email_password: string;
  business_category: CategoryOption[];
};

interface Props {
  vendorCategories: { _id: string; name: string }[];
}

export default function VendorSignupWizard({ vendorCategories }: Props) {
  // console.log("vendorCategories", vendorCategories)
  const [step, setStep] = useState(1);
  const [ownerNidFile, setOwnerNidFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: { business_category: [] },
  });

  const categoryOptions: CategoryOption[] = vendorCategories.map((c) => ({ value: c._id, label: c.name }));

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const onFileChange = (name: string, file: File | null) => {
    if (name === "ownerNid") setOwnerNidFile(file);
    if (name === "tradeLicense") setTradeLicenseFile(file);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!ownerNidFile) return toast.error("Owner NID is required");
    if (!tradeLicenseFile) return toast.error("Trade License is required");

    const formData = new FormData();
    formData.append("name", data.owner_name);
    formData.append("email", data.owner_email);
    formData.append("password", data.owner_email_password);
    formData.append("phoneNumber", data.owner_number);
    formData.append("address", data.business_address || "");

    formData.append("businessName", data.business_name);
    formData.append("businessAddress", data.business_address || "");
    formData.append("tradeLicenseNumber", data.trade_license_number || "");
    formData.append("ownerName", data.owner_name);

    const categoryIds = data.business_category?.map((c) => c.value) || [];
    formData.append("businessCategory", JSON.stringify(categoryIds));

    formData.append("ownerNid", ownerNidFile as Blob);
    formData.append("tradeLicense", tradeLicenseFile as Blob);

    formData.append("status", "pending");

    try {
      await axios.post("/api/v1/auth/register-vendor", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Your Request has been submitted successfully!");
      if (typeof window !== 'undefined') router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create vendor");
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-b from-[#e0f2fe] via-white/60 to-[#ecfdf5]">
      <div className="max-w-[80vw] mx-auto">
        <div className="rounded-3xl p-1 bg-gradient-to-r from-emerald-200 via-white/40 to-sky-200 shadow-lg">
          <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/30">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">G</div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">Guptodhan Vendor Signup</h2>
                  <p className="text-sm text-slate-600">Create your vendor account and start selling on Guptodhan.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-72">
                  <div className="h-3 bg-white/40 rounded-full overflow-hidden">
                    <div style={{ width: `${(step / 3) * 100}%` }} className="h-3 bg-emerald-500 rounded-full transition-all"></div>
                  </div>
                </div>
                <div className="text-sm text-slate-700">Step {step} of 3</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left: Steps */}
              <aside className="md:col-span-1">
                <div className="space-y-4 sticky top-6 ">
                  <StepBadge number={1} title="Business Info" icon={<Briefcase size={18} />} />
                  <StepBadge number={2} title="Owner Info" icon={<User size={18} />} />
                  <StepBadge number={3} title="Attachments" icon={<Paperclip size={18} />} />
                </div>
              </aside>

              {/* Right: Form Card */}
              <main className="md:col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-inner">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                  {/* Step 1: Business Info */}
                  {step === 1 && (
                    <section>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Business Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-slate-700">Business Name <span className="text-red-500">*</span></Label>
                          <Input {...register("business_name", { required: true })} className="mt-1 w-full rounded-lg p-3 border border-white/30 shadow-sm bg-white/80" placeholder="Ex: Guptodhan's Grocery" />
                          {errors.business_name && <div className="text-red-600 text-sm mt-1">This field is required</div>}
                        </div>

                        <div>
                          <Label className="text-sm text-slate-700">Business Category</Label>
                          <Select
                            isMulti
                            options={categoryOptions}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            onChange={(s) => setValue("business_category", s as any)}
                            placeholder="Select categories..."
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-slate-700">Trade License Number</Label>
                          <Input {...register("trade_license_number")} className="mt-1 w-full rounded-lg p-3 border border-white/30 shadow-sm bg-white/80" placeholder="Optional" />
                        </div>

                        <div>
                          <Label className="text-sm text-slate-700">Business Address</Label>
                          <Input {...register("business_address")} className="mt-1 w-full rounded-lg p-3 border border-white/30 shadow-sm bg-white/80" placeholder="Street, City" />
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Step 2: Owner Info */}
                  {step === 2 && (
                    <section>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Owner / Login Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-slate-700">Full Name <span className="text-red-500">*</span></Label>
                          <Input {...register("owner_name", { required: true })} className="mt-1 w-full rounded-lg p-3 border border-white/30 shadow-sm bg-white/80" placeholder="Owner's full name" />
                          {errors.owner_name && <div className="text-red-600 text-sm mt-1">{errors.owner_name.message || 'Required'}</div>}
                        </div>

                        <div>
                          <Label className="text-sm text-slate-700">Phone <span className="text-red-500">*</span></Label>
                          <Input {...register("owner_number", { required: true })} className="mt-1 w-full rounded-lg p-3 border border-white/30 shadow-sm bg-white/80" placeholder="+8801..." />
                          {errors.owner_number && <div className="text-red-600 text-sm mt-1">{errors.owner_number.message || 'Required'}</div>}
                        </div>

                        <div>
                          <Label className="text-sm text-slate-700">Login Email <span className="text-red-500">*</span></Label>
                          <Input type="email" {...register("owner_email", { required: true })} className="mt-1 w-full rounded-lg p-3 border border-white/30 shadow-sm bg-white/80" placeholder="email@example.com" />
                          {errors.owner_email && <div className="text-red-600 text-sm mt-1">{errors.owner_email.message || 'Required'}</div>}
                        </div>

                        <div>
                          <Label className="text-sm text-slate-700">Password <span className="text-red-500">*</span></Label>
                          <Input type="password" {...register("owner_email_password", { required: true, minLength: 8 })} className="mt-1 w-full rounded-lg p-3 border border-white/30 shadow-sm bg-white/80" placeholder="Create a strong password" />
                          {errors.owner_email_password && <div className="text-red-600 text-sm mt-1">{errors.owner_email_password.message || 'Password too short'}</div>}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Step 3: Attachments */}
                  {step === 3 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Owner NID */}
                      <div>
                        <Label className="text-sm text-slate-700 mb-2 block">Upload Owner NID card <span className="text-red-500">*</span></Label>
                        <UploadImage
                          name="ownerNid"
                          // Label="Upload Owner NID card"
                          onChange={onFileChange}
                        />
                      </div>

                      {/* Trade License */}
                      <div>
                        <Label className="text-sm text-slate-700 mb-2 block">Upload Business Trade License <span className="text-red-500">*</span></Label>
                        <UploadImage
                          name="tradeLicense"
                          // Label="Upload Business Trade License"
                          onChange={onFileChange}
                        />
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      {step > 1 && (
                        <button type="button" onClick={back} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-slate-800 border border-white/30">
                          <ArrowLeft size={16} /> Back
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {step < 3 && (
                        <button type="button" onClick={next} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 text-white font-semibold shadow">
                          Next <ArrowRight size={16} />
                        </button>
                      )}

                      {step === 3 && (
                        <Button type="submit" variant={'GreenBtn'} disabled={isSubmitting} className="">
                          <Save size={16} /> {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                      )}
                    </div>
                  </div>

                </form>
              </main>
            </div>

            {/* Footer */}
            <div className="mt-6 text-sm text-slate-700 text-center">
              Already Have an Account? <Link className="text-emerald-600 font-semibold" href={"/vendor-singin"}>Sing In</Link></div>
            <div className="mt-6 text-sm text-slate-700 text-center">Need help? <a className="text-emerald-600 font-semibold" href="#">Contact Guptodhan support</a></div>

          </div>
        </div>
      </div>
    </div>
  );
}
