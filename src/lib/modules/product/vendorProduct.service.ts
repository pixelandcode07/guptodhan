import { IVendorProduct } from "./vendorProduct.interface";
import { VendorProductModel } from "./vendorProduct.model";

const createVendorProductInDB = async (payload: Partial<IVendorProduct>) => {
  const result = await VendorProductModel.create(payload);
  return result;
};

const getAllVendorProductsFromDB = async () => {
  const result = await VendorProductModel.find()
    .populate('brand', 'name')
    .populate('flag', 'name')
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name')
    .populate('category', 'name')
    .populate('weightUnit', 'name')
    .populate('vendorStoreId', 'storeName')
    .sort({ createdAt: -1 });
  return result;
};

const getActiveVendorProductsFromDB = async () => {
  const result = await VendorProductModel.find({ status: 'active' })
    .populate('brand', 'name')
    .populate('flag', 'name')
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name')
    .populate('category', 'name')
    .populate('weightUnit', 'name')
    .populate('vendorStoreId', 'storeName')
    .sort({ createdAt: -1 });
  return result;
};

const getVendorProductByIdFromDB = async (id: string) => {
  const result = await VendorProductModel.findById(id)
    .populate('brand', 'name') // 'brandName' -> 'name'
    .populate('flag', 'name') // 'flagName' -> 'name'
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name') // 'modelName' -> 'name'
    .populate('category', 'name') // 'categoryName' -> 'name'
    .populate('subCategory', 'name') // 'subCategoryName' -> 'name'
    .populate('childCategory', 'name') // 'childCategoryName' -> 'name'
    .populate('weightUnit', 'name') // 'unitName' -> 'name'
    .populate('vendorStoreId', 'storeName');
  return result;
};

const getVendorProductsByCategoryFromDB = async (categoryId: string) => {
  const result = await VendorProductModel.find({
    category: categoryId,
    status: 'active'
  })
    .populate('brand', 'name') // 'brandName' -> 'name'
    .populate('flag', 'name') // 'flagName' -> 'name'
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name') // 'modelName' -> 'name'
    .populate('category', 'name') // 'categoryName' -> 'name'
    .populate('weightUnit', 'name') // 'unitName' -> 'name'
    .populate('vendorStoreId', 'storeName')
    .sort({ createdAt: -1 });
  return result;
};

const getVendorProductsBySubCategoryFromDB = async (subCategoryId: string) => {
  const result = await VendorProductModel.find({
    subCategory: subCategoryId,
    status: 'active'
  })
    .populate('brand', 'name') // 'brandName' -> 'name'
    .populate('flag', 'name') // 'flagName' -> 'name'
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name') // 'modelName' -> 'name'
    .populate('category', 'name') // 'categoryName' -> 'name'
    .populate('subCategory', 'name') // 'subCategoryName' -> 'name'
    .populate('weightUnit', 'name') // 'unitName' -> 'name'
    .populate('vendorStoreId', 'storeName')
    .sort({ createdAt: -1 });
  return result;
};

const getVendorProductsByChildCategoryFromDB = async (childCategoryId: string) => {
  const result = await VendorProductModel.find({
    childCategory: childCategoryId,
    status: 'active'
  })
    .populate('brand', 'name') // 'brandName' -> 'name'
    .populate('flag', 'name') // 'flagName' -> 'name'
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name') // 'modelName' -> 'name'
    .populate('category', 'name') // 'categoryName' -> 'name'
    .populate('subCategory', 'name') // 'subCategoryName' -> 'name'
    .populate('childCategory', 'name') // 'childCategoryName' -> 'name'
    .populate('weightUnit', 'name') // 'unitName' -> 'name'
    .populate('vendorStoreId', 'storeName')
    .sort({ createdAt: -1 });
  return result;
};

const getVendorProductsByBrandFromDB = async (brandId: string) => {
  const result = await VendorProductModel.find({
    brand: brandId,
    status: 'active'
  })
    .populate('brand', 'name') // 'brandName' -> 'name'
    .populate('flag', 'name') // 'flagName' -> 'name'
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name') // 'modelName' -> 'name'
    .populate('category', 'name') // 'categoryName' -> 'name'
    .populate('weightUnit', 'name') // 'unitName' -> 'name'
    .populate('vendorStoreId', 'storeName')
    .sort({ createdAt: -1 });
  return result;
};

