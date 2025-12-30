import mongoose from "mongoose";
import { IVendorProduct } from "./vendorProduct.interface";
import { VendorProductModel } from "./vendorProduct.model";
import { ReviewModel } from "../product-review/productReview.model";
import { ProductQAModel } from "../product-qna/productQNA.model";
import { StoreModel } from "../vendor-store/vendorStore.model";
import { ProductColor } from "../product-config/models/productColor.model";
import { ProductSize } from "../product-config/models/productSize.model";

// ✅ SINGLE DEFINITION - No duplicate functions
const populateColorAndSizeNamesForProducts = async (products: any[]) => {
  if (!products?.length) return products;

  const colorIds = new Set<string>();
  const sizeIds = new Set<string>();

  // Collect all color and size IDs
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

  // Fetch all colors and sizes at once
  const [colors, sizes] = await Promise.all([
    colorIds.size
      ? ProductColor.find({ _id: { $in: Array.from(colorIds) } }).lean()
      : [],
    sizeIds.size
      ? ProductSize.find({ _id: { $in: Array.from(sizeIds) } }).lean()
      : [],
  ]);

  // Create maps for quick lookup
  const colorMap = new Map(colors.map((c: any) => [String(c._id), c.colorName]));
  const sizeMap = new Map(sizes.map((s: any) => [String(s._id), s.name]));

  // Transform products with color and size names
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

// ✅ Helper function to populate single product
const populateColorAndSizeNames = async (product: any) => {
  if (!product?.productOptions?.length) return product;
  return (await populateColorAndSizeNamesForProducts([product]))[0];
};

const createVendorProductInDB = async (payload: Partial<IVendorProduct>) => {
  const result = await VendorProductModel.create(payload);

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
    // ✅ Populate nested color and size references
    .populate({
      path: "productOptions.color",
      model: "ProductColor",
      select: "colorName"
    })
    .populate({
      path: "productOptions.size",
      model: "ProductSize",
      select: "name"
    })
    .lean() as any; // ✅ Cast to 'any' to avoid TypeScript issues with lean()

  if (!productDoc) return null;

  // ✅ Proper type casting for productOptions
  const productOptions = (productDoc.productOptions || []) as any[];

  // Transform the data to extract names from populated objects
  const transformedProduct = {
    ...productDoc,
    productOptions: productOptions.map((option: any) => ({
      ...option,
      color: Array.isArray(option.color) 
        ? option.color.map((c: any) => c?.colorName || c)
        : option.color,
      size: Array.isArray(option.size)
        ? option.size.map((s: any) => s?.name || s)
        : option.size,
    }))
  };

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
    ...transformedProduct,
    ratingStats,
    reviews,
    qna,
  };
};


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
  } = {}
) => {
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

const getVendorProductsBySubCategoryFromDB = async (
  subCategoryId: string,
  filters: {
    priceMin?: number;
    priceMax?: number;
    brand?: string;
    childCategory?: string;
    search?: string;
    sort?: string;
  } = {}
) => {
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

const updateVendorProductInDB = async (
  id: string,
  payload: Partial<IVendorProduct>
) => {
  const result = await VendorProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .lean();

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
    .populate("brand", "name")
    .populate("flag", "name")
    .populate("warranty", "warrantyName")
    .populate("productModel", "name")
    .populate("category", "name")
    .populate("weightUnit", "name")
    .populate("vendorStoreId", "storeName")
    .lean();
  
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
  
  return await populateColorAndSizeNames(result);
};

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
};

const getLiveSuggestionsFromDB = async (searchTerm: string) => {
  const regex = new RegExp(searchTerm.split(" ").join("|"), "i");

  const suggestions = await VendorProductModel.find({
    status: "active",
    productTitle: { $regex: regex },
  })
    .select("productTitle productImage price")
    .populate("category", "slug")
    .populate("subCategory", "slug")
    .populate("childCategory", "slug")
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

  return await populateColorAndSizeNamesForProducts(productsWithReviews);
};

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

  return await populateColorAndSizeNamesForProducts(productsWithReviews);
};

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

  return await populateColorAndSizeNamesForProducts(products || []);
};

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

const getVendorStoreAndProductsFromDBVendorDashboard = async (vendorId: string) => {
  const store = await StoreModel.findOne({ vendorId });

  if (!store) {
    throw new Error("Store not found for this vendor");
  }

  const products = await VendorProductModel.find({
    vendorStoreId: store._id,
  });

  return {
    store,
    products,
  };
};

const getVendorStoreProductsWithReviewsFromDB = async (vendorId: string) => {
  const store = await StoreModel.findOne({ vendorId });

  if (!store) {
    throw new Error("Store not found for this vendor");
  }

  const products = await VendorProductModel.find({
    vendorStoreId: store._id,
  });

  const productsWithReviews = await Promise.all(
    products.map(async (product) => {
      const reviews = await ReviewModel.find({
        productId: product._id,
      })
        // .select('rating comment userId createdAt')
        // .populate('userId', 'name photo');

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
        ...product.toObject(),
        reviews,
        totalReviews,
        averageRating,
      };
    })
  );

  return {
    store,
    products: productsWithReviews,
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
  getVendorStoreAndProductsFromDBVendorDashboard,
  getVendorStoreProductsWithReviewsFromDB
};
