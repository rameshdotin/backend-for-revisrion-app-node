// models/subject.js
import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	name: {
		type: String,
		required: [true, "Subject name is required"],
		trim: true,
		minlength: [2, "Subject name must be at least 2 characters"],
		maxlength: [100, "Subject name cannot exceed 100 characters"]
	}
}, { timestamps: true });

// Add unique compound index
subjectSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Subject = mongoose.model('Subject', subjectSchema);