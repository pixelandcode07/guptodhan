"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/TableHelper/data-table";
import { QuestionAnswer, question_answer_columns } from "@/components/TableHelper/question_answer_columns";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function ViewAllQuestionsAnswersPage() {
  const [data, setData] = useState<QuestionAnswer[]>([]);
  const { data: session } = useSession();

  type Session = {
    user?: { role?: string; id?: string };
    accessToken?: string;
  };
  const s = session as Session | null;
  const token = s?.accessToken;
  const userRole = s?.user?.role;

  const fetchProductQA = useCallback(async () => {
    try {
      console.log("Fetching product Q&A with:", { token: !!token, userRole });
      
      const response = await axios.get("/api/v1/product-qna", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

      console.log("API Response:", response.data);

      type ApiProductQA = {
        _id?: string;
        qaId?: string;
        productId?: string;
        userId?: string;
        userName?: string;
        userEmail?: string;
        userImage?: string;
        question?: string;
        createdAt?: string;
        status?: string;
        answer?: {
          answeredByName?: string;
          answeredByEmail?: string;
          answerText?: string;
          createdAt?: string;
        };
      };

      const items: ApiProductQA[] = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      console.log("Items found:", items.length, items);

      const mapped: QuestionAnswer[] = items.map((qa, index) => ({
        id: index + 1,
        image: qa.userImage || "",
        product: String(qa.productId ?? ""),
        customers_name: String(qa.userName ?? ""),
        email: String(qa.userEmail ?? ""),
        question: String(qa.question ?? ""),
        answer_from_admin: qa.answer?.answerText || "",
        created_at: qa.createdAt
          ? new Date(qa.createdAt).toLocaleString()
          : "",
      }));

      console.log("Mapped Q&A:", mapped);
      setData(mapped);
    } catch (error) {
      console.error("Failed to fetch product Q&A", error);
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchProductQA();
  }, [fetchProductQA]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-2 py-3 sm:px-3 sm:py-4 md:px-4 md:py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Questions & Answers</h1>
        </div>

        {/* Table Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <DataTable columns={question_answer_columns} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
