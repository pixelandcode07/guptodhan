import { IPKSlider } from './sliderForm.interface';
import { PKSliderModel } from './sliderForm.model';

// Create PK Slider with auto orderCount
const createPKSliderInDB = async (
  payload: Partial<IPKSlider>
) => {
  // Find highest orderCount
  const maxOrderSlider = await PKSliderModel
    .findOne()
    .sort({ orderCount: -1 })
    .select('orderCount -_id')
    .lean<{ orderCount: number }>();

  console.log('max order slider is:', maxOrderSlider);

  // Set next orderCount
  const nextOrder =
    maxOrderSlider && typeof maxOrderSlider.orderCount === 'number'
      ? maxOrderSlider.orderCount + 1
      : 0;

  console.log('next order is:', nextOrder);

  // Create slider with orderCount
  const result = await PKSliderModel.create({
    ...payload,
    orderCount: nextOrder,
  });

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
