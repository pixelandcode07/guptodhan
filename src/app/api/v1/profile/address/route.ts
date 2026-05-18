import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
// ✅ CRITICAL FIX: সার্ভিস ইমপোর্ট করা হলো যাতে Redis Cache ক্লিয়ার হয়
import { UserServices } from "@/lib/modules/user/user.service"; 

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized. User ID missing." }, { status: 401 });
    }

    const body = await req.json();
    const { address, phone, name } = body;

    const updateData: any = {};
    if (address) updateData.address = address;
    if (phone) updateData.phoneNumber = phone;
    if (name) updateData.name = name;

    // 🔥 CRITICAL FIX: ডাটাবেসে সেভ করার জন্য UserServices ব্যবহার করা হলো
    // এটি সেভ করার সাথে সাথে Redis Cache থেকেও পুরনো ডাটা ডিলিট করে দিবে!
    const updatedUser = await UserServices.updateMyProfileInDB(userId, updateData);

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Saved successfully!", data: updatedUser });

  } catch (error: any) {
    console.error("Address Update Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}