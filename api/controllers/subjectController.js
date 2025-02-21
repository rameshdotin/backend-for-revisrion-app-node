import { Subject } from "../models/subject.js";

export const createSubject = async (req, res) => {
	try {
		const name = req.body.name;
		if (!name) {
			throw new Error('name is not defined')
		}

		const subject = new Subject({
			userId: req.user._id,
			name
		})

		const savedSubject = await subject.save();

		if (savedSubject) {
			res.json({
				success: true,
				data: savedSubject,
				message: "Subject created successfully"
			})
		}
	} catch (error) {
		console.error("Subject creation Error:", error.message);
		res.status(500).json({
			success: false,
			message: "Something went wrong!"
		});
	}

}