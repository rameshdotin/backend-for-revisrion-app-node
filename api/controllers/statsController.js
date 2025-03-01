// controllers/userStats.js
import mongoose from "mongoose"; // Missing import for mongoose
import { Subject } from "../models/subject.js";
import { Topic } from "../models/topic.js";
import { calculateStudyStreak } from "../utils/helpers.js";

export const userStats = async (req, res) => { // Fixed typo: 'asysnc' to 'async'
	try {
		const userId = req.user._id; // Assuming user ID comes from auth middleware

		// 1. Total Subjects
		const totalSubjects = await Subject.countDocuments({ userId });

		// 2. Upcoming Revisions
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const upcomingRevisions = await Topic.aggregate([
			{ $match: { userId: new mongoose.Schema.Types.ObjectId(userId) } },
			{
				$project: {
					name: 1,
					subjectId: 1,
					revisionDates: 1,
					upcoming: {
						$filter: {
							input: [
								{ name: "first", date: "$revisionDates.first" },
								{ name: "second", date: "$revisionDates.second" },
								{ name: "third", date: "$revisionDates.third" },
							],
							cond: {
								$and: [
									{ $gte: ["$$this.date", today] },
									{
										$lte: [
											"$$this.date",
											new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
										],
									}, // Next 7 days
								],
							},
						},
					},
				},
			},
			{ $match: { "upcoming.0": { $exists: true } } }, // Only topics with upcoming revisions
			{
				$lookup: {
					from: "subjects",
					localField: "subjectId",
					foreignField: "_id",
					as: "subject",
				},
			},
			{ $unwind: "$subject" },
			{
				$project: {
					topicName: "$name",
					subjectName: "$subject.name",
					upcomingRevisions: {
						$map: {
							input: "$upcoming",
							as: "rev",
							in: { name: "$$rev.name", date: "$$rev.date" },
						},
					},
				},
			},
		]);

		// 3. Study Streak & Completion Rate
		const topics = await Topic.find({ userId }).select("completedRevisions");
		const totalTopics = topics.length;
		let totalCompletedRevisions = 0;
		let allCompletedRevisions = [];

		topics.forEach((topic) => {
			totalCompletedRevisions += topic.completedRevisions.length;
			allCompletedRevisions = allCompletedRevisions.concat(
				topic.completedRevisions
			);
		});

		const totalPossibleRevisions = totalTopics * 3; // 3 revisions per topic
		const completionRate = totalPossibleRevisions
			? ((totalCompletedRevisions / totalPossibleRevisions) * 100).toFixed(2)
			: 0;
		const studyStreak = calculateStudyStreak(allCompletedRevisions);

		// Response
		res.status(200).json({
			totalSubjects,
			upcomingRevisions,
			studyStreak,
			completionRate: `${completionRate}%`,
		});
	} catch (error) {
		console.error("Error fetching user stats:", error);
		res.status(500).json({ message: "Server error" });
	}
};