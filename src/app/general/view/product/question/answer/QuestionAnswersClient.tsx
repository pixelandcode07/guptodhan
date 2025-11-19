"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/TableHelper/data-table";
import { QuestionAnswer, getQuestionAnswerColumns } from "@/components/TableHelper/question_answer_columns";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function QuestionAnswersClient() {
  const [data, setData] = useState<QuestionAnswer[]>([]);
  const [qaPendingEdit, setQaPendingEdit] = useState<QuestionAnswer | null>(null);
  const [editAnswer, setEditAnswer] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [qaPendingDelete, setQaPendingDelete] = useState<QuestionAnswer | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { data: session } = useSession();

  type Session = {
    user?: { role?: string; id?: string; name?: string | null; email?: string | null };
    accessToken?: string;
  };
  const sessionData = session as Session | null;
  const token = sessionData?.accessToken;
  const userRole = sessionData?.user?.role;

  const fetchProductQA = useCallback(async () => {
    try {
      const response = await axios.get("/api/v1/product-qna", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });

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

      const mapped: QuestionAnswer[] = items.map((qa, index) => ({
        id: index + 1,
        qaRecordId: qa._id || qa.qaId || "",
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

      setData(mapped);
    } catch (error) {
      console.error("Failed to fetch product Q&A", error);
      toast.error("Failed to load questions.");
    }
  }, [token, userRole]);

  useEffect(() => {
    fetchProductQA();
  }, [fetchProductQA]);

  const handleEditRequest = useCallback((qa: QuestionAnswer) => {
    if (!qa.qaRecordId) {
      toast.error("Invalid question record.");
      return;
    }
    setQaPendingEdit(qa);
    setEditAnswer(qa.answer_from_admin || "");
    setShowEditDialog(true);
  }, []);

  const saveAnswer = useCallback(async () => {
    if (!qaPendingEdit?.qaRecordId) return;
    if (!editAnswer.trim()) {
      toast.error("Answer cannot be empty.");
      return;
    }
    setEditLoading(true);
    try {
      await axios.patch(
        `/api/v1/product-qna/${qaPendingEdit.qaRecordId}`,
        {
          answer: {
            answerText: editAnswer.trim(),
            answeredByName: sessionData?.user?.name || "Admin",
            answeredByEmail: sessionData?.user?.email || "admin@guptodhon.com",
          },
          status: "active",
        },
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { "x-user-role": userRole } : {}),
          },
        }
      );
      toast.success("Answer saved.");
      setShowEditDialog(false);
      fetchProductQA();
    } catch (error: unknown) {
      console.error("Failed to update answer", error);
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || "Failed to save answer.");
    } finally {
      setEditLoading(false);
      setQaPendingEdit(null);
    }
  }, [editAnswer, fetchProductQA, qaPendingEdit, sessionData?.user?.email, sessionData?.user?.name, token, userRole]);

  const handleDeleteRequest = useCallback((qa: QuestionAnswer) => {
    if (!qa.qaRecordId) {
      toast.error("Invalid question record.");
      return;
    }
    setQaPendingDelete(qa);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!qaPendingDelete?.qaRecordId) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/v1/product-qna/${qaPendingDelete.qaRecordId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
        },
      });
      setShowDeleteDialog(false);
      setShowSuccessDialog(true);
      fetchProductQA();
    } catch (error: unknown) {
      console.error("Failed to delete question", error);
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || "Failed to delete question.");
    } finally {
      setDeleteLoading(false);
      setQaPendingDelete(null);
    }
  }, [fetchProductQA, qaPendingDelete, token, userRole]);

  const columns = useMemo(
    () =>
      getQuestionAnswerColumns({
        onDelete: handleDeleteRequest,
        onEdit: handleEditRequest,
      }),
    [handleDeleteRequest, handleEditRequest]
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-2 py-3 sm:px-3 sm:py-4 md:px-4 md:py-6 lg:px-8">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Questions & Answers</h1>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <DataTable columns={columns} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The question and any existing answer will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteLoading}
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDelete}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Question deleted</AlertDialogTitle>
            <AlertDialogDescription>
              The question was removed successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Answer</DialogTitle>
            <DialogDescription>
              Provide or update the answer for this question. This will be visible on the product page.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Question</p>
              <p className="text-sm text-gray-600">
                {qaPendingEdit?.question || "N/A"}
              </p>
            </div>
            <Textarea
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={editLoading}>
              Cancel
            </Button>
            <Button onClick={saveAnswer} disabled={editLoading || !editAnswer.trim()}>
              {editLoading ? "Saving..." : "Save Answer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

