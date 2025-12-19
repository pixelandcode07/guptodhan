import mongoose from "mongoose";
import { IVendorProduct } from "./vendorProduct.interface";
import { VendorProductModel } from "./vendorProduct.model";
import { ReviewModel } from "../product-review/productReview.model";
import { ProductQAModel } from "../product-qna/productQNA.model";
import { StoreModel } from "../vendor-store/vendorStore.model";
import { ProductColor } from "../product-config/models/productColor.model";
import { ProductSize } from "../product-config/models/productSize.model";

const populateColorAndSizeNames = async (product: any) => {
  if (!product?.productOptions?.length) return product;
  return (await populateColorAndSizeNamesForProducts([product]))[0];
};

const populateColorAndSizeNamesForProducts = async (products: any[]) => {
  if (!products?.length) return products;

  const colorIds = new Set<string>();
  const sizeIds = new Set<string>();

  products.forEach((p: any) => {
    p.productOptions?.forEach((opt: any) => {
      opt.color?.forEach((id: any) => colorIds.add(String(id)));
      opt.size?.forEach((id: any) => sizeIds.add(String(id)));
    });
  });

  if (colorIds.size === 0 && sizeIds.size === 0) return products;

  const [colors, sizes] = await Promise.all([
    colorIds.size > 0 ? ProductColor.find({ _id: { $in: Array.from(colorIds) } }).lean() : [],
    sizeIds.size > 0 ? ProductSize.find({ _id: { $in: Array.from(sizeIds) } }).lean() : [],
  ]);

  const colorMap = new Map(colors.map((c: any) => [String(c._id), c.colorName]));
  const sizeMap = new Map(sizes.map((s: any) => [String(s._id), s.name]));

  return products.map((p: any) => ({
    ...p,
    productOptions: p.productOptions?.map((opt: any) => ({
      ...opt,
      color: opt.color?.map((id: any) => colorMap.get(String(id)) || String(id)),
      size: opt.size?.map((id: any) => sizeMap.get(String(id)) || String(id)),
    })) || p.productOptions,
  }));
};

const createVendorProductInDB = async (payload: Partial<IVendorProduct>) => {
  const result = await VendorProductModel.create(payload);

  // Populate related fields to return names instead of IDs
  const populatedResult = await VendorProductModel.findById(result._id)
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .lean();

  return await populateColorAndSizeNames(populatedResult);
};

const getAllVendorProductsFromDB = async () => {
  const result = await VendorProductModel.find()
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .sort({ createdAt: -1 })
    .lean();
  
  return await populateColorAndSizeNamesForProducts(result);
};

const getActiveVendorProductsFromDB = async () => {
  const result = await VendorProductModel.find({ status: "active" })
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .sort({ createdAt: -1 })
    .lean();
  
  return await populateColorAndSizeNamesForProducts(result);
};

