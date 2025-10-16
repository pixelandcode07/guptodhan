import { NextRequest, NextResponse } from "next/server";
import uploadService from "./upload.service";

export const UploadController = {
  async uploadFile(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    const uploaded = await uploadService.uploadFile(file);

    return NextResponse.json({
      success: true,
      data: uploaded,
    });
  },
};
