import mongoose from "mongoose";
import { IVendorProduct } from "./vendorProduct.interface";
import { VendorProductModel } from "./vendorProduct.model";
import { ReviewModel } from "../product-review/productReview.model";
import { ProductQAModel } from "../product-qna/productQNA.model";
import { StoreModel } from "../vendor-store/vendorStore.model";
import { ProductColor } from "../product-config/models/productColor.model";
import { ProductSize } from "../product-config/models/productSize.model";
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

  for (const p of products) {
    for (const opt of p.productOptions || []) {
      if (Array.isArray(opt.color)) {
        opt.color.forEach((id: any) => colorIds.add(String(id)));
      }
      if (Array.isArray(opt.size)) {
        opt.size.forEach((id: any) => sizeIds.add(String(id)));
      }
    }
  }

  if (!colorIds.size && !sizeIds.size) return products;

  const [colors, sizes] = await Promise.all([
    colorIds.size
      ? ProductColor.find({ _id: { $in: Array.from(colorIds) } }).lean()
      : [],
    sizeIds.size
      ? ProductSize.find({ _id: { $in: Array.from(sizeIds) } }).lean()
      : [],
  ]);

  const colorMap = new Map(colors.map((c: any) => [String(c._id), c.colorName]));
  const sizeMap = new Map(sizes.map((s: any) => [String(s._id), s.name]));

  return products.map((p: any) => ({
    ...p,
    productOptions: p.productOptions?.map((opt: any) => ({
      ...opt,
      color: Array.isArray(opt.color) 
        ? opt.color.map((id: any) => colorMap.get(String(id)) || String(id)) 
        : opt.color,
      size: Array.isArray(opt.size) 
        ? opt.size.map((id: any) => sizeMap.get(String(id)) || String(id)) 
        : opt.size,
    })) || p.productOptions,
  }));
};

const populateColorAndSizeNames = async (product: any) => {
  if (!product?.productOptions?.length) return product;
  return (await populateColorAndSizeNamesForProducts([product]))[0];
};

// ===================================
// 🚀 REUSABLE AGGREGATION PIPELINE
// ===================================

