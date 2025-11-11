import { IPKSlider } from './sliderForm.interface';
import { PKSliderModel } from './sliderForm.model';

// Create PK Slider
const createPKSliderInDB = async (payload: Partial<IPKSlider>) => {
  const result = await PKSliderModel.create(payload);
  return result;
};

// Get all active sliders (sorted by created time descending)
const getAllSlidersFromDB = async () => {
  const result = await PKSliderModel.find({}).sort({ orderCount: 1 });
  return result;
};

// Get slider by ID
const getSliderByIdFromDB = async (id: string) => {
  const result = await PKSliderModel.findById(id);
  if (!result) {
    throw new Error('Slider not found.');
  }
  return result;
};

// Update slider
const updateSliderInDB = async (id: string, payload: Partial<IPKSlider>) => {
  const result = await PKSliderModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Slider not found to update.');
  }
  return result;
};

// Delete slider
const deleteSliderFromDB = async (id: string) => {
  const result = await PKSliderModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Slider not found to delete.');
  }
  return null;
};

// rearrange sliders
export const reorderSlidersService = async (orderedIds: string[]) => {
  if (!orderedIds || orderedIds.length === 0) {
    throw new Error('orderedIds array is empty');
  }

  // Loop and update orderCount = index
  const updatePromises = orderedIds.map((id, index) =>
    PKSliderModel.findByIdAndUpdate(id, { orderCount: index }, { new: true })
  );

  await Promise.all(updatePromises);

  return { message: 'Sliders reordered successfully!' };
};

export const SliderServices = {
  createPKSliderInDB,
  getAllSlidersFromDB,
  getSliderByIdFromDB,
  updateSliderInDB,
  deleteSliderFromDB,

  reorderSlidersService
};
