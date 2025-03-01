import { User } from "../models/user.js";
import { uploadImage, getOptimizedUrl } from "../config/cloudinary.js";
import { handleAuthError } from "../utils/validation.js";
import multer from "multer";
import fs from "fs/promises";
// Configure multer
const upload = multer({
	dest: "uploads/",
	limits: { fileSize: 2 * 1024 * 1024 }
});

export const updateUserAvatar = async (req, res) => {
	try {
		const userId = req.user?._id;
		if (!userId) {
			return handleAuthError(res, 401, "Unauthorized: Please login first");
		}

		if (!req.file) {
			return handleAuthError(res, 400, "No avatar file provided");
		}

		const user = await User.findById(userId);
		if (!user) {
			return handleAuthError(res, 404, "User not found");
		}

		const uploadResult = await uploadImage(req.file.path, {
			public_id: `user_avatar_${userId}`,
			folder: "user_avatars",
			overwrite: true,
			invalidate: true,
		});


		await fs.unlink(req.file.path);

		const optimizedAvatarUrl = getOptimizedUrl(uploadResult.public_id);
		user.avatar = optimizedAvatarUrl;
		await user.save();

		const { password: pass, ...userData } = user._doc;

		res.status(200).json({
			success: true,
			message: "Avatar updated successfully",
			user: userData,
		});
	} catch (error) {
		console.error("Avatar Update Error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to update avatar",
			error: error.message,
		});
	}
};

// Export as array with middleware
export const updateAvatarRoute = [upload.single("avatar"), updateUserAvatar];