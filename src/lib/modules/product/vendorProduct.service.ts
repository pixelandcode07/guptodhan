import mongoose from "mongoose";
import { IVendorProduct } from "./vendorProduct.interface";
import { VendorProductModel } from "./vendorProduct.model";
import { ReviewModel } from "../product-review/productReview.model";
import { ProductQAModel } from "../product-qna/productQNA.model";
import { StoreModel } from "../vendor-store/vendorStore.model";
import { ProductColor } from "../product-config/models/productColor.model";
import { ProductSize } from "../product-config/models/productSize.model";
import { StorageType } from "../product-config/models/storageType.model";
import { DeviceConditionModel } from "../product-config/models/deviceCondition.model";
import { ProductSimTypeModel } from "../product-config/models/productSimType.model";
import { ProductWarrantyModel } from "../product-config/models/warranty.model";
import { Types } from 'mongoose';

// ✅ Import Redis cache helpers
import { getCachedData, deleteCacheKey, deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys, CacheTTL } from '@/lib/redis/cache-keys';

// ===================================
// 🔧 HELPER FUNCTIONS
// ===================================

const populateColorAndSizeNamesForProducts = async (products: any[]) => {
  if (!products?.length) return products;

  const colorIds = new Set<string>();
  const sizeIds = new Set<string>();
  const storageIds = new Set<string>();
  const simTypeIds = new Set<string>();
  const conditionIds = new Set<string>();
  const warrantyIds = new Set<string>();

  // ১. সব আইডি সংগ্রহ করা
  for (const p of products) {
    for (const opt of p.productOptions || []) {
      if (Array.isArray(opt.color)) {
        opt.color.forEach((id: any) => {
            if(id && mongoose.Types.ObjectId.isValid(id)) colorIds.add(String(id));
        });
      }
      if (Array.isArray(opt.size)) {
        opt.size.forEach((id: any) => {
            if(id && mongoose.Types.ObjectId.isValid(id)) sizeIds.add(String(id));
        });
      }
      // Storage ID
      if (opt.storage && mongoose.Types.ObjectId.isValid(opt.storage)) {
        storageIds.add(String(opt.storage));
      }
      // SimType IDs
      if (Array.isArray(opt.simType)) {
        opt.simType.forEach((id: any) => {
            if(id && mongoose.Types.ObjectId.isValid(id)) simTypeIds.add(String(id));
        });
      }
      // Condition IDs
      if (Array.isArray(opt.condition)) {
        opt.condition.forEach((id: any) => {
            if(id && mongoose.Types.ObjectId.isValid(id)) conditionIds.add(String(id));
        });
      }
      // Warranty ID
      if (opt.warranty && mongoose.Types.ObjectId.isValid(opt.warranty)) {
        warrantyIds.add(String(opt.warranty));
      }
    }
  }

  // ২. ডাটাবেস থেকে সব ডাটা আনা (Fetch all data from DB)
  const [colors, sizes, storages, simTypes, conditions, warranties] = await Promise.all([
    colorIds.size ? ProductColor.find({ _id: { $in: Array.from(colorIds) } }).lean() : [],
    sizeIds.size ? ProductSize.find({ _id: { $in: Array.from(sizeIds) } }).lean() : [],
    storageIds.size ? StorageType.find({ _id: { $in: Array.from(storageIds) } }).lean() : [],
    simTypeIds.size ? ProductSimTypeModel.find({ _id: { $in: Array.from(simTypeIds) } }).lean() : [],
    conditionIds.size ? DeviceConditionModel.find({ _id: { $in: Array.from(conditionIds) } }).lean() : [],
    warrantyIds.size ? ProductWarrantyModel.find({ _id: { $in: Array.from(warrantyIds) } }).lean() : [],
  ]);

  const colorMap = new Map(colors.map((c: any) => [String(c._id), c])); 
  const sizeMap = new Map(sizes.map((s: any) => [String(s._id), s]));
  const storageMap = new Map(storages.map((st: any) => [String(st._id), st]));
  const simTypeMap = new Map(simTypes.map((sim: any) => [String(sim._id), sim]));
  const conditionMap = new Map(conditions.map((cond: any) => [String(cond._id), cond]));
  const warrantyMap = new Map(warranties.map((war: any) => [String(war._id), war]));

  // ৩. ডাটা ম্যাপ করা
  return products.map((p: any) => ({
    ...p,
    productOptions: p.productOptions?.map((opt: any) => ({
      // ✅ CRITICAL FIX: ...opt ব্যবহার করা হয়েছে যাতে unit, simType, condition হারিয়ে না যায়
      ...opt, 
      
      // Color Populate
      color: Array.isArray(opt.color) 
        ? opt.color.map((id: any) => {
            const c = colorMap.get(String(id));
            return c ? { _id: String(c._id), colorName: c.colorName, colorCode: c.colorCode } : id;
          })
        : [],

      // Size Populate
      size: Array.isArray(opt.size) 
        ? opt.size.map((id: any) => {
            const s = sizeMap.get(String(id));
            return s ? { _id: String(s._id), name: s.name } : id;
          })
        : [],
      
      // ✅ Storage Populate
      storage: (() => {
        if (!opt.storage) return undefined;
        const st = storageMap.get(String(opt.storage));
        return st ? { _id: String(st._id), ram: st.ram, rom: st.rom } : opt.storage;
      })(),

      // ✅ SimType Populate
      simType: Array.isArray(opt.simType) 
        ? opt.simType.map((id: any) => {
            const sim = simTypeMap.get(String(id));
            return sim ? { _id: String(sim._id), name: sim.name } : id;
          })
        : [],

      // ✅ Condition Populate
      condition: Array.isArray(opt.condition) 
        ? opt.condition.map((id: any) => {
            const cond = conditionMap.get(String(id));
            return cond ? { _id: String(cond._id), deviceCondition: cond.deviceCondition } : id;
          })
        : [],

      // ✅ Warranty Populate
      warranty: (() => {
        if (!opt.warranty) return undefined;
        const war = warrantyMap.get(String(opt.warranty));
        return war ? { _id: String(war._id), warrantyName: war.warrantyName } : opt.warranty;
      })(),
      
      // ✅ Preserve unit array
      unit: opt.unit || []
    })) || [],
  }));
};

