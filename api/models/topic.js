// models/topic.js
import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
	subjectId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Subject',
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	name: {
		type: String,
		required: [true, "Topic name is required"],
		trim: true,
		minlength: [2, "Topic name must be at least 2 characters"],
		maxlength: [200, "Topic name cannot exceed 200 characters"]
	},
	revisionDates: {
		first: { type: Date, required: true },
		second: { type: Date, required: true },
		third: { type: Date, required: true }
	},
	emailSent: {
		first: { type: Boolean, default: false },
		second: { type: Boolean, default: false },
		third: { type: Boolean, default: false }
	},
	completedRevisions: [Date]
}, { timestamps: true });

// Compound index to prevent duplicate topics in a subject
topicSchema.index({ subjectId: 1, name: 1 }, { unique: true });

export const Topic = mongoose.model('Topic', topicSchema);