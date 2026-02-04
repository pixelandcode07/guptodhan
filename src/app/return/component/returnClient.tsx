"use client";

import React from "react";
import { format } from "date-fns";
import { 
  Printer, 
  ChevronRight, 
  Home, 
  CalendarDays, 
  Undo2, 
  RefreshCcw,
  AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 

interface ReturnPolicyData {
  _id: string;
  content: string;
  updatedAt: string;
}

interface ReturnClientProps {
  data: ReturnPolicyData | null;
}

export default function ReturnClient({ data }: ReturnClientProps) {
  
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
            <span className="text-[#00005E] font-medium">Return Policy</span>
          </nav>

          {/* Title Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00005E] tracking-tight flex items-center gap-3">
                Return & Refund Policy
              </h1>
              <p className="text-gray-500 mt-2 text-sm md:text-base">
                Guidelines for returns, exchanges, and refunds at Guptodhan.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {data?.updatedAt && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md border">
                  <CalendarDays className="w-4 h-4" />
                  <span>Updated: {format(new Date(data.updatedAt), "MMMM dd, yyyy")}</span>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-12 min-h-[60vh]">
              {data ? (
                <article 
                  className="prose prose-slate max-w-none lg:prose-lg
                  prose-headings:text-[#00005E] prose-headings:font-bold prose-headings:scroll-mt-20
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900
                  prose-li:marker:text-[#00005E]
                  prose-img:rounded-lg
                  "
                  dangerouslySetInnerHTML={{ __html: data.content }} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <RefreshCcw className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700">Policy Unavailable</h3>
                  <p className="text-gray-500 mt-2 max-w-md">
                    We are currently updating our return and refund guidelines. Please contact support for immediate assistance.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sidebar Info */}
          <div className="hidden lg:block w-80 shrink-0 sticky top-32">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-[#00005E] mb-4 flex items-center gap-2">
                <Undo2 className="w-5 h-5" /> Quick Actions
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Need to return an item? Start the process easily from your order history page.
              </p>
              
              <div className="space-y-3">
                <Link href="/dashboard/my-orders" className="block w-full">
                   <Button className="w-full bg-[#00005E] hover:bg-[#000045]">
                     Request a Return
                   </Button>
                </Link>
                <Link href="/support" className="block w-full text-center text-sm text-gray-500 hover:text-[#00005E] hover:underline">
                  Contact Customer Care
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Return Conditions
                </h4>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span>Product must be unused</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span>Original packaging required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span>Receipt/Proof of purchase</span>
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
            Has your refund been delayed?
          </p>
          <Link href="/support" className="text-[#00005E] font-semibold hover:underline">
            Check Refund Status &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}