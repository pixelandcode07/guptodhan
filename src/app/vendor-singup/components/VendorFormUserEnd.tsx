"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Select from "react-select";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  Paperclip,
  Save,
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
  const [step, setStep] = useState(1);
  const [ownerNidFile, setOwnerNidFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: {
      business_category: [],
      business_name: "",
      owner_name: "",
      owner_number: "",
      owner_email: "",
      owner_email_password: "",
    },
  });

  const categoryOptions: CategoryOption[] = vendorCategories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const selectedCategories = watch("business_category");
  const ownerEmail = watch("owner_email");

  // Next Button with Validation
  const next = async () => {
    let isValid = false;

    if (step === 1) {
      const nameValid = await trigger("business_name");
      const hasCategory = selectedCategories && selectedCategories.length > 0;

      if (!nameValid) toast.error("Business name is required");
      else if (!hasCategory) toast.error("Please select at least one business category");
      else isValid = true;
    }

    if (step === 2) {
      isValid = await trigger([
        "owner_name",
        "owner_number",
        "owner_email",
        "owner_email_password",
      ]);
      if (!isValid) toast.error("Please fill all owner information correctly");
    }

    if (step === 3) {
      if (!ownerNidFile) {
        toast.error("Owner NID is required");
        return;
      }
      if (!tradeLicenseFile) {
        toast.error("Trade License document is required");
        return;
      }
      isValid = true;
    }

    if (isValid) {
      if (step === 3) {
        // Send OTP before moving to Step 4
        await sendOtp();
      } else {
        setStep((prev) => Math.min(4, prev + 1));
      }
    }
  };

  const back = () => setStep((prev) => Math.max(1, prev - 1));

  const onFileChange = (name: string, file: File | null) => {
    if (name === "ownerNid") setOwnerNidFile(file);
    if (name === "tradeLicense") setTradeLicenseFile(file);
  };

  // Send OTP (called after Step 3 validation)
  const sendOtp = async () => {
    if (!ownerEmail) {
      toast.error("Email is required");
      return;
    }

    setIsOtpLoading(true);
    try {
      await axios.post("/api/v1/auth/vendor-forgot-password/send-otp", {
        email: ownerEmail,
      });
      toast.success("OTP sent to your email!");
      setStep(4); // Move to OTP step
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsOtpLoading(false);
    }
  };

  // Verify OTP and Submit Full Application
  const verifyOtpAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsOtpLoading(true);
    try {
      // Step 1: Verify OTP
      const verifyRes = await axios.post("/api/v1/auth/vendor-forgot-password/verify-otp", {
        email: ownerEmail,
        otp,
      });

      // Optional: backend may return a token
      const otpToken = verifyRes.data?.data?.token || null;

      // Step 2: Submit full registration data
      const data = getValues();
      const formData = new FormData();

      formData.append("name", data.owner_name);
      formData.append("email", data.owner_email);
      formData.append("password", data.owner_email_password);
      formData.append("phoneNumber", data.owner_number);
      formData.append("businessName", data.business_name);
      formData.append("businessAddress", data.business_address || "");
      formData.append("tradeLicenseNumber", data.trade_license_number || "");
      formData.append("ownerName", data.owner_name);

      const categoryIds = data.business_category.map((c) => c.value);
      formData.append("businessCategory", JSON.stringify(categoryIds));

      formData.append("ownerNid", ownerNidFile!);
      formData.append("tradeLicense", tradeLicenseFile!);
      formData.append("status", "pending");

      // If backend requires OTP verification token
      if (otpToken) {
        formData.append("otpToken", otpToken);
      }

      await axios.post("/api/v1/auth/register-vendor", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsSuccessDialogOpen(true);
      toast.success("Your vendor request submitted successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification or submission failed");
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
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
                    G
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">
                      Guptodhan Vendor Signup
                    </h2>
                    <p className="text-sm text-slate-600">
                      Create your vendor account and start selling on Guptodhan.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-72">
                    <div className="h-3 bg-white/40 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(step / 4) * 100}%` }}
                        className="h-3 bg-emerald-500 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 font-medium">
                    Step {step} of 4
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Steps Sidebar */}
                <aside className="md:col-span-1">
                  <div className="space-y-4 sticky top-6">
                    <StepBadge
                      number={1}
                      title="Business Info"
                      icon={<Briefcase size={18} />}
                      isActive={step === 1}
                    />
                    <StepBadge
                      number={2}
                      title="Owner Info"
                      icon={<User size={18} />}
                      isActive={step === 2}
                    />
                    <StepBadge
                      number={3}
                      title="Attachments"
                      icon={<Paperclip size={18} />}
                      isActive={step === 3}
                    />
                    <StepBadge
                      number={4}
                      title="Verify OTP"
                      icon={<Shield size={18} />}
                      isActive={step === 4}
                    />
                  </div>
                </aside>

                {/* Main Form */}
                <main className="md:col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-inner">
                  <form className="space-y-6">
                    {/* Step 1: Business Information */}
                    {step === 1 && (
                      <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Business Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>
                              Business Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              {...register("business_name", {
                                required: "Business name is required",
                              })}
                              placeholder="Ex: Guptodhan's Grocery"
                              className="mt-1"
                            />
                            {errors.business_name && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.business_name.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label>
                              Business Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              isMulti
                              options={categoryOptions}
                              value={selectedCategories}
                              onChange={(selected) =>
                                setValue("business_category", selected as any, {
                                  shouldValidate: true,
                                })
                              }
                              className="mt-1"
                              classNamePrefix="react-select"
                              placeholder="Select categories..."
                            />
                            {!selectedCategories?.length && (
                              <p className="text-red-600 text-sm mt-1">
                                At least one category required
                              </p>
                            )}
                          </div>

                          <div>
                            <Label>Trade License Number</Label>
                            <Input
                              {...register("trade_license_number")}
                              placeholder="Optional"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Business Address</Label>
                            <Input
                              {...register("business_address")}
                              placeholder="Street, City, Area"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Step 2: Owner Information */}
                    {step === 2 && (
                      <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Owner / Login Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              {...register("owner_name", { required: "Required" })}
                              placeholder="Owner's full name"
                              className="mt-1"
                            />
                            {errors.owner_name && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.owner_name.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label>
                              Phone Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              {...register("owner_number", { required: "Required" })}
                              placeholder="+8801XXXXXXXXX"
                              className="mt-1"
                            />
                            {errors.owner_number && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.owner_number.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label>
                              Login Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="email"
                              {...register("owner_email", { required: "Required" })}
                              placeholder="email@example.com"
                              className="mt-1"
                            />
                            {errors.owner_email && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.owner_email.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label>
                              Password <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="password"
                              {...register("owner_email_password", {
                                required: "Required",
                                minLength: {
                                  value: 8,
                                  message: "Minimum 8 characters",
                                },
                              })}
                              placeholder="Create strong password"
                              className="mt-1"
                            />
                            {errors.owner_email_password && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.owner_email_password.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Step 3: Document Uploads */}
                    {step === 3 && (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <Label className="mb-3 block">
                            Upload Owner NID Card <span className="text-red-500">*</span>
                          </Label>
                          <UploadImage name="ownerNid" onChange={onFileChange} />
                          {!ownerNidFile && (
                            <p className="text-red-600 text-sm mt-2">NID is required</p>
                          )}
                        </div>
                        <div>
                          <Label className="mb-3 block">
                            Upload Business Trade License{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <UploadImage name="tradeLicense" onChange={onFileChange} />
                          {!tradeLicenseFile && (
                            <p className="text-red-600 text-sm mt-2">
                              Trade license is required
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 4: OTP Verification */}
                    {step === 4 && (
                      <section>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Verify Your Email
                        </h3>
                        <p className="text-sm text-slate-600 mb-6">
                          We've sent a 6-digit OTP to <strong>{ownerEmail}</strong>.
                          Please enter it below to complete registration.
                        </p>

                        <form onSubmit={verifyOtpAndSubmit} className="space-y-6">
                          <div>
                            <Label>
                              Enter OTP <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="text"
                              maxLength={6}
                              value={otp}
                              onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, ""))
                              }
                              placeholder="123456"
                              className="text-center text-2xl tracking-widest mt-2"
                            />
                          </div>

                          <div className="flex justify-between items-center">
                            <button
                              type="button"
                              onClick={sendOtp}
                              disabled={isOtpLoading}
                              className="text-emerald-600 text-sm hover:underline"
                            >
                              Resend OTP
                            </button>

                            <Button
                              type="submit"
                              disabled={isOtpLoading || otp.length !== 6}
                              className="bg-emerald-500 hover:bg-emerald-600"
                            >
                              {isOtpLoading ? "Verifying..." : "Complete Registration"}
                            </Button>
                          </div>
                        </form>
                      </section>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                      <div>
                        {step > 1 && (
                          <button
                            type="button"
                            onClick={back}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/30 border border-white/40 hover:bg-white/50"
                          >
                            <ArrowLeft size={16} /> Back
                          </button>
                        )}
                      </div>

                      <div>
                        {step < 4 && (
                          <button
                            type="button"
                            onClick={next}
                            disabled={isOtpLoading}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
                          >
                            Next <ArrowRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </main>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center space-y-2">
                <p className="text-sm text-slate-700">
                  Already have an account?{" "}
                  <Link
                    className="text-emerald-600 font-semibold hover:underline"
                    href="/vendor-singin"
                  >
                    Sign In
                  </Link>
                </p>
                <p className="text-sm text-slate-600">
                  Need help?{" "}
                  <a
                    href="https://wa.me/8801816500600?text=Hello!%20I%20need%20help%20with%20vendor%20registration.%20Thank%20you!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-emerald-700">
              Request Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600 pt-3">
              Your vendor application has been submitted successfully. Admin will
              review your request soon. Please wait until approval. You will be
              notified via email.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsSuccessDialogOpen(false)}
              className="order-2 sm:order-1"
            >
              Stay on this Page
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white order-1 sm:order-2"
            >
              Visit Home Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}