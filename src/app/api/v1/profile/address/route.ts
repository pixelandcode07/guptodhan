import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { UserModel } from "@/lib/models-index";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    // ১. হেডার থেকে ইউজার আইডি নেওয়া
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized. User ID missing." }, { status: 401 });
    }

    // ২. বডি থেকে অ্যাড্রেস নেওয়া
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ success: false, message: "Address is required" }, { status: 400 });
    }

    // ৩. ডাটাবেসে অ্যাড্রেস আপডেট করা
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { address: address },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Address saved successfully!",
      data: updatedUser
    });

  } catch (error: any) {
    console.error("Address Update Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Internal Server Error"
    }, { status: 500 });
  }
}