const getProductLookupPipeline = () => [
  {
    $lookup: {
      from: 'brandmodels',
      localField: 'brand',
      foreignField: '_id',
      as: 'brand',
    },
  },
  { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
  
  {
    $lookup: {
      from: 'productflags',
      localField: 'flag',
      foreignField: '_id',
      as: 'flag',
    },
  },
  { $unwind: { path: '$flag', preserveNullAndEmptyArrays: true } },
  
  {
    $lookup: {
      from: 'productwarrantymodels',
      localField: 'warranty',
      foreignField: '_id',
      as: 'warranty',
    },
  },
  { $unwind: { path: '$warranty', preserveNullAndEmptyArrays: true } },
  
  {
    $lookup: {
      from: 'productmodels',
      localField: 'productModel',
      foreignField: '_id',
      as: 'productModel',
    },
  },
  { $unwind: { path: '$productModel', preserveNullAndEmptyArrays: true } },
  
  {
    $lookup: {
      from: 'categorymodels',
      localField: 'category',
      foreignField: '_id',
      as: 'category',
    },
  },
  { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
  
  {
    $lookup: {
      from: 'subcategorymodels',
      localField: 'subCategory',
      foreignField: '_id',
      as: 'subCategory',
    },
  },
  { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },
  
  {
    $lookup: {
      from: 'childcategorymodels',
      localField: 'childCategory',
      foreignField: '_id',
      as: 'childCategory',
    },
  },
  { $unwind: { path: '$childCategory', preserveNullAndEmptyArrays: true } },
  
  {
    $lookup: {
      from: 'productunits',
      localField: 'weightUnit',
      foreignField: '_id',
      as: 'weightUnit',
    },
  },
  { $unwind: { path: '$weightUnit', preserveNullAndEmptyArrays: true } },
  
  {
    $lookup: {
      from: 'storemodels',
      localField: 'vendorStoreId',
      foreignField: '_id',
      as: 'vendorStoreId',
    },
  },
  { $unwind: { path: '$vendorStoreId', preserveNullAndEmptyArrays: true } },
  
  {
    $project: {
      'brand.name': 1,
      'brand.brandName': 1,
      'flag.name': 1,
      'warranty.warrantyName': 1,
      'productModel.name': 1,
      'category.name': 1,
      'category.slug': 1,
      'subCategory.name': 1,
      'subCategory.slug': 1,
      'childCategory.name': 1,
      'childCategory.slug': 1,
      'weightUnit.name': 1,
      'vendorStoreId.storeName': 1,
      'vendorStoreId.storeLogo': 1,
      productId: 1,
      productTitle: 1,
      vendorName: 1,
      shortDescription: 1,
      fullDescription: 1,
      specification: 1,
      warrantyPolicy: 1,
      productTag: 1,
      videoUrl: 1,
      photoGallery: 1,
      thumbnailImage: 1,
      productPrice: 1,
      discountPrice: 1,
      stock: 1,
      sku: 1,
      rewardPoints: 1,
      offerDeadline: 1,
      metaTitle: 1,
      metaKeyword: 1,
      metaDescription: 1,
      status: 1,
      sellCount: 1,
      productOptions: 1,
      createdAt: 1,
      updatedAt: 1,
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
      // ✅ Full aggregation pipeline for single product
      const productResult = await VendorProductModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        ...getProductLookupPipeline(),
        
        // ✅ Lookup colors for productOptions
        {
          $lookup: {
            from: 'productcolors',
            localField: 'productOptions.color',
            foreignField: '_id',
            as: 'colorDetails',
          },
        },
        
        // ✅ Lookup sizes for productOptions
        {
          $lookup: {
            from: 'productsizes',
            localField: 'productOptions.size',
            foreignField: '_id',
            as: 'sizeDetails',
          },
        },
      ]);

      if (!productResult || !productResult[0]) return null;
      
      const productDoc = productResult[0];

      // Transform color and size IDs to names
      const colorMap = new Map(
        (productDoc.colorDetails || []).map((c: any) => [String(c._id), c.colorName])
      );
      const sizeMap = new Map(
        (productDoc.sizeDetails || []).map((s: any) => [String(s._id), s.name])
      );

      const transformedProduct = {
        ...productDoc,
        productOptions: (productDoc.productOptions || []).map((option: any) => ({
          ...option,
          color: Array.isArray(option.color) 
            ? option.color.map((id: any) => colorMap.get(String(id)) || String(id))
            : option.color,
          size: Array.isArray(option.size)
            ? option.size.map((id: any) => sizeMap.get(String(id)) || String(id))
            : option.size,
        })),
      };

      // Remove temporary fields
      delete transformedProduct.colorDetails;
      delete transformedProduct.sizeDetails;

      // ✅ Parallel fetch reviews and QNA
      const [reviews, qna, ratingStats] = await Promise.all([
        ReviewModel.find({ productId: id }).lean(),
        ProductQAModel.find({ productId: id }).lean(),
        ReviewModel.aggregate([
          { $match: { productId: new mongoose.Types.ObjectId(id) } },
          {
            $group: {
              _id: "$productId",
              totalReviews: { $sum: 1 },
              averageRating: { $avg: "$rating" },
            },
          },
        ]),
      ]);

      return {
        ...transformedProduct,
        ratingStats,
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


const getAllProductsNoLimitForAdmin = async () => {
  const cacheKey = 'products:admin:all:nolimit';
  
  return getCachedData(
    cacheKey,
    async () => {
      const products = await VendorProductModel.aggregate([
        { $sort: { createdAt: -1 } },
        ...getProductLookupPipeline(),
      ]);

      const total = await VendorProductModel.countDocuments();
      const populatedProducts = await populateColorAndSizeNamesForProducts(products);

      return {
        products: populatedProducts,
        total,
      };
    },
    CacheTTL.PRODUCT_LIST || 3600
  );
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
  getAllProductsNoLimitForAdmin,
};