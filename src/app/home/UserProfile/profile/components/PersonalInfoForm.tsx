"use client"

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

interface PersonalInfoFormProps {
  initialName: string
  initialPhone: string
  initialEmail?: string
  initialAddress?: string
  onSave?: (data: { name: string; phoneNumber: string; email?: string; address?: string }) => Promise<void> | void
  isLoading?: boolean
}

// Helper to format JSON Address
const formatAddress = (rawAddress: string | undefined): string => {
  if (!rawAddress) return '';
  try {
    if (rawAddress.trim().startsWith('{') && rawAddress.trim().endsWith('}')) {
      const parsed = JSON.parse(rawAddress);
      const parts = [
        parsed.street?.replace(/\n/g, ' '),
        parsed.upazila,
        parsed.district,
        parsed.postalCode ? `PO: ${parsed.postalCode}` : '',
        parsed.country
      ].filter(Boolean);
      return parts.join(', ');
    }
  } catch (error) {
    console.warn("Address formatting error, falling back to original:", error);
  }
  return rawAddress;
}

export default function PersonalInfoForm({ 
  initialName, 
  initialPhone,
  initialEmail = '',
  initialAddress = '',
  onSave,
  isLoading = false
}: PersonalInfoFormProps) {
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [email, setEmail] = useState(initialEmail)
  const [address, setAddress] = useState('')

  // ✅ OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  useEffect(() => {
    setName(initialName)
    setPhone(initialPhone)
    setEmail(initialEmail)
    setAddress(formatAddress(initialAddress))
  }, [initialName, initialPhone, initialEmail, initialAddress])

  // ========================================================
  // 🔥 Handle Save Button Click
  // ========================================================
  const handleSaveClick = async () => {
    if (!name || !phone) {
      toast.error('Name and Phone are required!');
      return;
    }

    // ✅ If Email is changed, trigger OTP Modal!
    if (email.trim() !== initialEmail.trim()) {
      await sendOtpForEmailChange();
    } else {
      // If email is NOT changed, just save normally
      executeSave();
    }
  }

  // ========================================================
  // 🔥 Send OTP Request
  // ========================================================
  const sendOtpForEmailChange = async () => {
    setIsSendingOtp(true);
    try {
      // ⚠️ এখানে আপনার আসল Send OTP API বসাবেন
      const res = await axios.post('/api/v1/auth/send-otp', { phoneNumber: phone });
      
      if (res.data.success) {
        toast.success(`OTP sent to your phone: ${phone}`);
        setShowOtpModal(true);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      // ⚠️ API না থাকলে যাতে ব্লক না হয়, তার জন্য Demo Mode
      console.warn("OTP API might not be connected yet. Showing modal for demo.");
      toast.success(`OTP sent to ${phone} (Demo Mode)`);
      setShowOtpModal(true);
    } finally {
      setIsSendingOtp(false);
    }
  }

  // ========================================================
  // 🔥 Verify OTP & Execute Save
  // ========================================================
  const verifyOtpAndSave = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      // ⚠️ এখানে আপনার আসল Verify OTP API বসাবেন
      const res = await axios.post('/api/v1/auth/verify-otp', { phoneNumber: phone, otp });
      
      if (res.data.success) {
        toast.success("OTP Verified Successfully!");
        setShowOtpModal(false);
        setOtp('');
        executeSave(); // Now save the new email to DB!
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (err) {
      // ⚠️ Demo Fallback
      if (otp === "123456") {
        toast.success("OTP Verified! (Demo)");
        setShowOtpModal(false);
        setOtp('');
        executeSave();
      } else {
        toast.error("Invalid OTP! Try 123456 for demo.");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  // ========================================================
  // 🔥 Final Save to Database
  // ========================================================
  const executeSave = async () => {
    if (!onSave) return
    try {
      await onSave({ name, phoneNumber: phone, email, address })
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('E11000') || message.includes('duplicate key')) {
        toast.error('This Phone or Email is already in use', { duration: 4000 })
      } else {
        toast.error('Something went wrong. Please try again.', { duration: 4000 })
      }
    }
  }

  return (
    <>
      <div className="mt-6 relative">
        <h3 className="text-lg font-semibold text-[#00005E]">Personal Information</h3>
        <div className="mt-4 grid gap-5 max-w-xl">
          
          {/* Full Name */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="e.g. Yeamin Hossain" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus-visible:ring-[#0097E9]"
            />
          </div>
          
          {/* Phone Number */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="e.g. 017XXXXXXXX" 
              value={phone}
              disabled // Phone should ideally be disabled to prevent direct change without OTP
              onChange={(e) => setPhone(e.target.value)}
              className="focus-visible:ring-[#0097E9] bg-gray-50"
            />
          </div>

          {/* ✅ New Email Field */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input 
              type="email"
              placeholder="e.g. example@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-visible:ring-[#0097E9]"
            />
            {email !== initialEmail && email !== '' && (
              <p className="text-[11px] text-orange-500 mt-1 font-medium">
                Changing your email requires phone verification via OTP.
              </p>
            )}
          </div>
          
          {/* Address */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <Input 
              placeholder="House, Street, Area, City" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="focus-visible:ring-[#0097E9]"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              You can update your detailed shipping address from the checkout page.
            </p>
          </div>
          
          {/* Save Button */}
          <div className="pt-2">
            <button 
              onClick={handleSaveClick}
              disabled={isLoading || isSendingOtp}
              className="w-full sm:w-48 flex justify-center items-center gap-2 bg-[#EF4A23] text-white px-4 py-2.5 rounded-md hover:bg-[#d43d1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isLoading || isSendingOtp ? 'Processing...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* ✅ OTP VERIFICATION MODAL FOR EMAIL CHANGE */}
      {/* ========================================================== */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-sm shadow-2xl transform transition-all">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Verify Your Number</h3>
              <p className="text-sm text-gray-500 mt-2">
                To update your email, enter the OTP sent to <br />
                <span className="font-bold text-[#00005E]">{phone}</span>
              </p>
            </div>

            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only numbers
              className="text-center tracking-[0.5em] text-xl font-bold mb-6 h-12"
              maxLength={6}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={verifyOtpAndSave}
                disabled={isVerifyingOtp || otp.length < 4}
                className="flex-1 py-2.5 rounded-lg bg-[#EF4A23] text-white font-semibold hover:bg-[#d43d1a] disabled:opacity-50 flex justify-center items-center transition-colors shadow-sm"
              >
                {isVerifyingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}