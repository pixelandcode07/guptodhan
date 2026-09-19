import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";
import { TUserDoc, UserModel } from "./user.interface";

const userSchema = new Schema<TUserDoc, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, sparse: true, unique: true },
    password: { type: String, select: false },

    hasPassword: { type: Boolean, default: false },

    phoneNumber: { type: String, unique: true, sparse: true },
    profilePicture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ["user", "vendor", "service-provider", "admin"],
      default: "user",
    },
    rewardPoints: { type: Number, default: 0 },
    passwordChangedAt: { type: Date },

    serviceProviderInfo: {
      serviceCategory: { type: Schema.Types.ObjectId, ref: "ServiceCategory" },
      subCategories: [
        { type: Schema.Types.ObjectId, ref: "ServiceSubCategory" },
      ],
      cvUrl: String,
      bio: String,
    },

    vendorInfo: { type: Schema.Types.ObjectId, ref: "Vendor" },
  },
  { timestamps: true },
);

// ===================================
// 🔥 CRITICAL INDEXES
// ===================================
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ email: 1, isActive: 1, isDeleted: 1 });
userSchema.index({ phoneNumber: 1, isActive: 1, isDeleted: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ "serviceProviderInfo.serviceCategory": 1 });
userSchema.index({ createdAt: -1 });

// ===========================
// 🔐 PASSWORD HASH MIDDLEWARE
// ===========================
userSchema.pre("save", async function (next) {
  const user = this as TUserDoc;
  if (!user.isModified("password")) return next();

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      user.password as string,
      saltRounds,
    );
    user.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// ===========================
// 🔎 STATIC METHODS
// ===========================
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return this.findOne({ email, isDeleted: false }).select("+password");
};

userSchema.statics.isUserExistsByPhone = async function (phone: string) {
  let coreNumber = phone.trim();

  // ✅ যেকোনো format-কে আগে 11-digit format (01XXXXXXXXX) এ কনভার্ট করা হচ্ছে
  if (coreNumber.startsWith("+880")) {
    coreNumber = coreNumber.slice(3); // +880 বাদ দিয়ে 01...
  } else if (coreNumber.startsWith("880")) {
    coreNumber = coreNumber.slice(2); // 880 বাদ দিয়ে 01...
  } else if (coreNumber.startsWith("+88")) {
    coreNumber = "0" + coreNumber.slice(3); // যদি কেউ +881... লেখে তবে 01... বানাবে
  }

  // ✅ এবার ৩টি ভ্যালিড ফরম্যাট তৈরি করা হচ্ছে (জিরো না কেটেই)
  const format1 = coreNumber; // 01XXXXXXXXX
  const format2 = "+88" + coreNumber; // +8801XXXXXXXXX
  const format3 = "88" + coreNumber; // 8801XXXXXXXXX

  // $in দিয়ে খোঁজার জন্য array বানাচ্ছি (যাতে ডুপ্লিকেট না থাকে)
  const formats = Array.from(
    new Set([phone.trim(), format1, format2, format3]),
  );

  return this.findOne({
    phoneNumber: { $in: formats },
    isDeleted: false,
  }).select("+password");
};

// ===========================
// 🔑 INSTANCE METHODS
// ===========================
userSchema.methods.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const User: UserModel = (models.User ||
  model<TUserDoc, UserModel>("User", userSchema)) as UserModel;
