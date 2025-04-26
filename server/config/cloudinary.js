import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadImage = async (file, folder = 'portfolio') => {
  try {
    // If file is already a URL (e.g., from Cloudinary), return it as is
    if (typeof file === 'string' && file.includes('cloudinary.com')) {
      return { url: file };
    }

    // Upload the image
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
      use_filename: true,
      quality: 'auto',
      fetch_format: 'auto'
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Image deletion failed');
  }
};

export default cloudinary; 