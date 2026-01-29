"use client";

import React from "react";
import { format } from "date-fns";
import { Printer, ChevronRight, Home, CalendarDays, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 

interface PrivacyData {
  _id: string;
  content: string;
  updatedAt: string;
}

interface PrivacyClientProps {
  data: PrivacyData | null;
}

export default function PrivacyClient({ data }: PrivacyClientProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="font-sans text-slate-800">
      
      {/* --- Breadcrumb & Header Section --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#00005E] transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" /> Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#00005E] font-medium">Privacy Policy</span>
          </nav>

          {/* Title Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00005E] tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-gray-500 mt-2 text-sm md:text-base">
                Transparency about how we handle your personal data at Guptodhan.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {data?.updatedAt && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md border">
                  <CalendarDays className="w-4 h-4" />
                  <span>Effective: {format(new Date(data.updatedAt), "MMMM dd, yyyy")}</span>
                </div>
              )}
              <Button 
                variant="outline" 
                onClick={handlePrint}
                className="gap-2 border-gray-300 hover:border-[#00005E] hover:text-[#00005E]"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print Policy</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start max-w-7xl mx-auto">
          
          {/* Left: Content Card */}
          <div className="flex-1 w-full">
            <div className="bg-white p-6 md:p-12 min-h-[60vh]">
              {data ? (
                <article 
                  className="prose prose-slate max-w-none lg:prose-lg
                  prose-headings:text-[#00005E] prose-headings:font-bold prose-headings:scroll-mt-20
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900
                  prose-li:marker:text-[#00005E]
                  "
                  dangerouslySetInnerHTML={{ __html: data.content }} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShieldAlert className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700">Content Unavailable</h3>
                  <p className="text-gray-500 mt-2 max-w-md">
                    We are currently updating our privacy terms. Please contact support if you have urgent queries.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sidebar / Table of Contents / Help (Optional) */}
          <div className="hidden lg:block w-80 shrink-0 sticky top-32">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-[#00005E] mb-4">Need Assistance?</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                If you have questions about your data privacy or rights, our Data Protection Officer is here to help.
              </p>
              
              <div className="space-y-3">
                <Link href="/contact" className="block w-full">
                   <Button className="w-full bg-[#00005E] hover:bg-[#000045]">
                     Contact Support
                   </Button>
                </Link>
                <Link href="/terms" className="block w-full text-center text-sm text-gray-500 hover:text-[#00005E] hover:underline">
                  Terms of Service
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Key Points
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Data Encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    User Control
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Transparent Usage
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- Bottom CTA --- */}
      <div className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">
            Have a specific concern about your data?
          </p>
          <Link href="/support" className="text-[#00005E] font-semibold hover:underline">
            Reach out to our Privacy Team &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}