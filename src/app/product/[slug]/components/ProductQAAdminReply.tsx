"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ProductQAAdminReplyProps {
  qaId: string;
  initialAnswer?: string;
  onSuccess?: (answerText: string) => void;
}

interface ProductQAAdminReplyProps {
  qaId: string;
  initialAnswer?: string;
  token?: string;
  adminName?: string | null;
  adminEmail?: string | null;
  onSuccess?: (answerText: string) => void;
  onCancel?: () => void;
}

export const ProductQAAdminReply = ({
  qaId,
  initialAnswer = "",
  token,
  adminName,
  adminEmail,
  onSuccess,
  onCancel,
}: ProductQAAdminReplyProps) => {
  const [answer, setAnswer] = useState(initialAnswer);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("Answer cannot be empty.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.patch(
        `/api/v1/product-qna/${qaId}`,
        {
          answer: {
            answerText: answer.trim(),
            answeredByName: adminName || "Admin",
            answeredByEmail: adminEmail || "admin@guptodhon.com",
          },
          status: "active",
        },
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "x-user-role": "admin",
          },
        }
      );
      toast.success("Answer saved!");
      onSuccess?.(answer.trim());
    } catch (error) {
      console.error("Failed to save answer", error);
      toast.error("Failed to save answer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer..."
        rows={3}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !answer.trim()}
        >
          {isLoading
            ? "Saving..."
            : initialAnswer
            ? "Update Reply"
            : "Post Reply"}
        </Button>
        {initialAnswer && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

