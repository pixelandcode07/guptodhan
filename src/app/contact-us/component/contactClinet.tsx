"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Home, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactClient() {
  const [loading, setLoading] = useState(false);

  // Form Submit Handler (Simulated)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // এখানে আপনি আপনার API কল করবেন।
    // সিমুলেশন এর জন্য setTimeout ব্যবহার করা হলো:
    setTimeout(() => {
        setLoading(false);
        toast.success("Message sent successfully!", {
            description: "We'll get back to you as soon as possible."
        });
        // ফর্ম রিসেট
        (e.target as HTMLFormElement).reset();
    }, 2000);
  };

  return (
    <div className="font-sans text-slate-800 pb-16">
      
      {/* --- Breadcrumb & Header Section (Consistent with Policy Pages) --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#00005E] transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" /> Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#00005E] font-medium">Contact Us</span>
          </nav>

          {/* Title Row */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#00005E] tracking-tight flex items-center gap-3">
              Get in Touch
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
              Have questions about buying, selling, or our services? We're here to help. Reach out to us using the information below or send a message.
            </p>
          </div>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
          
          {/* Left Column: Contact Information & Map */}
          <div className="lg:col-span-1 space-y-8 order-2 lg:order-1">
            
            {/* Info Cards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h3 className="text-lg font-semibold text-[#00005E] mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                    {/* Address */}
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full shrink-0">
                            <MapPin className="w-5 h-5 text-[#00005E]" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-1">Our Office</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Level 4, Guptodhan Tower,<br />
                                Banani, Dhaka - 1213, Bangladesh
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full shrink-0">
                            <Phone className="w-5 h-5 text-[#00005E]" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-1">Phone Number</h4>
                            <p className="text-sm text-gray-600">
                                <a href="tel:+880123456789" className="hover:text-[#00005E] transition">+880 1234 567 890</a>
                            </p>
                            <p className="text-sm text-gray-600">
                                <a href="tel:+880987654321" className="hover:text-[#00005E] transition">+880 9876 543 210</a>
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full shrink-0">
                            <Mail className="w-5 h-5 text-[#00005E]" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-1">Email Address</h4>
                            <p className="text-sm text-gray-600">
                                <a href="mailto:support@guptodhan.com" className="hover:text-[#00005E] transition">support@guptodhan.com</a>
                            </p>
                            <p className="text-sm text-gray-600">
                                <a href="mailto:info@guptodhan.com" className="hover:text-[#00005E] transition">info@guptodhan.com</a>
                            </p>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-full shrink-0">
                            <Clock className="w-5 h-5 text-[#00005E]" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-1">Business Hours</h4>
                            <p className="text-sm text-gray-600">Sunday - Thursday: 9AM - 6PM</p>
                            <p className="text-sm text-gray-600">Friday - Saturday: Closed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Map Placeholder (Optional - You can embed real iframe here) */}
            <div className="bg-gray-200 rounded-xl h-64 w-full flex items-center justify-center text-gray-500 border border-gray-300 overflow-hidden relative">
                <MapPin className="w-10 h-10 opacity-50 mb-2" />
                <span className="absolute bottom-4 text-sm font-medium bg-white/80 px-3 py-1 rounded-full shadow-sm">Google Map Embed Area</span>
                 {/* Example Iframe (Uncomment to use a real map) */}
                 {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8838347829!2d90.4006!3d23.7508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b888ad3b9851%3A0x3000000000000000!2sDhaka!5e0!3m2!1sen!2sbd!4v1234567890" width="100%" height="100%" style={{border:0}} allowFullScreen={true} loading="lazy"></iframe> */}
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-12">
                <h2 className="text-2xl font-bold text-[#00005E] mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 font-medium">Full Name <span className="text-red-500">*</span></Label>
                            <Input id="name" name="name" placeholder="John Doe" required className="bg-gray-50 border-gray-300 focus-visible:ring-[#00005E]" />
                        </div>
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium">Email Address <span className="text-red-500">*</span></Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" required className="bg-gray-50 border-gray-300 focus-visible:ring-[#00005E]" />
                        </div>
                    </div>

                    {/* Phone (Optional) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                            <Input id="phone" name="phone" placeholder="+880 1xxxxxxxxx" className="bg-gray-50 border-gray-300 focus-visible:ring-[#00005E]" />
                        </div>
                        {/* Subject */}
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-gray-700 font-medium">Subject <span className="text-red-500">*</span></Label>
                            <Input id="subject" name="subject" placeholder="How can we help?" required className="bg-gray-50 border-gray-300 focus-visible:ring-[#00005E]" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-700 font-medium">Message <span className="text-red-500">*</span></Label>
                        <Textarea id="message" name="message" placeholder="Write your message here..." rows={6} required className="bg-gray-50 border-gray-300 focus-visible:ring-[#00005E] resize-none" />
                    </div>

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full md:w-auto md:min-w-[200px] bg-[#00005E] hover:bg-[#000045] text-white py-6 text-lg h-auto gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {loading ? "Sending..." : "Send Message"}
                    </Button>

                </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}