/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
// deleteFromCloudinary ফাংশনটি ইমপোর্ট করতে হবে (যদি utils এ থাকে)
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/utils/cloudinary'; 
import { createBannerValidationSchema } from './banner.validation';
import { ClassifiedBannerServices } from './banner.service';
import dbConnect from '@/lib/db';
import { IClassifiedBanner } from './banner.interface';

// ✅ Create Banner with Rollback System
const createBanner = async (req: NextRequest) => {
    await dbConnect();
    
    // ১. আপলোড করা ইমেজের URL ট্র্যাক করার জন্য ভেরিয়েবল
    let uploadedImageUrl: string | null = null;

    try {
        const formData = await req.formData();
        const bannerImageFile = formData.get('bannerImage') as File | null;
        const bannerDescription = formData.get('bannerDescription') as string;

        if (!bannerImageFile) {
            throw new Error('Banner image is required.');
        }

        // ২. ইমেজ আপলোড করা
        const buffer = Buffer.from(await bannerImageFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(buffer, 'buy-sell-banners');
        
        // আপলোড সফল হলে URL স্টোর করলাম
        uploadedImageUrl = uploadResult.secure_url;

        const payload = {
            bannerImage: uploadResult.secure_url,
            bannerDescription: bannerDescription,
        };

        // ৩. ভ্যালিডেশন চেক (এখানে এরর হলে catch ব্লকে যাবে)
        const validatedData = createBannerValidationSchema.parse(payload);
        
        // ৪. ডাটাবেসে সেভ (এখানে এরর হলে catch ব্লকে যাবে)
        const result = await ClassifiedBannerServices.createBannerInDB(validatedData);

        return sendResponse({
            success: true,
            statusCode: StatusCodes.CREATED,
            message: 'Banner created successfully!',
            data: result,
        });

    } catch (error) {
        // ❌ ৫. যদি কোনো এরর হয় এবং ইমেজ ইতিমধ্যে আপলোড হয়ে থাকে, তবে সেটি ডিলেট করে দাও
        if (uploadedImageUrl) {
            console.log('Rolling back: Deleting uploaded image due to error...');
            await deleteFromCloudinary(uploadedImageUrl);
        }
        // ৬. এররটি আবার থ্রো করুন যাতে গ্লোবাল এরর হ্যান্ডলার এটি ধরতে পারে
        throw error;
    }
};

const getAllPublicBanners = async (_req: NextRequest) => {
    await dbConnect();
    const result = await ClassifiedBannerServices.getAllPublicBannersFromDB();
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Banners retrieved successfully!',
        data: result,
    });
};

// ✅ Update Banner with Rollback System & Params Fix
const updateBanner = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params;

    let newUploadedImageUrl: string | null = null;

    try {
        const formData = await req.formData();
        const bannerImageFile = formData.get('bannerImage') as File | null;
        const bannerDescription = formData.get('bannerDescription') as string | null;
        
        // 🔥 ১. ফ্রন্টএন্ড থেকে পাঠানো ফ্ল্যাগ রিসিভ করা
        const isImageRemoved = formData.get('isImageRemoved') === 'true';

        const updateData: Partial<IClassifiedBanner> = {};

        // লজিক: যদি নতুন ছবি দেয় -> আপলোড করো
        if (bannerImageFile) {
            const buffer = Buffer.from(await bannerImageFile.arrayBuffer());
            const uploadResult = await uploadToCloudinary(buffer, 'buy-sell-banners');
            
            newUploadedImageUrl = uploadResult.secure_url;
            updateData.bannerImage = uploadResult.secure_url;
        } 
        // 🔥 ২. যদি নতুন ছবি না থাকে কিন্তু ইউজার রিমুভ করতে চায়
        else if (isImageRemoved) {
            // আগের ছবি খুঁজে বের করে ক্লাউডিনারি থেকে ডিলিট করতে হবে
            const existingBanner = await ClassifiedBannerServices.getBannerById(id); // (এই সার্ভিস মেথড না থাকলে সরাসরি Model.findById করতে পারেন)
            
            // অথবা সার্ভিস ফাইলের updateBannerInDB তে লজিক হ্যান্ডেল করা ভালো।
            // আমরা এখানে সরাসরি বলে দিচ্ছি ইমেজ ফাঁকা হবে
            updateData.bannerImage = ""; // অথবা null, আপনার স্কিমা অনুযায়ী
        }

        if (bannerDescription !== null) {
            updateData.bannerDescription = bannerDescription;
        }

        const updatedBanner = await ClassifiedBannerServices.updateBannerInDB(id, updateData);

        return sendResponse({
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Banner updated successfully!',
            data: updatedBanner,
        });

    } catch (error) {
        if (newUploadedImageUrl) {
            await deleteFromCloudinary(newUploadedImageUrl);
        }
        throw error;
    }
};

// ✅ Delete Banner (Params Fix Added)
const deleteBanner = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await dbConnect();
    const { id } = await params; // Params await fix
    await ClassifiedBannerServices.deleteBannerFromDB(id);
    return sendResponse({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Banner deleted successfully!',
        data: null,
    });
};

export const ClassifiedBannerController = {
    createBanner,
    getAllPublicBanners,
    deleteBanner,
    updateBanner,
};