"use client";

import React, { useState, FormEvent, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/ReusableComponents/RichTextEditor";
import { Loader2, Save, X, UploadCloud } from "lucide-react";
import Image from "next/image";
import ProductVariantForm, { IProductOption } from "./ProductVariantForm";
import ProductImageGallery from "./ProductImageGallery";
import PricingInventory from "./PricingInventory";
import TagInput from "./TagInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import imageCompression from 'browser-image-compression';

// --- Helper Functions ---
const getIdFromRef = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object" && value !== null) {
    const record = value as { _id?: unknown; id?: unknown };
    if (record._id) return String(record._id);
    if (record.id) return String(record.id);
  }
  return "";
};

// ✅ Valid MongoDB ObjectId check
const isObjectId = (val: string): boolean => /^[a-f\d]{24}$/i.test(val.trim());

// ✅ ObjectId হলে সরাসরি return, না হলে name দিয়ে match করে ID বের করো
const resolveOptionId = (
  rawVal: unknown,
  options: any[],
  nameKeys: string[]
): string => {
  if (!rawVal) return "";
  const strVal = getIdFromRef(rawVal);
  if (!strVal) return "";
  if (isObjectId(strVal)) return strVal;
  const found = options?.find((opt: any) =>
    nameKeys.some((key) => {
      const name = String(opt[key] || "");
      return name.toLowerCase().trim() === strVal.toLowerCase().trim();
    })
  );
  return found ? String(found._id || found.id || "") : "";
};

