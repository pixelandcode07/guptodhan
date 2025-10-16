import { uploadToCloudinary } from "@/lib/utils/cloudinary";

const uploadService = {
  async uploadFile(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToCloudinary(buffer, "products");

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  },
};

export default uploadService;