const populateColorAndSizeNames = async (product: any) => {
  if (!product) return null;
  const result = await populateColorAndSizeNamesForProducts([product]);
  return result[0];
};

// ===================================
// 🚀 REUSABLE AGGREGATION PIPELINE
// ===================================

const getProductLookupPipeline = () => [
  { $lookup: { from: 'brandmodels', localField: 'brand', foreignField: '_id', as: 'brand' } },
  { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
  { $lookup: { from: 'productflags', localField: 'flag', foreignField: '_id', as: 'flag' } },
  { $unwind: { path: '$flag', preserveNullAndEmptyArrays: true } },
  { $lookup: { from: 'productwarrantymodels', localField: 'warranty', foreignField: '_id', as: 'warranty' } },
  { $unwind: { path: '$warranty', preserveNullAndEmptyArrays: true } },
  { $lookup: { from: 'productmodels', localField: 'productModel', foreignField: '_id', as: 'productModel' } },
  { $unwind: { path: '$productModel', preserveNullAndEmptyArrays: true } },
  { $lookup: { from: 'categorymodels', localField: 'category', foreignField: '_id', as: 'category' } },
  { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
  { $lookup: { from: 'subcategorymodels', localField: 'subCategory', foreignField: '_id', as: 'subCategory' } },
  { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },
  { $lookup: { from: 'childcategorymodels', localField: 'childCategory', foreignField: '_id', as: 'childCategory' } },
  { $unwind: { path: '$childCategory', preserveNullAndEmptyArrays: true } },
  { $lookup: { from: 'productunits', localField: 'weightUnit', foreignField: '_id', as: 'weightUnit' } },
  { $unwind: { path: '$weightUnit', preserveNullAndEmptyArrays: true } },
  { $lookup: { from: 'storemodels', localField: 'vendorStoreId', foreignField: '_id', as: 'vendorStoreId' } },
  { $unwind: { path: '$vendorStoreId', preserveNullAndEmptyArrays: true } },

  {
    $project: {
      'brand._id': 1, 'brand.name': 1, 'brand.brandName': 1, 'brand.brandLogo': 1,
      'flag._id': 1, 'flag.name': 1,
      'warranty._id': 1, 'warranty.warrantyName': 1,
      'productModel._id': 1, 'productModel.name': 1, 'productModel.modelName': 1,
      'category._id': 1, 'category.name': 1, 'category.slug': 1,
      'subCategory._id': 1, 'subCategory.name': 1, 'subCategory.slug': 1,
      'childCategory._id': 1, 'childCategory.name': 1, 'childCategory.slug': 1,
      'weightUnit._id': 1, 'weightUnit.name': 1,
      'vendorStoreId._id': 1, 'vendorStoreId.storeName': 1, 'vendorStoreId.storeLogo': 1,

      productId: 1, productTitle: 1, vendorName: 1, shortDescription: 1, fullDescription: 1,
      specification: 1, warrantyPolicy: 1, productTag: 1, videoUrl: 1, photoGallery: 1,
      thumbnailImage: 1, productPrice: 1, discountPrice: 1, stock: 1, sku: 1, rewardPoints: 1,
      shippingCost: 1, offerDeadline: 1, metaTitle: 1, metaKeyword: 1, metaDescription: 1,
      status: 1, sellCount: 1, 
      productOptions: 1, // ✅ Raw Data projected
      createdAt: 1, updatedAt: 1,
    },
  },
];

// ===================================
// 📝 CREATE PRODUCT (NO POPULATE)
// ===================================

const createVendorProductInDB = async (payload: Partial<IVendorProduct>) => {
  const result = await VendorProductModel.create(payload);

  // ✅ Use aggregation instead of populate
  const populatedResult = await VendorProductModel.aggregate([
    { $match: { _id: result._id } },
    ...getProductLookupPipeline(),
  ]);

  // 🗑️ Clear all product caches
  await deleteCachePattern(CacheKeys.PATTERNS.PRODUCTS_ALL);

  if (!populatedResult || !populatedResult[0]) return null;
  
  return await populateColorAndSizeNames(populatedResult[0]);
};

// ===================================
// 📋 GET ALL PRODUCTS (WITH PAGINATION)
// ===================================

const getAllVendorProductsFromDB = async (page = 1, limit = 20) => {
  const cacheKey = CacheKeys.PRODUCT.ALL(page);
  
  return getCachedData(
    cacheKey,
    async () => {
      const skip = (page - 1) * limit;
      
      const products = await VendorProductModel.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        ...getProductLookupPipeline(),
      ]);
      
      const total = await VendorProductModel.countDocuments();
      const populatedProducts = await populateColorAndSizeNamesForProducts(products);
      
      return {
        products: populatedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    },
    CacheTTL.PRODUCT_LIST
  );
};


const getAllVendorProductsNoPaginationFromDB = async () => {
  // Unique Cache Key (Jate pagination er sathe mix na hoy)
  const cacheKey = "product:all:no-pagination"; 

  return getCachedData(
    cacheKey,
    async () => {
      const products = await VendorProductModel.aggregate([
        { $sort: { createdAt: -1 } },
        // Ekhane kono $skip ba $limit nai
        ...getProductLookupPipeline(),
      ]);

      const populatedProducts = await populateColorAndSizeNamesForProducts(products);
      
      // Direct array return korchi, kono meta data chara
      return populatedProducts;
    },
    CacheTTL.PRODUCT_LIST
  );
};

// ===================================
// ✅ GET ACTIVE PRODUCTS (WITH PAGINATION)
// ===================================

const getActiveVendorProductsFromDB = async (page = 1, limit = 20) => {
  const cacheKey = CacheKeys.PRODUCT.ACTIVE(page);
  
  return getCachedData(
    cacheKey,
    async () => {
      const skip = (page - 1) * limit;
      
      const products = await VendorProductModel.aggregate([
        { $match: { status: "active" } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        ...getProductLookupPipeline(),
      ]);
      
      const total = await VendorProductModel.countDocuments({ status: "active" });
      const populatedProducts = await populateColorAndSizeNamesForProducts(products);
      
      return {
        products: populatedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    },
    CacheTTL.PRODUCT_LIST
  );
};

// ===================================
// 🔍 GET PRODUCT BY ID (NO POPULATE - FULL AGGREGATION)
// ===================================

const getVendorProductByIdFromDB = async (id: string) => {
  const cacheKey = CacheKeys.PRODUCT.BY_ID(id);
  
  return getCachedData(
    cacheKey,
    async () => {
      const productResult = await VendorProductModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        ...getProductLookupPipeline(),
      ]);

      if (!productResult || !productResult[0]) return null;
      
      // ✅ Helper will now preserve 'unit', 'simType', 'condition'
      const transformedProduct = await populateColorAndSizeNames(productResult[0]);

      const [reviews, qna, ratingStats] = await Promise.all([
        ReviewModel.find({ productId: id }).lean(),
        ProductQAModel.find({ productId: id }).lean(),
        ReviewModel.aggregate([
          { $match: { productId: new mongoose.Types.ObjectId(id) } },
          { $group: { _id: "$productId", totalReviews: { $sum: 1 }, averageRating: { $avg: "$rating" } } },
        ]),
      ]);

      return {
        ...transformedProduct,
        ratingStats: ratingStats[0] || { totalReviews: 0, averageRating: 0 },
        reviews,
        qna,
      };
    },
    CacheTTL.PRODUCT_DETAIL
  );
};

// ===================================
// 📂 GET PRODUCTS BY CATEGORY
// ===================================

const getVendorProductsByCategoryFromDB = async (
  categoryId: string,
  filters: {
    priceMin?: number;
    priceMax?: number;
    subCategory?: string;
    childCategory?: string;
    brand?: string;
    search?: string;
    sort?: string;
  } = {},
  page = 1,
  limit = 20
) => {
  const cacheKey = `${CacheKeys.PRODUCT.BY_CATEGORY(categoryId, page)}:${JSON.stringify(filters)}`;
  
  return getCachedData(
    cacheKey,
    async () => {
      const query: any = {
        status: "active",
      };

      if (categoryId) {
        query.category = new mongoose.Types.ObjectId(categoryId);
      }

      if (filters.subCategory) {
        query.subCategory = new mongoose.Types.ObjectId(filters.subCategory);
      }

      if (filters.childCategory) {
        query.childCategory = new mongoose.Types.ObjectId(filters.childCategory);
      }

      if (filters.brand) {
        query.brand = new mongoose.Types.ObjectId(filters.brand);
      }

      if (filters.search) {
        query.$or = [
          { productTitle: { $regex: filters.search, $options: "i" } },
          { shortDescription: { $regex: filters.search, $options: "i" } },
          { productTag: { $regex: filters.search, $options: "i" } },
        ];
      }

      if (filters.priceMin || filters.priceMax) {
        query["productOptions.price"] = {};
        if (filters.priceMin) {
          query["productOptions.price"].$gte = Number(filters.priceMin);
        }
        if (filters.priceMax) {
          query["productOptions.price"].$lte = Number(filters.priceMax);
        }
      }

      let sortQuery: any = { createdAt: -1 };
      if (filters.sort === "priceLowHigh") {
        sortQuery = { "productOptions.price": 1 };
      } else if (filters.sort === "priceHighLow") {
        sortQuery = { "productOptions.price": -1 };
      } else if (filters.sort === "new") {
        sortQuery = { createdAt: -1 };
      } else if (filters.sort === "old") {
        sortQuery = { createdAt: 1 };
      }

      const skip = (page - 1) * limit;

      const products = await VendorProductModel.aggregate([
        { $match: query },
        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limit },
        ...getProductLookupPipeline(),
      ]);

      const total = await VendorProductModel.countDocuments(query);
      const populatedProducts = await populateColorAndSizeNamesForProducts(products);

      return {
        products: populatedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    },
    CacheTTL.PRODUCT_LIST
  );
};

// ===================================
// 📂 GET PRODUCTS BY SUBCATEGORY
// ===================================

const getVendorProductsBySubCategoryFromDB = async (
  subCategoryId: string,
  filters: {
    priceMin?: number;
    priceMax?: number;
    brand?: string;
    childCategory?: string;
    search?: string;
    sort?: string;
  } = {},
  page = 1,
  limit = 20
) => {
  const cacheKey = `${CacheKeys.PRODUCT.BY_SUBCATEGORY(subCategoryId, page)}:${JSON.stringify(filters)}`;
  
  return getCachedData(
    cacheKey,
    async () => {
      const query: any = {
        status: "active",
        subCategory: new mongoose.Types.ObjectId(subCategoryId),
      };

      if (filters.brand) {
        query.brand = new mongoose.Types.ObjectId(filters.brand);
      }

      if (filters.childCategory) {
        query.childCategory = new mongoose.Types.ObjectId(filters.childCategory);
      }

      if (filters.search) {
        query.productTitle = {
          $regex: filters.search,
          $options: "i",
        };
      }

      if (filters.priceMin || filters.priceMax) {
        query["productOptions.price"] = {};
        if (filters.priceMin) {
          query["productOptions.price"].$gte = Number(filters.priceMin);
        }
        if (filters.priceMax) {
          query["productOptions.price"].$lte = Number(filters.priceMax);
        }
      }

      let sortQuery: any = { createdAt: -1 };
      if (filters.sort === "priceLowHigh") {
        sortQuery = { "productOptions.price": 1 };
      } else if (filters.sort === "priceHighLow") {
        sortQuery = { "productOptions.price": -1 };
      } else if (filters.sort === "new") {
        sortQuery = { createdAt: -1 };
      } else if (filters.sort === "old") {
        sortQuery = { createdAt: 1 };
      }

      const skip = (page - 1) * limit;

      const products = await VendorProductModel.aggregate([
        { $match: query },
        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limit },
        ...getProductLookupPipeline(),
      ]);

      const total = await VendorProductModel.countDocuments(query);
      const populatedProducts = await populateColorAndSizeNamesForProducts(products);

      return {
        products: populatedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    },
    CacheTTL.PRODUCT_LIST
  );
};

// ===================================
// 📂 GET PRODUCTS BY CHILD CATEGORY
// ===================================

const getVendorProductsByChildCategoryFromDB = async (
  childCategoryId: string,
  filters: {
    priceMin?: number;
    priceMax?: number;
    brand?: string;
    subCategory?: string;
    search?: string;
    sort?: string;
  } = {}
) => {
  const query: any = {
    status: "active",
    childCategory: new mongoose.Types.ObjectId(childCategoryId),
  };

  if (filters.subCategory) {
    query.subCategory = new mongoose.Types.ObjectId(filters.subCategory);
  }

  if (filters.brand) {
    query.brand = new mongoose.Types.ObjectId(filters.brand);
  }

  if (filters.search) {
    query.productTitle = {
      $regex: filters.search,
      $options: "i",
    };
  }

  if (filters.priceMin || filters.priceMax) {
    query["productOptions.price"] = {};
    if (filters.priceMin) {
      query["productOptions.price"].$gte = Number(filters.priceMin);
    }
    if (filters.priceMax) {
      query["productOptions.price"].$lte = Number(filters.priceMax);
    }
  }

  let sortQuery: any = { createdAt: -1 };
  if (filters.sort === "priceLowHigh") {
    sortQuery = { "productOptions.price": 1 };
  } else if (filters.sort === "priceHighLow") {
    sortQuery = { "productOptions.price": -1 };
  } else if (filters.sort === "new") {
    sortQuery = { createdAt: -1 };
  } else if (filters.sort === "old") {
    sortQuery = { createdAt: 1 };
  }

  const products = await VendorProductModel.aggregate([
    { $match: query },
    { $sort: sortQuery },
    ...getProductLookupPipeline(),
  ]);

  return await populateColorAndSizeNamesForProducts(products);
};

// ===================================
// 🏷️ GET PRODUCTS BY BRAND
// ===================================

const getVendorProductsByBrandFromDB = async (
  brandId: string,
  page = 1,
  limit = 20
) => {
  const cacheKey = CacheKeys.PRODUCT.BY_BRAND(brandId, page);
  
  return getCachedData(
    cacheKey,
    async () => {
      const skip = (page - 1) * limit;
      
      const products = await VendorProductModel.aggregate([
        {
          $match: {
            brand: new mongoose.Types.ObjectId(brandId),
            status: "active",
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        ...getProductLookupPipeline(),
      ]);

      const total = await VendorProductModel.countDocuments({
        brand: brandId,
        status: "active",
      });

      const populatedProducts = await populateColorAndSizeNamesForProducts(products);

      return {
        products: populatedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    },
    CacheTTL.PRODUCT_LIST
  );
};

// ===================================
// ✏️ UPDATE PRODUCT (NO POPULATE)
// ===================================

const updateVendorProductInDB = async (
  id: string,
  payload: Partial<IVendorProduct>
) => {
  // Update the product
  await VendorProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  // ✅ Use aggregation to get updated product
  const result = await VendorProductModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ...getProductLookupPipeline(),
  ]);

  // 🗑️ Clear cache
  await deleteCacheKey(CacheKeys.PRODUCT.BY_ID(id));
  await deleteCachePattern(CacheKeys.PATTERNS.PRODUCTS_ALL);

  if (!result || !result[0]) return null;

  return await populateColorAndSizeNames(result[0]);
};

// ===================================
// 🗑️ DELETE PRODUCT
// ===================================

const deleteVendorProductFromDB = async (id: string) => {
  const result = await VendorProductModel.findByIdAndDelete(id);
  
  // 🗑️ Clear cache
  await deleteCacheKey(CacheKeys.PRODUCT.BY_ID(id));
  await deleteCachePattern(CacheKeys.PATTERNS.PRODUCTS_ALL);
  
  return result;
};

// ===================================
// ➕ ADD PRODUCT OPTION (NO POPULATE)
// ===================================

const addProductOptionInDB = async (id: string, option: any) => {
  // Add the option
  await VendorProductModel.findByIdAndUpdate(
    id,
    { $push: { productOptions: option } },
    { new: true, runValidators: true }
  );
  
  // ✅ Use aggregation to get updated product
  const result = await VendorProductModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ...getProductLookupPipeline(),
  ]);
  
  // 🗑️ Clear cache
  await deleteCacheKey(CacheKeys.PRODUCT.BY_ID(id));
  await deleteCachePattern(CacheKeys.PATTERNS.PRODUCTS_ALL);
  
  if (!result || !result[0]) return null;
  
  return await populateColorAndSizeNames(result[0]);
};

