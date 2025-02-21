import { Topic } from "../models/topic.js";
import { Subject } from "../models/subject.js";

export const createTopic = async (req, res) => {
	try {
		const { subjectId } = req.params; // Changed from req.body
		const { name } = req.body;
		const userId = req.user._id;
		console.log('subjectId', subjectId, 'name', name);

		// Validate input
		if (!subjectId || !name?.trim()) {
			return res.status(400).json({
				success: false,
				message: "Subject ID and topic name are required"
			});
		}

		// Verify subject exists and belongs to user
		const subject = await Subject.findOne({ _id: subjectId, userId });
		if (!subject) {
			return res.status(404).json({
				success: false,
				message: "Subject not found or access denied"
			});
		}

		// Check for duplicate topic in the subject
		const existingTopic = await Topic.findOne({
			subjectId,
			name: name.trim()
		});

		if (existingTopic) {
			return res.status(409).json({
				success: false,
				message: "Topic with this name already exists in the subject"
			});
		}

		// Calculate revision dates
		const now = new Date();
		const revisionDates = {
			first: now,
			second: new Date(now.getTime() + 24 * 60 * 60 * 1000), // +24 hours
			third: new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000) // +31 days
		};

		// Create new topic
		const newTopic = new Topic({
			subjectId,
			userId,
			name: name.trim(),
			revisionDates,
			emailSent: {
				first: false,
				second: false,
				third: false
			},
			completedRevisions: []
		});

		const savedTopic = await newTopic.save();

		// Format response
		const responseData = {
			_id: savedTopic._id,
			name: savedTopic.name,
			subjectId: savedTopic.subjectId,
			revisionDates: {
				first: savedTopic.revisionDates.first.toISOString(),
				second: savedTopic.revisionDates.second.toISOString(),
				third: savedTopic.revisionDates.third.toISOString()
			},
			createdAt: savedTopic.createdAt
		};

		res.status(201).json({
			success: true,
			data: responseData,
			message: "Topic created successfully"
		});

	} catch (error) {
		console.error("Topic creation error:", error.message);

		// Handle duplicate key error
		if (error.code === 11000) {
			return res.status(409).json({
				success: false,
				message: "Topic name already exists in this subject"
			});
		}

		// Handle invalid ObjectId format
		if (error.name === 'CastError') {
			return res.status(400).json({
				success: false,
				message: "Invalid subject ID format"
			});
		}

		// Handle validation errors
		if (error.name === 'ValidationError') {
			const messages = Object.values(error.errors).map(err => err.message);
			return res.status(400).json({
				success: false,
				message: messages.join(", ")
			});
		}

		res.status(500).json({
			success: false,
			message: "Internal server error"
		});
	}
};