// utils/helpers.js
// Helper function to calculate study streak

export const calculateStudyStreak = (completedRevisions) => {
	if (!completedRevisions || completedRevisions.length === 0) return 0;

	const sortedDates = completedRevisions
		.map((date) => new Date(date))
		.sort((a, b) => b - a); // Sort descending
	let streak = 0;
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	for (let i = 0; i < sortedDates.length; i++) {
		const currentDate = new Date(sortedDates[i]);
		currentDate.setHours(0, 0, 0, 0);
		const diffDays = Math.round((today - currentDate) / (1000 * 60 * 60 * 24));

		if (diffDays === streak) {
			streak++;
		} else if (diffDays > streak) {
			break;
		}
	}

	return streak;
};