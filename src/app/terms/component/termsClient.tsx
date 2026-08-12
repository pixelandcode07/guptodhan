"use client";

import React from "react";
import { format } from "date-fns";
import { Printer, ChevronRight, Home, CalendarDays, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TermsData {
  _id: string;
  content: string;
  updatedAt?: string;
  createdAt?: string;
}

interface TermsClientProps {
  data: TermsData[] | TermsData | null;
}

export default function TermsClient({ data }: TermsClientProps) {
  const termsObj = Array.isArray(data) ? data[0] : data;
  const content = termsObj?.content || "";
  const updatedAt = termsObj?.updatedAt || termsObj?.createdAt;

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
            <span className="text-[#00005E] font-medium">Terms & Conditions</span>
          </nav>

          {/* Title Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00005E] tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-gray-500 mt-2 text-sm md:text-base">
                Please read these terms carefully before using Guptodhan services.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {updatedAt && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md border">
                  <CalendarDays className="w-4 h-4" />
                  <span>Effective: {format(new Date(updatedAt), "MMMM dd, yyyy")}</span>
                </div>
              )}
              <Button 
                onClick={handlePrint}
                variant="outline" 
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print Terms</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Dynamic Terms Content */}
          <div className="flex-1 bg-white p-6 md:p-10 rounded-2xl shadow-xs border border-gray-200">
            {content ? (
              <div 
                className="prose prose-slate max-w-none 
                  prose-headings:text-[#00005E] prose-headings:font-bold
                  prose-h2:text-xl prose-h2:md:text-2xl prose-h2:border-b prose-h2:pb-2 prose-h2:mt-8 prose-h2:mb-4
                  prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                  prose-li:text-gray-600 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                  prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="py-12 text-center">
                <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions Updating</h3>
                <p className="text-gray-500 text-sm mt-1">
                  We are currently updating our terms and conditions. Please check back shortly.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar Navigation & Support */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="font-bold text-gray-900 mb-4 text-base">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/privacy" className="block p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/return" className="block p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Return & Refund Policy
                </Link>
                <Link href="/shipping" className="block p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Shipping Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
