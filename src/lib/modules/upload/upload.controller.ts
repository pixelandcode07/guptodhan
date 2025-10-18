import { NextRequest, NextResponse } from "next/server";
import uploadService from "./upload.service";
import { StatusCodes } from "http-status-codes";

export const UploadController = {
  async uploadFile(req: NextRequest) {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, message: "No file found in the request." },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      // The service now returns only the URL string
      const imageUrl = await uploadService.uploadFile(file);

      // ✅ **সঠিক ফরম্যাট:** The frontend expects the 'url' property at the top level.
      return NextResponse.json({
        success: true,
        message: "File uploaded successfully!",
        url: imageUrl,
      });

    } catch (error: any) {
      console.error("[UPLOAD_CONTROLLER_ERROR]", error);
      return NextResponse.json(
        { success: false, message: error.message || "File upload failed." },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
  },
};