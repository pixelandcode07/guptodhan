"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Eye,
  EyeOff,
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
import { SITE_CONFIG } from "@/lib/config/siteConfig";

type CategoryOption = { value: string; label: string };

type Inputs = {
  business_name: string;
  trade_license_number: string;
  business_address: string;
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
  const [fileErrors, setFileErrors] = useState({ nid: "", trade: "" });
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const otpInputRef = useRef<HTMLInputElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null); // ✅ Submit বাটনের রেফারেন্স

  const {
    register,
    trigger,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors,
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

  useEffect(() => {
    if (step === 4 && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // ✅ Step 3-তে Enter বাটন চাপলে স্বয়ংক্রিয়ভাবে Next-এ যাওয়ার লজিক
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && step === 3) {
        e.preventDefault();
        submitBtnRef.current?.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step]);

  // Backend message থেকে কোন field duplicate সেটা নির্ধারণ করে error set করে
  const applyDuplicateError = (backendMessage: string) => {
    const lower = backendMessage.toLowerCase();

    if (lower.includes("email")) {
      setError("owner_email", {
        type: "manual",
        message: backendMessage,
      });
      toast.error(backendMessage);
      return;
    }

    if (lower.includes("phone")) {
      setError("owner_number", {
        type: "manual",
        message: backendMessage,
      });
      toast.error(backendMessage);
      return;
    }

    // কোনো specific field match না হলে দুটোতেই দেখাও
    toast.error(backendMessage);
  };

  const next = async () => {
    if (step === 1) {
      const ok = await trigger([
        "business_name",
        "trade_license_number",
        "business_address",
      ]);

      const hasCategory = selectedCategories && selectedCategories.length > 0;
      if (!hasCategory) {
        setError("business_category", {
          type: "manual",
          message: "Please select at least one category",
        });
      } else {
        clearErrors("business_category");
      }

      if (!ok || !hasCategory) return;
      setStep((p) => p + 1);
    }

    if (step === 2) {
      const ok = await trigger([
        "owner_name",
        "owner_number",
        "owner_email",
        "owner_email_password",
      ]);
      if (!ok) return;

      setIsChecking(true);
      try {
        await axios.post("/api/v1/auth/check-duplicate", {
          email: getValues("owner_email"),
          phoneNumber: getValues("owner_number"),
        });

        setStep((p) => p + 1);
      } catch (err: any) {
        const backendMessage: string =
          err?.response?.data?.message ||
          "Something went wrong. Please try again.";

        applyDuplicateError(backendMessage);
      } finally {
        setIsChecking(false);
      }
    }

    if (step === 3) {
      let filesValid = true;
      const newFileErrors = { nid: "", trade: "" };

      if (!ownerNidFile) {
        newFileErrors.nid = "Owner NID image is required";
        filesValid = false;
      }
      if (!tradeLicenseFile) {
        newFileErrors.trade = "Trade license image is required";
        filesValid = false;
      }

      setFileErrors(newFileErrors);
      if (!filesValid) return;

      await sendOtp();
    }
  };

  const back = () => setStep((p) => p - 1);

  const onFileChange = (name: string, file: File | null) => {
    if (name === "ownerNid") {
      setOwnerNidFile(file);
      if (file) setFileErrors((prev) => ({ ...prev, nid: "" }));
    }
    if (name === "tradeLicense") {
      setTradeLicenseFile(file);
      if (file) setFileErrors((prev) => ({ ...prev, trade: "" }));
    }
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      if (!isChecking) await next();
    } else {
      if (!isOtpLoading) await verifyOtpAndSubmit();
    }
  };

  return (
    <>
      <div className="min-h-screen md:py-12 md:px-6 bg-gradient-to-b from-[#e0f2fe] via-white/60 to-[#ecfdf5]">
        <div className="md:max-w-[80vw] mx-auto">
          <div className="md:rounded-3xl p-1 bg-gradient-to-r from-emerald-200 via-white/40 to-sky-200 shadow-lg">
            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-2 md:p-10 border border-white/30">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-md md:text-2xl font-extrabold text-emerald-600">
                  Guptodhan Vendor Signup
                </h2>
                <span className="text-sm font-medium">Step {step} of 4</span>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* SIDEBAR */}
                <aside className="space-y-4 grid grid-cols-2 md:block">
                  <StepBadge number={1} title="Business Info" icon={<Briefcase />} isActive={step === 1} />
                  <StepBadge number={2} title="Owner Info" icon={<User />} isActive={step === 2} />
                  <StepBadge number={3} title="Attachments" icon={<Paperclip />} isActive={step === 3} />
                  <StepBadge number={4} title="Verify Email" icon={<Shield />} isActive={step === 4} />
                </aside>

                {/* MAIN FORM */}
                <form
                  className="md:col-span-2 bg-white/60 rounded-2xl p-6"
                  onSubmit={handleFormSubmit}
                >
                  {/* STEP 1 */}
                  <div style={{ display: step === 1 ? "block" : "none" }}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <Label className="text-emerald-600 font-semibold pb-2">Business Name *</Label>
                        <Input
                          {...register("business_name", { required: "Business name is required" })}
                          placeholder="Example: XYZ enterprise"
                        />
                        {errors.business_name && (
                          <span className="text-red-500 text-xs mt-1 font-medium">{errors.business_name.message}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Label className="text-emerald-600 font-semibold pb-2">Business Category *</Label>
                        <Select
                          isMulti
                          options={categoryOptions}
                          value={selectedCategories}
                          onChange={(v) => {
                            setValue("business_category", v as any, { shouldValidate: true });
                            if (v && v.length > 0) clearErrors("business_category");
                          }}
                        />
                        {errors.business_category && (
                          <span className="text-red-500 text-xs mt-1 font-medium">{errors.business_category.message}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Label className="text-emerald-600 font-semibold pb-2">Trade License Number *</Label>
                        <Input
                          {...register("trade_license_number", { required: "Trade license number is required" })}
                          placeholder="Valid Trade License Number."
                        />
                        {errors.trade_license_number && (
                          <span className="text-red-500 text-xs mt-1 font-medium">{errors.trade_license_number.message}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Label className="text-emerald-600 font-semibold pb-2">Business Address *</Label>
                        <Input
                          {...register("business_address", { required: "Business address is required" })}
                          placeholder="Example: 123 Main Street, City, Country"
                        />
                        {errors.business_address && (
                          <span className="text-red-500 text-xs mt-1 font-medium">{errors.business_address.message}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div style={{ display: step === 2 ? "block" : "none" }}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <Label className="text-emerald-600 font-semibold pb-2">Owner Name *</Label>
                        <Input
                          placeholder="Owner Name"
                          {...register("owner_name", { required: "Owner name is required" })}
                        />
                        {errors.owner_name && (
                          <span className="text-red-500 text-xs mt-1 font-medium">{errors.owner_name.message}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Label className="text-emerald-600 font-semibold pb-2">Owner Phone Number *</Label>
                        <Input
                          placeholder="Phone Number"
                          {...register("owner_number", { required: "Phone number is required" })}
                        />
                        {errors.owner_number && (
                          <span className="text-red-500 text-xs mt-1 font-medium">{errors.owner_number.message}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Label className="text-emerald-600 font-semibold pb-2">Owner Email *</Label>
                        <Input
                          placeholder="Email"
                          type="email"
                          {...register("owner_email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email address",
                            },
                          })}
                        />
                        {errors.owner_email && (
                          <span className="text-red-500 text-xs mt-1 font-medium">{errors.owner_email.message}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Label className="text-emerald-600 font-semibold pb-2">Add Your Password *</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...register("owner_email_password", {
                              required: "Password is required",
                              minLength: { value: 8, message: "Password must be at least 8 characters" },
                            })}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                        {errors.owner_email_password && (
                          <span className="text-red-500 text-xs mt-1 font-medium">{errors.owner_email_password.message}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div style={{ display: step === 3 ? "block" : "none" }}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <Label className="text-emerald-600 font-semibold pb-2">Owner NID Image *</Label>
                        <UploadImage name="ownerNid" onChange={onFileChange} />
                        {fileErrors.nid && (
                          <span className="text-red-500 text-xs mt-1 font-medium">{fileErrors.nid}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Label className="text-emerald-600 font-semibold pb-2">Trade License Image *</Label>
                        <UploadImage name="tradeLicense" onChange={onFileChange} />
                        {fileErrors.trade && (
                          <span className="text-red-500 text-xs mt-1 font-medium">{fileErrors.trade}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* STEP 4 */}
                  <div style={{ display: step === 4 ? "block" : "none" }}>
                    <div className="space-y-4">
                      <p className="text-sm">
                        OTP sent to <b>{ownerEmail}</b>
                      </p>
                      <Input
                        ref={otpInputRef}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest"
                      />
                      <Button type="submit" disabled={isOtpLoading}>
                        {isOtpLoading ? "Submitting..." : "Complete Registration"}
                      </Button>
                    </div>
                  </div>

                  {/* NAV */}
                  <div className="flex justify-between mt-6">
                    {step > 1 && (
                      <Button type="button" variant="outline" onClick={back}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                    )}
                    {step < 4 && (
                      <Button
                        ref={submitBtnRef} // ✅ Reference যুক্ত করা হলো
                        type="submit"
                        className="ml-auto"
                        variant={"GreenBtn"}
                        disabled={isChecking}
                      >
                        {isChecking ? "Checking..." : (
                          <> Next <ArrowRight className="ml-2 h-4 w-4" /> </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* FOOTER */}
              <div className="mt-8 text-center text-sm">
                Already have an account?{" "}
                <Link href="/vendor-singin" className="text-emerald-600 font-semibold">
                  Sign In
                </Link>
              </div>
              <div className="mt-2 text-center text-sm">
                Go back to{" "}
                <Link href={SITE_CONFIG.mainUrl} className="text-emerald-600 font-semibold">
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
            <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
            <DialogTitle>Request Submitted</DialogTitle>
            <DialogDescription>
              Admin will review your request soon.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => (window.location.href = SITE_CONFIG.mainUrl)}>
            Go Home
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}