const updateVendorProductInDB = async (id: string, payload: Partial<IVendorProduct>) => {
  const result = await VendorProductModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  )
    .populate('brand', 'name') // 'brandName' -> 'name'
    .populate('flag', 'name') // 'flagName' -> 'name'
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name') // 'modelName' -> 'name'
    .populate('category', 'name') // 'categoryName' -> 'name'
    .populate('weightUnit', 'name') // 'unitName' -> 'name'
    .populate('vendorStoreId', 'storeName');
  return result;
};

const deleteVendorProductFromDB = async (id: string) => {
  const result = await VendorProductModel.findByIdAndDelete(id);
  return result;
};

const addProductOptionInDB = async (id: string, option: any) => {
  const result = await VendorProductModel.findByIdAndUpdate(
    id,
    { $push: { productOptions: option } },
    { new: true, runValidators: true }
  )
    .populate('brand', 'name') // 'brandName' -> 'name'
    .populate('flag', 'name') // 'flagName' -> 'name'
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name') // 'modelName' -> 'name'
    .populate('category', 'name') // 'categoryName' -> 'name'
    .populate('weightUnit', 'name') 
    .populate('vendorStoreId', 'storeName');
  return result;
};


const removeProductOptionFromDB = async (id: string, optionIndex: number) => {
  const product = await VendorProductModel.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  product.productOptions?.splice(optionIndex, 1);
  await product.save();

  const result = await VendorProductModel.findById(id)
    .populate('brand', 'name') 
    .populate('flag', 'name') 
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name')  
    .populate('category', 'name') 
    .populate('weightUnit', 'name')  
    .populate('vendorStoreId', 'storeName');
  return result;
};

//landing page all products
const getLandingPageProductsFromDB = async () => {
  const [runningOffers, bestSelling, randomProducts] = await Promise.all([
    VendorProductModel.find({
      status: "active",
      offerDeadline: { $gt: new Date() },
    })
      .populate('brand', 'name') 
      .populate('flag', 'name') 
      .populate('warranty', 'warrantyName')
      .populate('productModel', 'name')  
      .populate('category', 'name')  
      .populate('weightUnit', 'name') 
      .sort({ createdAt: -1 })
      .limit(6),

    VendorProductModel.find({ status: "active" })
      .populate('brand', 'name') 
      .populate('flag', 'name') 
      .populate('warranty', 'warrantyName')
      .populate('productModel', 'name') 
      .populate('category', 'name') 
      .populate('weightUnit', 'name')
      .sort({ sellCount: -1 })
      .limit(6),

    VendorProductModel.find({ status: 'active' })
      .populate('brand', 'name') 
      .populate('flag', 'name') 
      .populate('warranty', 'warrantyName')
      .populate('productModel', 'name') 
      .populate('category', 'name')
      .populate('weightUnit', 'name') 
  ]);

  return {
    runningOffers,
    bestSelling,
    randomProducts,
  };
};

// search vendor prudct
const searchVendorProductsFromDB = async (searchTerm: string) => {
  const result = await VendorProductModel.find({
    status: 'active',
    $or: [
      { productTitle: { $regex: searchTerm, $options: 'i' } },
      { shortDescription: { $regex: searchTerm, $options: 'i' } },
      { productTag: { $in: [new RegExp(searchTerm, 'i')] } },
    ],
  })
    .populate('brand', 'name') 
    .populate('flag', 'name') 
    .populate('warranty', 'warrantyName')
    .populate('productModel', 'name') 
    .populate('category', 'name') 
    .populate('weightUnit', 'name')
    .populate('vendorStoreId', 'storeName')
    .sort({ createdAt: -1 });
  return result;
};

export const VendorProductServices = {
  createVendorProductInDB,
  getAllVendorProductsFromDB,
  getActiveVendorProductsFromDB,
  getVendorProductByIdFromDB,
  getVendorProductsByCategoryFromDB,
  getVendorProductsBySubCategoryFromDB,
  getVendorProductsByChildCategoryFromDB,
  getVendorProductsByBrandFromDB,
  updateVendorProductInDB,
  deleteVendorProductFromDB,
  addProductOptionInDB,
  removeProductOptionFromDB,
  getLandingPageProductsFromDB,
  searchVendorProductsFromDB,
};
