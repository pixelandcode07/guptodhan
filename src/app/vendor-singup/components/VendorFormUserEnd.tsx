"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  Paperclip,
  CheckCircle,
  Shield,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import UploadImage from "@/components/ReusableComponents/UploadImage";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StepBadge from "@/components/ReusableComponents/StepBadge";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";

type CategoryOption = { value: string; label: string };

type Inputs = {
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
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [ownerNidFile, setOwnerNidFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    trigger,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: {
      business_category: [],
    },
  });

  const ownerEmail = watch("owner_email");
  const selectedCategories = watch("business_category");

  const categoryOptions: CategoryOption[] = vendorCategories.map((c) => ({
    value: c._id,
    label: c.name,
  }));


  const next = async () => {
    let valid = false;

    if (step === 1) {
      const ok = await trigger("business_name");
      if (!ok) return toast.error("Business name is required");
      if (!selectedCategories?.length)
        return toast.error("Please select at least one category");
      valid = true;
    }

    if (step === 2) {
      valid = await trigger([
        "owner_name",
        "owner_number",
        "owner_email",
        "owner_email_password",
      ]);
      if (!valid) toast.error("Please complete owner info");
    }

    if (step === 3) {
      if (!ownerNidFile) return toast.error("Owner NID required");
      if (!tradeLicenseFile)
        return toast.error("Trade license required");
      valid = true;
    }

    if (!valid) return;

    if (step === 3) {
      await sendOtp();
    } else {
      setStep((p) => p + 1);
    }
  };

  const back = () => setStep((p) => p - 1);


  const onFileChange = (name: string, file: File | null) => {
    if (name === "ownerNid") setOwnerNidFile(file);
    if (name === "tradeLicense") setTradeLicenseFile(file);
  };


  const sendOtp = async () => {
    if (!ownerEmail) return toast.error("Email missing");

    setIsOtpLoading(true);
    try {
      await axios.post("/api/v1/auth/register-vendor/send-otp", {
        email: ownerEmail,
      });
      toast.success("OTP sent to your email");
      setStep(4);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP send failed");
    } finally {
      setIsOtpLoading(false);
    }
  };


  const verifyOtpAndSubmit = async () => {
    if (otp.length !== 6) return toast.error("Invalid OTP");

    setIsOtpLoading(true);
    try {
      const data = getValues();
      const formData = new FormData();
      formData.append("name", data.owner_name);

      formData.append("ownerName", data.owner_name);
      formData.append("email", data.owner_email);
      formData.append("password", data.owner_email_password);
      formData.append("phoneNumber", data.owner_number);

      formData.append("businessName", data.business_name);
      formData.append("businessAddress", data.business_address || "");
      formData.append("tradeLicenseNumber", data.trade_license_number || "");

      formData.append(
        "businessCategory",
        JSON.stringify(data.business_category.map((c) => c.value))
      );

      formData.append("ownerNid", ownerNidFile!);
      formData.append("tradeLicense", tradeLicenseFile!);
      formData.append("otp", otp);
      formData.append("status", "pending");

      await axios.post("/api/v1/auth/register-vendor", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Vendor request submitted");
      setIsSuccessDialogOpen(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Submission failed");
    } finally {
      setIsOtpLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen py-12 px-6 bg-gradient-to-b from-[#e0f2fe] via-white/60 to-[#ecfdf5]">
        <div className="max-w-[80vw] mx-auto">
          <div className="rounded-3xl p-1 bg-gradient-to-r from-emerald-200 via-white/40 to-sky-200 shadow-lg">
            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/30">

              {/* HEADER */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-emerald-600 ">
                  Guptodhan Vendor Signup
                </h2>
                <span className="text-sm font-medium">
                  Step {step} of 4
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-6">

                {/* SIDEBAR */}
                <aside className="space-y-4">
                  <StepBadge number={1} title="Business Info" icon={<Briefcase />} isActive={step === 1} />
                  <StepBadge number={2} title="Owner Info" icon={<User />} isActive={step === 2} />
                  <StepBadge number={3} title="Attachments" icon={<Paperclip />} isActive={step === 3} />
                  <StepBadge number={4} title="Verify Email" icon={<Shield />} isActive={step === 4} />
                </aside>

                {/* MAIN */}
                <main className="md:col-span-2 bg-white/60 rounded-2xl p-6">

                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-emerald-600 font-semibold pb-2">Business Name *</Label>
                        <Input {...register("business_name", { required: true })} />
                      </div>
                      <div>
                        <Label className="text-emerald-600 font-semibold pb-2">Business Category *</Label>
                        <Select
                          isMulti
                          options={categoryOptions}
                          value={selectedCategories}
                          onChange={(v) =>
                            setValue("business_category", v as any, { shouldValidate: true })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-emerald-600 font-semibold pb-2">Trade License Number</Label>
                        <Input {...register("trade_license_number")} />
                      </div>
                      <div>
                        <Label className="text-emerald-600 font-semibold pb-2">Business Address</Label>
                        <Input {...register("business_address")} />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-emerald-600 font-semibold pb-2">Owner Name</Label>
                        <Input placeholder="Owner Name" {...register("owner_name", { required: true })} />
                      </div>
                      <div>
                        <Label className="text-emerald-600 font-semibold pb-2">Owner Phone Number</Label>
                        <Input placeholder="Phone Number" {...register("owner_number", { required: true })} />
                      </div>
                      <div>
                        <Label className="text-emerald-600 font-semibold pb-2">Owner Email</Label>
                        <Input placeholder="Email" {...register("owner_email", { required: true })} />
                      </div>
                      <div>
                        <Label className="text-emerald-600 font-semibold pb-2">Add Your Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...register("owner_email_password", { required: true, minLength: 8 })}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-emerald-600 font-semibold pb-2">Owner NID Image *</Label>
                        <UploadImage name="ownerNid" onChange={onFileChange} />
                      </div>
                      <div>
                        <Label className="text-emerald-600 font-semibold pb-2">Trade License Image *</Label>
                        <UploadImage name="tradeLicense" onChange={onFileChange} />
                      </div>
                    </div>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <p className="text-sm">
                        OTP sent to <b>{ownerEmail}</b>
                      </p>
                      <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        className="text-center text-2xl"
                      />
                      <Button onClick={verifyOtpAndSubmit} disabled={isOtpLoading}>
                        Complete Registration
                      </Button>
                    </div>
                  )}

                  {/* NAV */}
                  <div className="flex justify-between mt-6">
                    {step > 1 && (
                      <Button variant="outline" onClick={back}>
                        <ArrowLeft /> Back
                      </Button>
                    )}
                    {step < 4 && (
                      <Button variant={'GreenBtn'} onClick={next}>
                        Next <ArrowRight />
                      </Button>
                    )}
                  </div>

                </main>
              </div>

              {/* FOOTER */}
              <div className="mt-8 text-center text-sm">
                Already have an account?{" "}
                <Link href="/vendor-singin" className="text-emerald-600 font-semibold">
                  Sign In
                </Link>
              </div>
              <div className="mt-8 text-center text-sm">
                Go back to{" "}
                <Link href="/" className="text-emerald-600 font-semibold">
                  Home Page
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS */}
      <Dialog open={isSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader className="text-center">
            <CheckCircle className="mx-auto text-emerald-500" size={48} />
            <DialogTitle>Request Submitted</DialogTitle>
            <DialogDescription>
              Admin will review your request soon.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

