import { Schema, model, models } from "mongoose";
import { IStory } from "./story.interface";

const storySchema = new Schema<IStory>(
  {
    title: { type: String, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 200 },
    imageUrl: { type: String, required: true, trim: true },
    duration: { type: Number, default: 10 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    expiryDate: { type: Date, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "VendorProductModel" }
  },
  { timestamps: true }
);

export const StoryModel =
  models.StoryModel || model<IStory>("StoryModel", storySchema);