const getVendorProductByIdFromDB = async (id: string) => {
  const productDoc = await VendorProductModel.findById(id)
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name slug")
    .populate("subCategory", "name")
    .populate("childCategory", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName storeLogo")
    .lean(); // Convert to plain JavaScript object


  if (!productDoc) return null;

  // Populate color and size names
  const populatedProduct = await populateColorAndSizeNames(productDoc);

  const reviews = await ReviewModel.find({ productId: id }).lean();
  const qna = await ProductQAModel.find({ productId: id }).lean();

  const ratingStats = await ReviewModel.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(id) } },
    {
      $group: {
        _id: "$productId",
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  return {
    ...populatedProduct,
    ratingStats,
    reviews,
    qna,
  };
};

// filter for main category product
const getVendorProductsByCategoryFromDB = async (
  categoryId: string,
  filters: {
    priceMin?: number;
    priceMax?: number;
    subCategory?: string;
    childCategory?: string;
    brand?: string;
    search?: string;
    sort?: string; // priceLowHigh, priceHighLow, new, old
  }
) => {
  const query: any = {
    status: "active",
  };

  // Category filter
  if (categoryId) {
    query.category = new mongoose.Types.ObjectId(categoryId);
  }

  // Sub Category
  if (filters.subCategory) {
    query.subCategory = new mongoose.Types.ObjectId(filters.subCategory);
  }

  // Child Category
  if (filters.childCategory) {
    query.childCategory = new mongoose.Types.ObjectId(filters.childCategory);
  }

  // Brand
  if (filters.brand) {
    query.brand = new mongoose.Types.ObjectId(filters.brand);
  }

  // Search (title, tags, description)
  if (filters.search) {
    query.$or = [
      { productTitle: { $regex: filters.search, $options: "i" } },
      { shortDescription: { $regex: filters.search, $options: "i" } },
      { productTag: { $regex: filters.search, $options: "i" } },
    ];
  }

  // Price Range
  if (filters.priceMin || filters.priceMax) {
    query["productOptions.price"] = {};

    if (filters.priceMin) {
      query["productOptions.price"].$gte = Number(filters.priceMin);
    }
    if (filters.priceMax) {
      query["productOptions.price"].$lte = Number(filters.priceMax);
    }
  }

  // Sorting
  let sortQuery: any = { createdAt: -1 }; // default newest

  if (filters.sort === "priceLowHigh") {
    sortQuery = { "productOptions.price": 1 };
  }
  if (filters.sort === "priceHighLow") {
    sortQuery = { "productOptions.price": -1 };
  }
  if (filters.sort === "new") {
    sortQuery = { createdAt: -1 };
  }
  if (filters.sort === "old") {
    sortQuery = { createdAt: 1 };
  }

  // Database query
  const result = await VendorProductModel.find(query)
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("subCategory", "name")
    .populate("childCategory", "name")
    .populate("category", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .sort(sortQuery)
    .lean();

  return await populateColorAndSizeNamesForProducts(result);
};

// filter for sub category product
const getVendorProductsBySubCategoryFromDB = async (
  subCategoryId: string,
  filters: {
    priceMin?: number;
    priceMax?: number;
    brand?: string;
    childCategory?: string;
    search?: string;
    sort?: string; // priceLowHigh | priceHighLow | new | old
  }
) => {
  const query: any = {
    status: "active",
    subCategory: new mongoose.Types.ObjectId(subCategoryId),
  };

  // Brand filter
  if (filters.brand) {
    query.brand = new mongoose.Types.ObjectId(filters.brand);
  }

  // Child category filter
  if (filters.childCategory) {
    query.childCategory = new mongoose.Types.ObjectId(filters.childCategory);
  }

  // Search filter
  if (filters.search) {
    query.productTitle = {
      $regex: filters.search,
      $options: "i",
    };
  }

  // Price filter inside productOptions array
  if (filters.priceMin || filters.priceMax) {
    query["productOptions.price"] = {};

    if (filters.priceMin) {
      query["productOptions.price"].$gte = Number(filters.priceMin);
    }

    if (filters.priceMax) {
      query["productOptions.price"].$lte = Number(filters.priceMax);
    }
  }

  // Sorting logic
  let sortQuery: any = { createdAt: -1 }; // default

  if (filters.sort === "priceLowHigh") {
    sortQuery = { "productOptions.price": 1 };
  } else if (filters.sort === "priceHighLow") {
    sortQuery = { "productOptions.price": -1 };
  } else if (filters.sort === "new") {
    sortQuery = { createdAt: -1 };
  } else if (filters.sort === "old") {
    sortQuery = { createdAt: 1 };
  }

  const result = await VendorProductModel.find(query)
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("childCategory", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .sort(sortQuery)
    .lean();

  return await populateColorAndSizeNamesForProducts(result);
};

// filter for child category product
const getVendorProductsByChildCategoryFromDB = async (
  childCategoryId: string,
  filters: {
    priceMin?: number;
    priceMax?: number;
    brand?: string;
    subCategory?: string;
    search?: string;
    sort?: string; // priceLowHigh | priceHighLow | new | old
  }
) => {
  const query: any = {
    status: "active",
    childCategory: new mongoose.Types.ObjectId(childCategoryId),
  };

  // Sub category filter
  if (filters.subCategory) {
    query.subCategory = new mongoose.Types.ObjectId(filters.subCategory);
  }

  // Brand filter
  if (filters.brand) {
    query.brand = new mongoose.Types.ObjectId(filters.brand);
  }

  // Search filter (productTitle)
  if (filters.search) {
    query.productTitle = {
      $regex: filters.search,
      $options: "i",
    };
  }

  // Price filter in productOptions array
  if (filters.priceMin || filters.priceMax) {
    query["productOptions.price"] = {};

    if (filters.priceMin) {
      query["productOptions.price"].$gte = Number(filters.priceMin);
    }
    if (filters.priceMax) {
      query["productOptions.price"].$lte = Number(filters.priceMax);
    }
  }

  // Sorting
  let sortQuery: any = { createdAt: -1 }; // default: newest first

  if (filters.sort === "priceLowHigh") {
    sortQuery = { "productOptions.price": 1 };
  } else if (filters.sort === "priceHighLow") {
    sortQuery = { "productOptions.price": -1 };
  } else if (filters.sort === "new") {
    sortQuery = { createdAt: -1 };
  } else if (filters.sort === "old") {
    sortQuery = { createdAt: 1 };
  }

  const result = await VendorProductModel.find(query)
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("childCategory", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .sort(sortQuery)
    .lean();

  return await populateColorAndSizeNamesForProducts(result);
};

const getVendorProductsByBrandFromDB = async (brandId: string) => {
  const result = await VendorProductModel.find({
    brand: brandId,
    status: "active",
  })
    .populate("brand", "name") // 'brandName' -> 'name'
    .populate("flag", "name") // 'flagName' -> 'name'
    .populate("warranty", "warrantyName")
    .populate("productModel", "name") // 'modelName' -> 'name'
    .populate("category", "name") // 'categoryName' -> 'name'
    .populate("weightUnit", "name") // 'unitName' -> 'name'
    .populate("vendorStoreId", "storeName")
    .sort({ createdAt: -1 })
    .lean();
  
  return await populateColorAndSizeNamesForProducts(result);
};

const updateVendorProductInDB = async (
  id: string,
  payload: Partial<IVendorProduct>
) => {
  const result = await VendorProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("brand", "name") // 'brandName' -> 'name'
    .populate("flag", "name") // 'flagName' -> 'name'
    .populate("warranty", "warrantyName")
    .populate("productModel", "name") // 'modelName' -> 'name'
    .populate("category", "name") // 'categoryName' -> 'name'
    .populate("weightUnit", "name") // 'unitName' -> 'name'
    .populate("vendorStoreId", "storeName")
    .lean();

  // Populate color and size names
  return await populateColorAndSizeNames(result);
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
    .populate("brand", "name") // 'brandName' -> 'name'
    .populate("flag", "name") // 'flagName' -> 'name'
    .populate("warranty", "warrantyName")
    .populate("productModel", "name") // 'modelName' -> 'name'
    .populate("category", "name") // 'categoryName' -> 'name'
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .lean();
  
  // Populate color and size names
  return await populateColorAndSizeNames(result);
};

const removeProductOptionFromDB = async (id: string, optionIndex: number) => {
  const product = await VendorProductModel.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }

  product.productOptions?.splice(optionIndex, 1);
  await product.save();

  const result = await VendorProductModel.findById(id)
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .lean();
  
  // Populate color and size names
  return await populateColorAndSizeNames(result);
};

//landing page all products
const getLandingPageProductsFromDB = async () => {
  const [runningOffers, bestSelling, randomProducts] = await Promise.all([
    VendorProductModel.find({
      status: "active",
      offerDeadline: { $gt: new Date() },
    })
      .populate("brand", "name")
      .populate("flag", "name")
      .populate("warranty", "warrantyName")
      .populate("productModel", "name")
      .populate("category", "name")
      .populate("weightUnit", "name")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),

    VendorProductModel.find({ status: "active" })
      .populate("brand", "name")
      .populate("flag", "name")
      .populate("warranty", "warrantyName")
      .populate("productModel", "name")
      .populate("category", "name")
      .populate("weightUnit", "name")
      .sort({ sellCount: -1 })
      .limit(6)
      .lean(),

    VendorProductModel.find({ status: "active" })
      .populate("brand", "name")
      .populate("flag", "name")
      .populate("warranty", "warrantyName")
      .populate("productModel", "name")
      .populate("category", "name")
      .populate("weightUnit", "name")
      .lean(),
  ]);

  const [populatedRunningOffers, populatedBestSelling, populatedRandomProducts] = await Promise.all([
    populateColorAndSizeNamesForProducts(runningOffers),
    populateColorAndSizeNamesForProducts(bestSelling),
    populateColorAndSizeNamesForProducts(randomProducts),
  ]);

  return {
    runningOffers: populatedRunningOffers,
    bestSelling: populatedBestSelling,
    randomProducts: populatedRandomProducts,
  };
};

// live search suggestions + full search results
const getLiveSuggestionsFromDB = async (searchTerm: string) => {
  const regex = new RegExp(searchTerm.split(" ").join("|"), "i");

  const suggestions = await VendorProductModel.find({
    status: "active",
    productTitle: { $regex: regex },
  })
    .select("productTitle productImage price") // -> Add By Moinuddin
    .populate("category", "slug") // -> Add By Moinuddin
    .populate("subCategory", "slug") // -> Add By Moinuddin
    .populate("childCategory", "slug") // -> Add By Moinuddin
    .limit(5)
    .sort({ createdAt: -1 });

  return suggestions;
};

const getSearchResultsFromDB = async (searchTerm: string) => {
  const words = searchTerm
    .split(" ")
    .map((w) => w.trim())
    .filter(Boolean);
  const regexArr = words.map((w) => new RegExp(w, "i"));

  const results = await VendorProductModel.find({
    status: "active",
    $or: [
      { productTitle: { $in: regexArr } },
      { shortDescription: { $in: regexArr } },
      { productTag: { $in: regexArr } },
    ],
  })
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .sort({ createdAt: -1 })
    .lean();

  // Populate color and size names
  return await populateColorAndSizeNamesForProducts(results);
};

const basePopulate = [
  { path: "brand", select: "name brandName" },
  { path: "flag", select: "name" },
  { path: "warranty", select: "warrantyName" },
  { path: "productModel", select: "name" },
  { path: "category", select: "name" },
  { path: "weightUnit", select: "name" },
];

const getOfferProductsFromDB = async () => {
  const products = await VendorProductModel.find({
    status: "active",
    offerDeadline: { $gt: new Date() },
  })
    .populate(basePopulate)
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  const productsWithReviews = await Promise.all(
    products.map(async (product) => {
      const ratingStats = await ReviewModel.aggregate([
        {
          $match: { productId: product._id },
        },
        {
          $group: {
            _id: "$productId",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      return {
        ...product,
        totalReviews: ratingStats[0]?.totalReviews || 0,
        averageRating: ratingStats[0]?.averageRating || 0,
      };
    })
  );

  // Populate color and size names
  return await populateColorAndSizeNamesForProducts(productsWithReviews);
};

// BEST SELLING
const getBestSellingProductsFromDB = async () => {
  const products = await VendorProductModel.find({ status: "active" })
    .populate(basePopulate)
    .sort({ sellCount: -1 })
    .limit(6)
    .lean();

  const productsWithReviews = await Promise.all(
    products.map(async (product) => {
      const ratingStats = await ReviewModel.aggregate([
        {
          $match: { productId: product._id },
        },
        {
          $group: {
            _id: "$productId",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      return {
        ...product,
        totalReviews: ratingStats[0]?.totalReviews || 0,
        averageRating: ratingStats[0]?.averageRating || 0,
      };
    })
  );

  // Populate color and size names
  return await populateColorAndSizeNamesForProducts(productsWithReviews);
};

// FOR YOU (random / all active)
const getForYouProductsFromDB = async () => {
  const products = await VendorProductModel.find({ status: "active" })
    .populate(basePopulate)
    .sort({ createdAt: -1 })
    .lean();

  const productsWithReviews = await Promise.all(
    products.map(async (product) => {
      const ratingStats = await ReviewModel.aggregate([
        {
          $match: { productId: product._id },
        },
        {
          $group: {
            _id: "$productId",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      return {
        ...product,
        totalReviews: ratingStats[0]?.totalReviews || 0,
        averageRating: ratingStats[0]?.averageRating || 0,
      };
    })
  );

  // Populate color and size names
  return await populateColorAndSizeNamesForProducts(productsWithReviews);
};

const getVendorProductsByVendorIdFromDB = async (vendorId: string) => {
  const products = await VendorProductModel.find({
    vendorStoreId: vendorId,
    status: "active",
  })
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("childCategory", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .lean();

  // Populate color and size names
  return await populateColorAndSizeNamesForProducts(products || []);
};

// SERVICE for the vendor store page with products and filters
const getVendorStoreAndProductsFromDB = async (
  id: string, // Change by Moinuddin
  query: any
) => {
  // -----------------------------
  // 1. Fetch Vendor Store
  // -----------------------------
  const store = await StoreModel.findOne({
    _id: id, // Change by Moinuddin
  });

  if (!store) {
    throw new Error("Store not found for this vendor.");
  }

  // -----------------------------
  // 2. Build Filters for Products
  // -----------------------------

  const filter: any = {
    vendorStoreId: store._id,
    status: "active",
  };

  // Price Range
  if (query.min && query.max) {
    filter["productOptions.price"] = {
      ...(query.min && { $gte: Number(query.min) }),
      ...(query.max && { $lte: Number(query.max) }),
    };
  }

  // Sizes
  if (query.size) {
    filter["productOptions.size"] = { $in: query.size.split(",") };
  }

  // Brand
  if (query.brand) {
    filter.brand = { $in: query.brand.split(",") };
  }

  // Color
  if (query.color) {
    filter["productOptions.color"] = { $in: query.color.split(",") };
  }

  // Flags
  if (query.flag) {
    filter.flag = { $in: query.flag.split(",") };
  }

  // Search
  if (query.search) {
    filter.productTitle = { $regex: query.search, $options: "i" };
  }

  // Category Hierarchy Filters
  if (query.category) filter.category = query.category;
  if (query.subCategory) filter.subCategory = query.subCategory;
  if (query.childCategory) filter.childCategory = query.childCategory;

  // -----------------------------
  // Sorting
  // -----------------------------
  let sortObj = {};
  if (query.sortBy === "price-asc") sortObj = { productPrice: 1 };
  if (query.sortBy === "price-desc") sortObj = { productPrice: -1 };
  else sortObj = { createdAt: -1 }; // default newest first

  // -----------------------------
  // Pagination
  // -----------------------------
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  // -----------------------------
  // 3. Fetch Products with Filters
  // -----------------------------
  const products = await VendorProductModel.find(filter)
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("childCategory", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  // Count for pagination
  const totalProducts = await VendorProductModel.countDocuments(filter);

  const productsWithReviews = await Promise.all(
    products.map(async (product) => {
      const ratingStats = await ReviewModel.aggregate([
        {
          $match: { productId: product._id },
        },
        {
          $group: {
            _id: "$productId",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      return {
        ...product.toObject(),
        totalReviews: ratingStats[0]?.totalReviews || 0,
        averageRating: ratingStats[0]?.averageRating || 0,
      };
    })
  );

  const populatedProducts = await populateColorAndSizeNamesForProducts(productsWithReviews);

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
};
