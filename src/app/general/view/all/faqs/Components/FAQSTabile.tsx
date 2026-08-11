"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FAQSTabile({ initialFaqs }: { initialFaqs: any[] }) {
  const [faqs, setFaqs] = useState(initialFaqs || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusLoading, setStatusLoading] = useState<string | null>(null);
  const router = useRouter();

  // ✅ MAGIC FIX: Status Toggle Handler
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      setStatusLoading(id);
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      // আপনার API রাউট অনুযায়ী স্ট্যাটাস আপডেট করা হচ্ছে
      const res = await axios.patch(`/api/v1/faq/${id}`, { status: newStatus });

      if (res.data.success) {
        toast.success(`Status updated to ${newStatus}!`);
        // UI সাথে সাথে আপডেট করার জন্য
        setFaqs((prev) =>
          prev.map((faq) =>
            faq._id === id ? { ...faq, status: newStatus } : faq
          )
        );
        router.refresh();
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(null);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await axios.delete(`/api/v1/faq/${id}`);
      if (res.data.success) {
        toast.success("FAQ deleted successfully");
        setFaqs((prev) => prev.filter((faq) => faq._id !== id));
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete FAQ");
    }
  };

  // Search Filter
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
        <h2 className="font-semibold text-gray-700 text-lg">All FAQs</h2>
        <Link href="/general/add/new/faq">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
            <Plus size={16} /> Add New FAQ
          </Button>
        </Link>
      </div>

      {/* Controls */}
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          Show
          <select className="border rounded-md px-2 py-1 outline-none">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
          entries
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search FAQs..."
            className="pl-9 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-y bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
              <th className="px-6 py-4">SL</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 w-1/4">Question</th>
              <th className="px-6 py-4 w-1/4">Answer</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredFaqs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No FAQs found.
                </td>
              </tr>
            ) : (
              filteredFaqs.map((faq, index) => (
                <tr key={faq._id} className="hover:bg-gray-50/50 transition-colors">
                  {/* ✅ MAGIC FIX 1: ID-এর বদলে Index + 1 বসানো হয়েছে */}
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {index + 1}
                  </td>

                  {/* ✅ MAGIC FIX 2: Category Object থেকে নাম বের করা হয়েছে */}
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium whitespace-nowrap">
                    {faq.category?.name || "Uncategorized"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p className="line-clamp-2">{faq.question}</p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    <p className="line-clamp-2">{faq.answer}</p>
                  </td>

                  {/* ✅ MAGIC FIX 3: ক্লিকেবল Status Toggle বাটন */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(faq._id, faq.status)}
                      disabled={statusLoading === faq._id}
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border transition-all ${
                        faq.status === "active"
                          ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                          : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      } disabled:opacity-50 flex items-center justify-center mx-auto min-w-[80px]`}
                    >
                      {statusLoading === faq._id ? (
                        <Loader2 className="animate-spin h-3 w-3" />
                      ) : (
                        <span>{faq.status}</span>
                      )}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/general/edit/faq/${faq._id}`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Edit size={14} />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(faq._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination Info */}
      <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div>
          Showing {filteredFaqs.length > 0 ? 1 : 0} to {filteredFaqs.length} of{" "}
          {faqs.length} entries
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="default" size="sm" className="bg-blue-600 text-white">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}