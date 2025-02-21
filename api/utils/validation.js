import validator from "validator";

export const validateSignUpData = (req) => {
	const { name, email, password } = req.body;
	if (!name) {
		throw new Error("name is required!");
	}
	if (!email) {
		throw new Error("email is required!");
	}
	if (!password) {
		throw new Error("password is required!");
	}

	if (!validator.isEmail(email)) {
		throw new Error("Email is not valid!");
	}
	if (!validator.isStrongPassword(password)) {
		throw new Error("Please enter a strong Password!");
	}
};
export const validateSignInData = (req) => {
	const { name, email, password } = req.body;

	if (!email) {
		throw new Error("email is required!");
	}
	if (!password) {
		throw new Error("password is required!");
	}

	if (!validator.isEmail(email)) {
		throw new Error("Email is not valid!");
	}
};

// Helper function for error handling
export const handleAuthError = (res, status, message) => {
	return res.status(status).json({
		success: false,
		message
	});
};