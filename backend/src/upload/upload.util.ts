import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageUploadUtil = async (file: string): Promise<string> => {
    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file, {
            folder: 'ecommerce', // Optional: specify folder where images are stored in Cloudinary
            resource_type: 'auto', // Automatically detect the file type (image, video, etc.)
        });

        console.log('Cloudinary upload result:', result);
        return result.secure_url; // Returning the secure URL of the uploaded image
    } catch (err) {
        console.error('Cloudinary upload error:', err);
        throw new Error('Image upload failed');
    }
};
