import { Schema, model, models } from 'mongoose';
import { IStory } from './story.interface';

const storySchema = new Schema<IStory>(
  {
    imageUrl: { type: String, required: true, trim: true },
    duration: { type: Number, default: 10 }, // seconds for progress bar, optional
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    expiryDate: { type: Date, required: true }, // when the story should expire
  },
  { timestamps: true }
);

export const StoryModel =
  models.StoryModel || model<IStory>('StoryModel', storySchema);