// ===================================
// ➖ REMOVE PRODUCT OPTION (NO POPULATE)
// ===================================

const removeProductOptionFromDB = async (id: string, optionIndex: number) => {
  const product = await VendorProductModel.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }

  product.productOptions?.splice(optionIndex, 1);
  await product.save();

  // ✅ Use aggregation to get updated product
  const result = await VendorProductModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ...getProductLookupPipeline(),
  ]);
  
  // 🗑️ Clear cache
  await deleteCacheKey(CacheKeys.PRODUCT.BY_ID(id));
  await deleteCachePattern(CacheKeys.PATTERNS.PRODUCTS_ALL);
  
  if (!result || !result[0]) return null;
  
  return await populateColorAndSizeNames(result[0]);
};

// ===================================
// 🏠 GET LANDING PAGE PRODUCTS
// ===================================

const getLandingPageProductsFromDB = async () => {
  const cacheKey = CacheKeys.PRODUCT.LANDING_PAGE;
  
  return getCachedData(
    cacheKey,
    async () => {
      const [runningOffers, bestSelling, randomProducts] = await Promise.all([
        VendorProductModel.aggregate([
          {
            $match: {
              status: "active",
              offerDeadline: { $gt: new Date() },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 6 },
          ...getProductLookupPipeline(),
        ]),

        VendorProductModel.aggregate([
          { $match: { status: "active" } },
          { $sort: { sellCount: -1 } },
          { $limit: 6 },
          ...getProductLookupPipeline(),
        ]),

        VendorProductModel.aggregate([
          { $match: { status: "active" } },
          { $sample: { size: 6 } },
          ...getProductLookupPipeline(),
        ]),
      ]);

      const [
        populatedRunningOffers,
        populatedBestSelling,
        populatedRandomProducts,
      ] = await Promise.all([
        populateColorAndSizeNamesForProducts(runningOffers),
        populateColorAndSizeNamesForProducts(bestSelling),
        populateColorAndSizeNamesForProducts(randomProducts),
      ]);

      return {
        runningOffers: populatedRunningOffers,
        bestSelling: populatedBestSelling,
        randomProducts: populatedRandomProducts,
      };
    },
    CacheTTL.PRODUCT_LANDING
  );
};

// ===================================
// 🔍 GET LIVE SUGGESTIONS (NO POPULATE - AGGREGATION)
// ===================================

const getLiveSuggestionsFromDB = async (searchTerm: string) => {
  const regex = new RegExp(searchTerm.split(" ").join("|"), "i");

  // ✅ Use aggregation instead of populate
  const suggestions = await VendorProductModel.aggregate([
    {
      $match: {
        status: "active",
        productTitle: { $regex: regex },
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 5 },
    
    // Lookup category
    {
      $lookup: {
        from: 'categorymodels',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
    
    // Lookup subcategory
    {
      $lookup: {
        from: 'subcategorymodels',
        localField: 'subCategory',
        foreignField: '_id',
        as: 'subCategory',
      },
    },
    { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },
    
    // Lookup childcategory
    {
      $lookup: {
        from: 'childcategorymodels',
        localField: 'childCategory',
        foreignField: '_id',
        as: 'childCategory',
      },
    },
    { $unwind: { path: '$childCategory', preserveNullAndEmptyArrays: true } },
    
    // Project only needed fields
    {
      $project: {
        productTitle: 1,
        thumbnailImage: 1,
        productPrice: 1,
        'category.slug': 1,
        'subCategory.slug': 1,
        'childCategory.slug': 1,
      },
    },
  ]);

  return suggestions;
};

// ===================================
// 🔎 GET SEARCH RESULTS
// ===================================

const getSearchResultsFromDB = async (searchTerm: string) => {
  const cacheKey = CacheKeys.PRODUCT.SEARCH(searchTerm);
  
  return getCachedData(
    cacheKey,
    async () => {
      const words = searchTerm
        .split(" ")
        .map((w) => w.trim())
        .filter(Boolean);
      const regexArr = words.map((w) => new RegExp(w, "i"));

      const results = await VendorProductModel.aggregate([
        {
          $match: {
            status: "active",
            $or: [
              { productTitle: { $in: regexArr } },
              { shortDescription: { $in: regexArr } },
              { productTag: { $in: regexArr } },
            ],
          },
        },
        { $sort: { createdAt: -1 } },
        ...getProductLookupPipeline(),
      ]);

      return await populateColorAndSizeNamesForProducts(results);
    },
    CacheTTL.PRODUCT_SEARCH
  );
};

// ===================================
// 🎁 GET OFFER PRODUCTS
// ===================================

const getOfferProductsFromDB = async () => {
  const cacheKey = CacheKeys.PRODUCT.OFFERS;
  
  return getCachedData(
    cacheKey,
    async () => {
      const products = await VendorProductModel.aggregate([
        {
          $match: {
            status: "active",
            offerDeadline: { $gt: new Date() },
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 6 },
        ...getProductLookupPipeline(),
      ]);

      const productIds = products.map((p) => p._id);
      const reviewStats = await ReviewModel.aggregate([
        { $match: { productId: { $in: productIds } } },
        {
          $group: {
            _id: "$productId",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      const reviewMap = new Map(
        reviewStats.map((r) => [String(r._id), r])
      );

      const productsWithReviews = products.map((product) => {
        const stats = reviewMap.get(String(product._id));
        return {
          ...product,
          totalReviews: stats?.totalReviews || 0,
          averageRating: stats?.averageRating || 0,
        };
      });

      return await populateColorAndSizeNamesForProducts(productsWithReviews);
    },
    CacheTTL.PRODUCT_OFFERS
  );
};

// ===================================
// 🏆 GET BEST SELLING PRODUCTS
// ===================================

const getBestSellingProductsFromDB = async () => {
  const cacheKey = CacheKeys.PRODUCT.BEST_SELLING;
  
  return getCachedData(
    cacheKey,
    async () => {
      const products = await VendorProductModel.aggregate([
        { $match: { status: "active" } },
        { $sort: { sellCount: -1 } },
        { $limit: 6 },
        ...getProductLookupPipeline(),
      ]);

      const productIds = products.map((p) => p._id);
      const reviewStats = await ReviewModel.aggregate([
        { $match: { productId: { $in: productIds } } },
        {
          $group: {
            _id: "$productId",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      const reviewMap = new Map(
        reviewStats.map((r) => [String(r._id), r])
      );

      const productsWithReviews = products.map((product) => {
        const stats = reviewMap.get(String(product._id));
        return {
          ...product,
          totalReviews: stats?.totalReviews || 0,
          averageRating: stats?.averageRating || 0,
        };
      });

      return await populateColorAndSizeNamesForProducts(productsWithReviews);
    },
    CacheTTL.PRODUCT_BEST_SELLING
  );
};

// ===================================
// 💝 GET FOR YOU PRODUCTS
// ===================================

const getForYouProductsFromDB = async () => {
  const cacheKey = CacheKeys.PRODUCT.FOR_YOU;
  
  return getCachedData(
    cacheKey,
    async () => {
      const products = await VendorProductModel.aggregate([
        { $match: { status: "active" } },
        { $sort: { createdAt: -1 } },
        { $limit: 12 },
        ...getProductLookupPipeline(),
      ]);

      const productIds = products.map((p) => p._id);
      const reviewStats = await ReviewModel.aggregate([
        { $match: { productId: { $in: productIds } } },
        {
          $group: {
            _id: "$productId",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      const reviewMap = new Map(
        reviewStats.map((r) => [String(r._id), r])
      );

      const productsWithReviews = products.map((product) => {
        const stats = reviewMap.get(String(product._id));
        return {
          ...product,
          totalReviews: stats?.totalReviews || 0,
          averageRating: stats?.averageRating || 0,
        };
      });

      return await populateColorAndSizeNamesForProducts(productsWithReviews);
    },
    CacheTTL.PRODUCT_LIST
  );
};

// ===================================
// 🏪 GET VENDOR PRODUCTS BY VENDOR ID
// ===================================

const getVendorProductsByVendorIdFromDB = async (
  vendorId: string,
  page = 1,
  limit = 20
) => {
  const cacheKey = CacheKeys.PRODUCT.BY_VENDOR(vendorId, page);
  
  return getCachedData(
    cacheKey,
    async () => {
      const skip = (page - 1) * limit;
      
      const products = await VendorProductModel.aggregate([
        {
          $match: {
            vendorStoreId: new mongoose.Types.ObjectId(vendorId),
            status: "active",
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        ...getProductLookupPipeline(),
      ]);

      const total = await VendorProductModel.countDocuments({
        vendorStoreId: vendorId,
        status: "active",
      });

      const populatedProducts = await populateColorAndSizeNamesForProducts(products || []);

      return {
        products: populatedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    },
    CacheTTL.PRODUCT_LIST
  );
};

// ===================================
// 🏪 GET VENDOR STORE AND PRODUCTS
// ===================================

const getVendorStoreAndProductsFromDB = async (
  id: string,
  query: any
) => {
  const store = await StoreModel.findOne({
    _id: id,
  });

  if (!store) {
    throw new Error("Store not found for this vendor.");
  }

  const filter: any = {
    vendorStoreId: store._id,
    status: "active",
  };

  if (query.min && query.max) {
    filter["productOptions.price"] = {
      ...(query.min && { $gte: Number(query.min) }),
      ...(query.max && { $lte: Number(query.max) }),
    };
  }

  if (query.size) {
    filter["productOptions.size"] = { $in: query.size.split(",") };
  }

  if (query.brand) {
    filter.brand = { $in: query.brand.split(",") };
  }

  if (query.color) {
    filter["productOptions.color"] = { $in: query.color.split(",") };
  }

  if (query.flag) {
    filter.flag = { $in: query.flag.split(",") };
  }

  if (query.search) {
    filter.productTitle = { $regex: query.search, $options: "i" };
  }

  if (query.category) filter.category = query.category;
  if (query.subCategory) filter.subCategory = query.subCategory;
  if (query.childCategory) filter.childCategory = query.childCategory;

  let sortObj = {};
  if (query.sortBy === "price-asc") sortObj = { productPrice: 1 };
  if (query.sortBy === "price-desc") sortObj = { productPrice: -1 };
  else sortObj = { createdAt: -1 };

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const products = await VendorProductModel.aggregate([
    { $match: filter },
    { $sort: sortObj },
    { $skip: skip },
    { $limit: limit },
    ...getProductLookupPipeline(),
  ]);

  const totalProducts = await VendorProductModel.countDocuments(filter);

  const productIds = products.map((p) => p._id);
  const reviewStats = await ReviewModel.aggregate([
    { $match: { productId: { $in: productIds } } },
    {
      $group: {
        _id: "$productId",
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const reviewMap = new Map(
    reviewStats.map((r) => [String(r._id), r])
  );

  const productsWithReviews = products.map((product) => {
    const stats = reviewMap.get(String(product._id));
    return {
      ...product,
      totalReviews: stats?.totalReviews || 0,
      averageRating: stats?.averageRating || 0,
    };
  });

  const populatedProducts = await populateColorAndSizeNamesForProducts(
    productsWithReviews
  );

  return {
    store,
    productsWithReviews: populatedProducts,
    pagination: {
      total: totalProducts,
      page,
      limit,
      pages: Math.ceil(totalProducts / limit),
    },
  };
};

// ===================================
// 👨‍💼 GET VENDOR STORE AND PRODUCTS (DASHBOARD)
// ===================================

const getVendorStoreAndProductsFromDBVendorDashboard = async (vendorId: string) => {
  const store = await StoreModel.findOne({ vendorId });

  if (!store) {
    throw new Error("Store not found for this vendor");
  }

  const products = await VendorProductModel.find({
    vendorStoreId: store._id,
  }).lean();

  return {
    store,
    products,
  };
};

// ===================================
// ⭐ GET VENDOR STORE PRODUCTS WITH REVIEWS
// ===================================

const getVendorStoreProductsWithReviewsFromDB = async (vendorId: string) => {
  const store = await StoreModel.findOne({ vendorId });

  if (!store) {
    throw new Error("Store not found for this vendor");
  }

  const products = await VendorProductModel.find({
    vendorStoreId: store._id,
  }).lean();

  const productIds = products.map((p) => p._id);
  const allReviews = await ReviewModel.find({
    productId: { $in: productIds },
  }).lean();

  const reviewsByProduct = new Map<string, any[]>();
  allReviews.forEach((review) => {
    const productId = String(review.productId);
    if (!reviewsByProduct.has(productId)) {
      reviewsByProduct.set(productId, []);
    }
    reviewsByProduct.get(productId)!.push(review);
  });

  const productsWithReviews = products.map((product) => {
    const reviews = reviewsByProduct.get(String(product._id)) || [];
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            ).toFixed(1)
          )
        : 0;

    return {
      ...product,
      reviews,
      totalReviews,
      averageRating,
    };
  });

  return {
    store,
    products: productsWithReviews,
  };
};

// ===================================
// 📤 EXPORTS
// ===================================

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
  getLiveSuggestionsFromDB,
  getSearchResultsFromDB,
  getVendorProductsByVendorIdFromDB,
  getOfferProductsFromDB,
  getBestSellingProductsFromDB,
  getForYouProductsFromDB,
  getVendorStoreAndProductsFromDB,
  getVendorStoreAndProductsFromDBVendorDashboard,
  getVendorStoreProductsWithReviewsFromDB,
  getAllVendorProductsNoPaginationFromDB,
};