export default function ProductForm({
  initialData,
  productId: propProductId,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdParam = searchParams?.get("id");
  const productIdParamValue = propProductId || productIdParam;
  const productId =
    productIdParamValue && productIdParamValue !== "undefined"
      ? productIdParamValue
      : null;
  const isEditMode = !!productId;
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  // --- LISTS FROM PROPS ---
  const listStores = initialData?.stores || [];
  const listCategories = initialData?.categories || [];
  const listBrands = initialData?.brands || [];
  const listFlags = initialData?.flags || [];
  const listUnits = initialData?.units || [];
  const listWarranties = initialData?.warranties || [];
  const variantOptionsInitial = initialData?.variantOptions || {};

  // --- STATES ---
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [specification, setSpecification] = useState("");
  const [warrantyPolicy, setWarrantyPolicy] = useState("");
  const [productTags, setProductTags] = useState<string[]>([]);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const [removedGalleryUrls, setRemovedGalleryUrls] = useState<string[]>([]);
  const [initialThumbnailUrl, setInitialThumbnailUrl] = useState<string | null>(null);
  const [removedThumbnailUrl, setRemovedThumbnailUrl] = useState<string | null>(null);

  const [price, setPrice] = useState<number | undefined>(undefined);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number | undefined>(undefined);
  const [rewardPoints, setRewardPoints] = useState<number | undefined>(undefined);
  const [productCode, setProductCode] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [shippingCost, setShippingCost] = useState<number | undefined>(undefined);

  const [store, setStore] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [childCategory, setChildCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [flag, setFlag] = useState("");
  const [unit, setUnit] = useState("");
  const [warranty, setWarranty] = useState("");

  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);

  const [specialOffer, setSpecialOffer] = useState(false);
  const [offerEndTime, setOfferEndTime] = useState("");
  const [hasVariant, setHasVariant] = useState(false);
  const [variants, setVariants] = useState<IProductOption[]>([]);
  const [variantOptions, setVariantOptions] = useState(variantOptionsInitial);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeywordTags, setMetaKeywordTags] = useState<string[]>([]);
  const [metaDescription, setMetaDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditMode);
  const [showDebug, setShowDebug] = useState(false);

  const isInitialLoad = useRef(true);
  const initialModelId = useRef<string | null>(null);
  const initialSubcategoryId = useRef<string | null>(null);

  // --- 1. LOAD PRODUCT DATA ---
  useEffect(() => {
    const fetchExistingProduct = async () => {
      if (!isEditMode || !productId || !token) {
        setIsLoadingProduct(false);
        isInitialLoad.current = false;
        return;
      }

      try {
        // ✅ Standard endpoint — resolveOptionId দিয়ে name→ID handle করা হয়
        const res = await axios.get(`/api/v1/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const p = res.data?.data;
        if (!p) {
          toast.error("Product data not found!");
          setIsLoadingProduct(false);
          return;
        }

        // 1. Basic Info
        setTitle(p.productTitle || "");
        setShortDescription(p.shortDescription || "");
        setFullDescription(p.fullDescription || "");
        setSpecification(p.specification || "");
        setWarrantyPolicy(p.warrantyPolicy || "");
        setProductTags(Array.isArray(p.productTag) ? p.productTag : []);

        // SEO
        setMetaTitle(p.metaTitle || "");
        setMetaDescription(p.metaDescription || "");
        setMetaKeywordTags(
          p.metaKeyword
            ? typeof p.metaKeyword === "string"
              ? p.metaKeyword.split(",").map((k: string) => k.trim()).filter(Boolean)
              : Array.isArray(p.metaKeyword) ? p.metaKeyword : []
            : []
        );

        // 2. Images & Pricing
        setThumbnailPreview(p.thumbnailImage || null);
        setInitialThumbnailUrl(p.thumbnailImage || null);
        setExistingGalleryUrls(Array.isArray(p.photoGallery) ? p.photoGallery : []);
        setPrice(p.productPrice);
        setDiscountPrice(p.discountPrice);
        setStock(p.stock);
        setProductCode(p.sku || "");
        setRewardPoints(p.rewardPoints);
        setShippingCost(p.shippingCost);
        setVideoUrl(p.videoUrl || "");

        // Special Offer
        if (p.offerDeadline) {
          setSpecialOffer(true);
          const deadline = new Date(p.offerDeadline);
          const year = deadline.getFullYear();
          const month = String(deadline.getMonth() + 1).padStart(2, "0");
          const day = String(deadline.getDate()).padStart(2, "0");
          const hours = String(deadline.getHours()).padStart(2, "0");
          const minutes = String(deadline.getMinutes()).padStart(2, "0");
          setOfferEndTime(`${year}-${month}-${day}T${hours}:${minutes}`);
        }

        // 3. IDs
        const catId = getIdFromRef(p.category);
        const subId = getIdFromRef(p.subCategory);
        const childId = getIdFromRef(p.childCategory);
        const brandIdRef = getIdFromRef(p.brand);
        const modelIdRef = getIdFromRef(p.productModel);
        if (subId) initialSubcategoryId.current = subId;
        if (modelIdRef) initialModelId.current = modelIdRef;

        // 4. Dependent list fetches
        const promises: Promise<void>[] = [];
        if (catId) {
          promises.push(
            axios
              .get(`/api/v1/ecommerce-category/ecomSubCategory/category/${catId}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((r) => setSubcategories(r.data?.data || []))
              .catch(() => {})
          );
        }
        if (subId) {
          promises.push(
            axios
              .get(`/api/v1/ecommerce-category/ecomChildCategory?subCategoryId=${subId}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((r) => setChildCategories(r.data?.data || []))
              .catch(() => {})
          );
        }
        if (brandIdRef) {
          promises.push(
            axios
              .get(`/api/v1/product-config/modelName?brandId=${brandIdRef}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((r) => {
                setModels(r.data?.data?.filter((m: any) => m.status === "active") || []);
              })
              .catch(() => {})
          );
        }
        await Promise.all(promises);

        // 5. Main IDs set
        if (getIdFromRef(p.vendorStoreId)) setStore(getIdFromRef(p.vendorStoreId));
        if (catId) setCategory(catId);
        if (subId) setSubcategory(subId);
        if (brandIdRef) setBrand(brandIdRef);
        if (modelIdRef) setModel(modelIdRef);
        if (getIdFromRef(p.flag)) setFlag(getIdFromRef(p.flag));
        if (getIdFromRef(p.weightUnit)) setUnit(getIdFromRef(p.weightUnit));
        if (getIdFromRef(p.warranty)) setWarranty(getIdFromRef(p.warranty));
        if (childId) setChildCategory(childId);

        // 6. ✅ Variants — resolveOptionId দিয়ে ObjectId বা plain name দুটোই handle
        if (p.productOptions?.length > 0) {
          setHasVariant(true);
          const currentVariantOptions = variantOptionsInitial;

          const mappedVariants = p.productOptions.map((opt: any, idx: number) => {
            const rawColor = Array.isArray(opt.color) ? opt.color[0] : opt.color;
            const rawSize = Array.isArray(opt.size) ? opt.size[0] : opt.size;
            const rawStorage = opt.storage;
            const rawSimType = Array.isArray(opt.simType) ? opt.simType[0] : opt.simType;
            const rawCondition = Array.isArray(opt.condition) ? opt.condition[0] : opt.condition;
            const rawWarranty = opt.warranty;

            const colorId = resolveOptionId(rawColor, currentVariantOptions?.colors || [], ["colorName", "name"]);
            const sizeId = resolveOptionId(rawSize, currentVariantOptions?.sizes || [], ["name"]);
            const storageId = resolveOptionId(rawStorage, currentVariantOptions?.storageTypes || [], ["name", "ram", "rom"]);
            const simTypeId = resolveOptionId(rawSimType, currentVariantOptions?.simTypes || [], ["name"]);
            const conditionId = resolveOptionId(rawCondition, currentVariantOptions?.conditions || [], ["deviceCondition", "name"]);
            const warrantyId = resolveOptionId(rawWarranty, currentVariantOptions?.warranties || [], ["warrantyName", "name"]);

            return {
              id: Date.now() + idx,
              imageUrl: opt.productImage || "",
              color: colorId,
              size: sizeId,
              storage: storageId,
              simType: simTypeId,
              condition: conditionId,
              warranty: warrantyId,
              stock: opt.stock || 0,
              price: opt.price || 0,
              discountPrice: opt.discountPrice || 0,
            };
          });

          setVariants(mappedVariants);

          // ✅ Missing storage option (যদি resolve না হয়) custom হিসেবে add করো
          const missingStorageOptions: any[] = [];
          p.productOptions.forEach((opt: any) => {
            const rawStorage = opt.storage;
            if (!rawStorage) return;
            const rawStr = typeof rawStorage === "string" ? rawStorage.trim() : getIdFromRef(rawStorage);
            if (!rawStr) return;
            const alreadyResolved = resolveOptionId(rawStorage, currentVariantOptions?.storageTypes || [], ["name"]);
            if (!alreadyResolved) {
              const existing = currentVariantOptions?.storageTypes || [];
              const existingIds = new Set(existing.map((s: any) => String(s._id || s.id)));
              if (!existingIds.has(rawStr)) {
                missingStorageOptions.push({ _id: rawStr, name: rawStr, ram: undefined, rom: undefined });
              }
            }
          });

          if (missingStorageOptions.length > 0) {
            setVariantOptions((prev: any) => {
              const existing = prev?.storageTypes || [];
              const existingIds = new Set(existing.map((s: any) => String(s._id || s.id)));
              const merged = [
                ...existing,
                ...missingStorageOptions.filter((s) => !existingIds.has(String(s._id))),
              ];
              return { ...prev, storageTypes: merged };
            });

            setVariants((prev) =>
              prev.map((v, idx) => {
                const opt = p.productOptions[idx];
                if (!opt) return v;
                const rawStorage = opt.storage;
                if (!rawStorage) return v;
                const rawStr = typeof rawStorage === "string" ? rawStorage.trim() : getIdFromRef(rawStorage);
                const alreadyResolved = resolveOptionId(rawStorage, currentVariantOptions?.storageTypes || [], ["name"]);
                if (!alreadyResolved && rawStr) return { ...v, storage: rawStr };
                return v;
              })
            );
          }
        }
      } catch (err: any) {
        console.error(err);
        toast.error("❌ Error loading data.");
      } finally {
        setIsLoadingProduct(false);
        setTimeout(() => { isInitialLoad.current = false; }, 500);
      }
    };

    fetchExistingProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, productId, token]);

  // --- 2. FETCH SUBCATEGORIES (User change only) ---
  useEffect(() => {
    if (isInitialLoad.current) return;
    const fetchSubcategories = async () => {
      if (category && token) {
        try {
          const res = await axios.get(
            `/api/v1/ecommerce-category/ecomSubCategory/category/${category}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSubcategories(res.data?.data || []);
          setSubcategory("");
          setChildCategory("");
          setChildCategories([]);
        } catch (error) { console.error(error); }
      } else {
        setSubcategories([]);
        setSubcategory("");
      }
    };
    fetchSubcategories();
  }, [category, token]);

  // --- 3. FETCH CHILD CATEGORIES (User change only) ---
  useEffect(() => {
    if (isInitialLoad.current) return;
    const fetchChildCategories = async () => {
      if (subcategory && token) {
        try {
          const res = await axios.get(
            `/api/v1/ecommerce-category/ecomChildCategory?subCategoryId=${subcategory}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setChildCategories(res.data?.data || []);
          setChildCategory("");
        } catch (error) { console.error(error); }
      } else {
        setChildCategories([]);
        setChildCategory("");
      }
    };
    fetchChildCategories();
  }, [subcategory, token]);

  // --- 4. FETCH MODELS (User change only) ---
  useEffect(() => {
    if (isInitialLoad.current) return;
    const fetchModels = async () => {
      if (brand && token) {
        try {
          const res = await axios.get(
            `/api/v1/product-config/modelName?brandId=${brand}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setModels(res.data?.data?.filter((m: any) => m.status === "active") || []);
          setModel("");
        } catch (error) { console.error(error); }
      } else {
        setModels([]);
        setModel("");
      }
    };
    fetchModels();
  }, [brand, token]);

  // --- 5. SET MODEL AFTER MODELS LIST LOADED ---
  useEffect(() => {
    if (!isEditMode || !initialModelId.current) return;
    if (models.length > 0 && !model) {
      const modelId = initialModelId.current;
      const modelExists = models.some((m: any) => getIdFromRef(m) === modelId);
      if (modelExists) {
        setModel(modelId);
        initialModelId.current = null;
      }
    }
  }, [models, model, isEditMode]);

  // --- 6. SET SUBCATEGORY AFTER LIST LOADED ---
  useEffect(() => {
    if (!isEditMode || !initialSubcategoryId.current) return;
    if (subcategories.length > 0 && !subcategory) {
      const subId = initialSubcategoryId.current;
      const subExists = subcategories.some((s: any) => getIdFromRef(s) === subId);
      if (subExists) {
        setSubcategory(subId);
        initialSubcategoryId.current = null;
      }
    }
  }, [subcategories, subcategory, isEditMode]);

  // --- PRICING ---
  const pricingFormData = {
    price: price ?? "",
    discountPrice: discountPrice ?? "",
    rewardPoints: rewardPoints ?? "",
    stock: stock ?? "",
    shippingCost: shippingCost ?? "",
  };
  const handlePricingInputChange = (field: string, value: unknown) => {
    const numVal = value === "" ? undefined : Number(value);
    if (field === "price") setPrice(numVal);
    if (field === "discountPrice") setDiscountPrice(numVal);
    if (field === "rewardPoints") setRewardPoints(numVal);
    if (field === "stock") setStock(numVal);
    if (field === "shippingCost") setShippingCost(numVal);
  };
  const handlePricingNumberChange = (field: string, delta: number) => {
    const updater = (prev: number | undefined) => Math.max(0, (prev || 0) + delta);
    if (field === "price") setPrice(updater);
    if (field === "discountPrice") setDiscountPrice(updater);
    if (field === "rewardPoints") setRewardPoints(updater);
    if (field === "stock") setStock(updater);
    if (field === "shippingCost") setShippingCost(updater);
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: file.type };
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, { type: file.type, lastModified: Date.now() });
      const formData = new FormData();
      formData.append("file", compressedFile);
      const response = await axios.post("/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      return response.data?.url || "";
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(`Could not upload ${file.name}.`);
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("⚠️ Authentication required.");
    if (!isEditMode && !thumbnail) return toast.error("⚠️ Thumbnail image is required.");
    if (!title || !store || !category) return toast.error("⚠️ Please fill all required fields (*).");
    if (!price || price <= 0) return toast.error("⚠️ Price is required and must be greater than 0.");

    const selectedStore = listStores.find((s: any) => getIdFromRef(s) === store);
    const vendorName = selectedStore?.storeName || "";

    setIsSubmitting(true);
    try {
      let thumbnailUrl = thumbnailPreview;
      if (thumbnail) thumbnailUrl = await uploadFile(thumbnail);

      const filteredExistingUrls = existingGalleryUrls.filter((url) => !removedGalleryUrls.includes(url));
      let newGalleryUrls: string[] = [];
      if (galleryImages.length > 0)
        newGalleryUrls = (await Promise.all(galleryImages.map((file) => uploadFile(file)))).filter((u) => !!u);
      const finalGalleryUrls = [...filteredExistingUrls, ...newGalleryUrls];
      if (finalGalleryUrls.length === 0 && thumbnailUrl) finalGalleryUrls.push(thumbnailUrl as string);

      const productData = {
        productId: productCode || `PROD-${Date.now()}`,
        productTitle: title,
        vendorStoreId: store,
        vendorName,
        shortDescription,
        fullDescription,
        specification,
        warrantyPolicy,
        productTag: productTags,
        videoUrl: videoUrl || undefined,
        photoGallery: finalGalleryUrls,
        thumbnailImage: thumbnailUrl,
        removedPhotoGallery: removedGalleryUrls.length > 0 ? removedGalleryUrls : undefined,
        removeThumbnail: removedThumbnailUrl || undefined,
        productPrice: price || 0,
        discountPrice: discountPrice || undefined,
        stock: stock || 0,
        sku: productCode || undefined,
        rewardPoints: rewardPoints || 0,
        shippingCost: shippingCost || 0,
        category,
        subCategory: subcategory || undefined,
        childCategory: childCategory || undefined,
        brand: brand || undefined,
        productModel: model || undefined,
        flag: flag || undefined,
        warranty: warranty || undefined,
        weightUnit: unit || undefined,
        offerDeadline: offerEndTime ? new Date(offerEndTime) : undefined,
        metaTitle: metaTitle || undefined,
        metaKeyword: metaKeywordTags.length > 0 ? metaKeywordTags.join(", ") : undefined,
        metaDescription: metaDescription || undefined,
        status: "active",
        // ✅ Submit: শুধু valid ObjectId পাঠাও — plain string পাঠালে CastError হয়
        productOptions: hasVariant
          ? await Promise.all(
              variants.map(async (variant) => {
                const uploadedImage = variant.image
                  ? await uploadFile(variant.image as File)
                  : variant.imageUrl || "";

                const safeId = (val?: string) =>
                  val && isObjectId(val) ? val : undefined;

                return {
                  productImage: uploadedImage,
                  color: safeId(variant.color) ? [variant.color] : [],
                  size: safeId(variant.size) ? [variant.size] : [],
                  storage: safeId(variant.storage),
                  simType: safeId(variant.simType) ? [variant.simType] : [],
                  condition: safeId(variant.condition) ? [variant.condition] : [],
                  warranty: safeId(variant.warranty),
                  stock: variant.stock,
                  price: variant.price,
                  discountPrice: variant.discountPrice,
                };
              })
            )
          : [],
      };

      if (isEditMode && productId) {
        await axios.patch(`/api/v1/product/${productId}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Product updated successfully!");
        router.push("/products/all");
      } else {
        await axios.post("/api/v1/product", productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ Product created successfully!");
        router.push("/products/all");
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.message;
      if (errMsg.includes("duplicate") || errMsg.includes("E11000")) {
        toast.error(`⚠️ Duplicate Error: Product Title or SKU already exists.`);
      } else {
        toast.error(`❌ Operation Failed: ${errMsg}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (initialThumbnailUrl) {
        setRemovedThumbnailUrl(initialThumbnailUrl);
        setInitialThumbnailUrl(null);
      }
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnail(null);
      setThumbnailPreview(null);
    }
  };

  if (isLoadingProduct)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
        <span className="ml-3 text-gray-600">Loading product data...</span>
      </div>
    );

  // Debug Panel
  const DebugPanel = () => {
    if (process.env.NODE_ENV !== "development") return null;
    if (!showDebug) {
      return (
        <Button type="button" variant="outline" size="sm" onClick={() => setShowDebug(true)}
          className="fixed bottom-4 right-4 z-50 bg-yellow-100 hover:bg-yellow-200 border-yellow-400">
          🐛 Debug
        </Button>
      );
    }
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-yellow-400 rounded-lg shadow-xl p-4 max-w-md max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-3 pb-2 border-b">
          <h3 className="font-bold text-sm">🐛 Debug Panel</h3>
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="bg-gray-50 p-2 rounded">
            <p className="font-semibold">Product Details:</p>
            <p>Store: {store || "❌ Empty"}</p>
            <p>Category: {category || "❌ Empty"}</p>
            <p>Subcategory: {subcategory || "❌ Empty"}</p>
            <p>Brand: {brand || "❌ Empty"}</p>
            <p>Model: {model || "❌ Empty"}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="font-semibold">Variants:</p>
            <p>Has Variants: {hasVariant ? "✅ Yes" : "❌ No"}</p>
            <p>Count: {variants.length}</p>
            {variants.map((v, i) => (
              <div key={v.id} className="border-t pt-1 mt-1 text-[10px]">
                <p className="font-semibold">Variant {i + 1}:</p>
                <p>Color: {v.color || "❌"}</p>
                <p>Size: {v.size || "❌"}</p>
                <p>Storage: {v.storage || "❌"}</p>
                <p>Warranty: {v.warranty || "❌"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DebugPanel />
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="flex justify-end gap-2 sticky top-4 z-10 bg-gray-50/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-sm -mt-4">
          <Button type="button" variant="destructive" onClick={() => router.back()}>
            <X className="mr-2 h-4 w-4" /> Discard
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            <Save className="mr-2 h-4 w-4" /> {isEditMode ? "Update Product" : "Save Product"}
          </Button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Section 1: Basic Info + Thumbnail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="shadow-sm border-gray-200 flex flex-col h-full">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5 flex-1">
                <div className="space-y-2">
                  <Label>Product Title <span className="text-red-500">*</span></Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Short Description (Max 255)</Label>
                  <Textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} maxLength={255} className="min-h-[100px] resize-none" />
                  <div className="text-xs text-gray-500 text-right">{shortDescription.length}/255</div>
                </div>
                <div className="space-y-2">
                  <Label>Product Tags</Label>
                  <TagInput value={productTags} onChange={setProductTags} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200 flex flex-col h-full">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                  Thumbnail Image <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
                <label htmlFor="thumbnail-upload" className="cursor-pointer group block w-full h-full">
                  <div className="flex items-center justify-center w-full h-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                    {thumbnailPreview ? (
                      <div className="relative w-full h-full min-h-[300px] rounded-md overflow-hidden">
                        <Image src={thumbnailPreview} alt="Thumbnail" fill style={{ objectFit: "contain" }} className="rounded-md" />
                        <Button type="button" variant="destructive" size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.preventDefault(); e.stopPropagation();
                            if (!thumbnail && thumbnailPreview) setRemovedThumbnailUrl((prev) => prev ?? thumbnailPreview);
                            setInitialThumbnailUrl(null); setThumbnail(null); setThumbnailPreview(null);
                          }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <UploadCloud className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-2 text-gray-400" />
                        <p className="text-sm font-medium">Click to upload</p>
                      </div>
                    )}
                  </div>
                  <Input id="thumbnail-upload" type="file" className="hidden" onChange={handleThumbnailChange} accept="image/*" />
                </label>
              </CardContent>
            </Card>
          </div>

          {/* Section 2: Detailed Info + Pricing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="shadow-sm border-gray-200 flex flex-col h-full">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Detailed Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
                <Tabs defaultValue="description" className="w-full h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-50 h-auto p-1">
                    <TabsTrigger value="description" className="text-xs sm:text-sm py-2.5">Description</TabsTrigger>
                    <TabsTrigger value="specification" className="text-xs sm:text-sm py-2.5">Specification</TabsTrigger>
                    <TabsTrigger value="warranty" className="text-xs sm:text-sm py-2.5">Warranty</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-4 flex-1">
                    <RichTextEditor value={fullDescription} onChange={setFullDescription} />
                  </TabsContent>
                  <TabsContent value="specification" className="mt-4 flex-1">
                    <RichTextEditor value={specification} onChange={setSpecification} />
                  </TabsContent>
                  <TabsContent value="warranty" className="mt-4 flex-1">
                    <RichTextEditor value={warrantyPolicy} onChange={setWarrantyPolicy} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200 flex flex-col h-full">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 flex-1">
                <PricingInventory
                  formData={pricingFormData}
                  handleInputChange={handlePricingInputChange}
                  handleNumberChange={handlePricingNumberChange}
                />
                <div className="space-y-2">
                  <Label>Product Code (SKU)</Label>
                  <Input value={productCode} onChange={(e) => setProductCode(e.target.value)} className="h-11" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 3: Gallery + Product Details */}
          <div className={`grid gap-4 sm:gap-6 ${hasVariant ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
            {!hasVariant && (
              <ProductImageGallery
                galleryImages={galleryImages}
                setGalleryImages={setGalleryImages}
                existingGalleryUrls={existingGalleryUrls}
                onRemoveExisting={(url) => {
                  setExistingGalleryUrls((prev) => prev.filter((item) => item !== url));
                  setRemovedGalleryUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
                }}
              />
            )}
            <Card className="shadow-sm border-gray-200 flex flex-col h-full">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Store <span className="text-red-500">*</span></Label>
                    <Select value={store} onValueChange={setStore}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select store" /></SelectTrigger>
                      <SelectContent>
                        {listStores.map((s: any) => (
                          <SelectItem key={getIdFromRef(s)} value={getIdFromRef(s)}>{s.storeName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category <span className="text-red-500">*</span></Label>
                    <Select value={category} onValueChange={(val) => { setCategory(val); if (!isInitialLoad.current) { setSubcategory(""); setChildCategory(""); } }}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {listCategories.map((c: any) => (
                          <SelectItem key={getIdFromRef(c)} value={getIdFromRef(c)}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Select value={subcategory} onValueChange={(val) => { setSubcategory(val); if (!isInitialLoad.current) { setChildCategory(""); } }} disabled={!category}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                      <SelectContent>
                        {subcategories.map((sc: any) => (
                          <SelectItem key={getIdFromRef(sc)} value={getIdFromRef(sc)}>{sc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Child Category</Label>
                    <Select value={childCategory} onValueChange={setChildCategory} disabled={!subcategory}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select child category" /></SelectTrigger>
                      <SelectContent>
                        {childCategories.map((cc: any) => (
                          <SelectItem key={getIdFromRef(cc)} value={getIdFromRef(cc)}>{cc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <Select value={brand} onValueChange={(val) => { setBrand(val); if (!isInitialLoad.current) { setModel(""); } }}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select brand" /></SelectTrigger>
                      <SelectContent>
                        {listBrands.map((b: any) => (
                          <SelectItem key={getIdFromRef(b)} value={getIdFromRef(b)}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select value={model} onValueChange={setModel} disabled={!brand}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select model" /></SelectTrigger>
                      <SelectContent>
                        {models.map((m: any) => (
                          <SelectItem key={getIdFromRef(m)} value={getIdFromRef(m)}>{m.modelName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Flag</Label>
                    <Select value={flag} onValueChange={setFlag}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {listFlags.map((f: any) => (
                          <SelectItem key={getIdFromRef(f)} value={getIdFromRef(f)}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {listUnits.map((u: any) => (
                          <SelectItem key={getIdFromRef(u)} value={getIdFromRef(u)}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Warranty</Label>
                    <Select value={warranty} onValueChange={setWarranty}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Optional" /></SelectTrigger>
                      <SelectContent>
                        {listWarranties.map((w: any) => (
                          <SelectItem key={getIdFromRef(w)} value={getIdFromRef(w)}>{w.warrantyName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Video URL</Label>
                    <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="h-11" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                  <div>
                    <Label>Special Offer</Label>
                    <p className="text-xs text-gray-500 mt-0.5">Enable time-limited offers</p>
                  </div>
                  <Switch checked={specialOffer} onCheckedChange={setSpecialOffer} />
                </div>
                {specialOffer && (
                  <div className="space-y-2 pt-4 mt-4 border-t border-gray-100">
                    <Label>Offer End Time *</Label>
                    <Input type="datetime-local" value={offerEndTime} onChange={(e) => setOfferEndTime(e.target.value)} required className="h-11" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Variants */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Label>Product Has Variant?</Label>
                <Switch checked={hasVariant} onCheckedChange={setHasVariant} />
              </div>
              {hasVariant && (
                <ProductVariantForm
                  variants={variants}
                  setVariants={setVariants}
                  variantData={variantOptions}
                />
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">SEO Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <TagInput value={metaKeywordTags} onChange={setMetaKeywordTags} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="min-h-[100px] resize-none" />
              </div>
            </CardContent>
          </Card>

          {/* Bottom Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="destructive" onClick={() => router.back()}>
              <X className="mr-2 h-4 w-4" /> Discard
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              <Save className="mr-2 h-4 w-4" /> {isEditMode ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}