import { Schema, model, models } from 'mongoose';
import { IWishlist } from './wishlist.interface';

const wishlistSchema = new Schema<IWishlist>(
  {
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productID: { type: Schema.Types.ObjectId, ref: 'VendorProductModel', required: true },
    color: { type: String },
    size: { type: String },
  },
  { timestamps: true }
);

export const WishlistModel =
  models.WishlistModel || model<IWishlist>('WishlistModel', wishlistSchema);
