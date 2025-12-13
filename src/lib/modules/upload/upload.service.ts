import { uploadToCloudinary } from "@/lib/utils/cloudinary";

const uploadService = {
  /**
   * Takes a File object, uploads it to Cloudinary, and returns the secure URL.
   * @param file The file to upload.
   * @returns A promise that resolves to the secure URL of the uploaded file.
   */
  async uploadFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToCloudinary(buffer, "products"); // 'products' is a folder in Cloudinary

    if (!result || !result.secure_url) {
      throw new Error("File upload failed, Cloudinary did not return a URL.");
    }

    return result.secure_url;
  },
};

export default uploadService;