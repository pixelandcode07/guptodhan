import { User } from "../user/user.model";
import { firebaseAdmin } from "@/lib/firebaseAdmin";

const verifyPhoneNumberWithFirebase = async (idToken: string) => {
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

    const phoneNumber = decodedToken.phone_number;
    if (!phoneNumber) throw new Error("No phone number found in token");

    const localPhoneNumber = phoneNumber.startsWith("+88") ? phoneNumber.slice(3) : phoneNumber;

    const user = await User.findOne({ phoneNumber: localPhoneNumber });
    if (!user) throw new Error("User not found in DB");

    await User.findByIdAndUpdate(user._id, { isVerified: true });

    return { uid: decodedToken.uid, phoneNumber };
  } catch (error: any) {
    console.error("Firebase verifyIdToken error:", error);
    throw new Error("Unauthorized: Invalid or expired token");
  }
};

export const OtpServices = {
  verifyPhoneNumberWithFirebase,
};
