export const dynamic = 'force-dynamic'; // ✅ API ক্যাশ বন্ধ করার জন্য

import { VendorProductController } from "@/lib/modules/product/vendorProduct.controller";

// GET request handle করা হচ্ছে
export const GET = VendorProductController.getVendorProductBySlug;