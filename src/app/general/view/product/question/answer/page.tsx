"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/TableHelper/data-table";
import { QuestionAnswer, question_answer_columns } from "@/components/TableHelper/question_answer_columns";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function ViewAllQuestionsAnswersPage() {
  const [data, setData] = useState<QuestionAnswer[]>([]);
  const [searchText, setSearchText] = useState("");
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

  const filteredData = data.filter((item) => {
    if (!searchText.trim()) return true;
    const search = searchText.toLowerCase();
    return (
      item.product.toLowerCase().includes(search) ||
      item.customers_name.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.question.toLowerCase().includes(search) ||
      item.answer_from_admin.toLowerCase().includes(search)
    );
  });

  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Questions & Answers</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input 
            type="text" 
            className="border border-gray-500" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search questions and answers..."
          />
        </span>
      </div>
      <DataTable columns={question_answer_columns} data={filteredData} />
    </div>
  );
}
