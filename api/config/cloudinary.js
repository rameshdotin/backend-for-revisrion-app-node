import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const configureCloudinary = () => {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvwfyywj7',
		api_key: process.env.CLOUDINARY_API_KEY || '925827947152548',
		api_secret: process.env.CLOUDINARY_API_SECRET,
		secure: true
	});
};

// Upload function
const uploadImage = async (imagePath, options = {}) => {
	try {
		const result = await cloudinary.uploader.upload(imagePath, {
			...options,
			folder: options.folder || 'uploads' // Default folder
		});
		return result;
	} catch (error) {
		console.error('Cloudinary Upload Error:', error);
		throw error;
	}
};

// Get optimized URL
const getOptimizedUrl = (publicId, options = {}) => {
	return cloudinary.url(publicId, {
		fetch_format: 'auto',
		quality: 'auto',
		...options
	});
};

// Get transformed URL (auto-crop)
const getAutoCropUrl = (publicId, options = {}) => {
	return cloudinary.url(publicId, {
		crop: 'auto',
		gravity: 'auto',
		width: 500,
		height: 500,
		...options
	});
};

// Initialize configuration on module load
configureCloudinary();

export {
	cloudinary,
	uploadImage,
	getOptimizedUrl,
	getAutoCropUrl
};