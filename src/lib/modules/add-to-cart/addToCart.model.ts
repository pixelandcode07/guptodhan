import { Schema, model, models } from "mongoose";
import { ICart } from "./addToCart.interface";

const cartSchema = new Schema<ICart>(
  {
    cartID: { type: String },
    userID: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    productID: {
      type: Schema.Types.ObjectId,
      ref: "ProductModel",
      required: true,
    },
    productName: { type: String, required: true },
    productImage: { type: String },
    storeName: { type: String, required: true },
    color: { type: String },
    size: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export const CartModel =
  models.CartModel || model<ICart>("CartModel", cartSchema);
