
import { User } from "../models/user.js";
import { handleAuthError, validateSignInData, validateSignUpData } from "../utils/validation.js";

// User Signup Controller
export const userSignUp = async (req, res) => {
	try {
		// Validation of data
		validateSignUpData(req);
		const { name, email, password } = req.body;
		// Check existing user
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return handleAuthError(res, 400, "User already exists");
		}
		// Creating a new instance of the User model
		const user = new User({
			name,
			email,
			password
		});

		const savedUser = await user.save();
		const token = await savedUser.generateJWT();

		// Set cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 7 * 24 * 3600 * 1000,
			sameSite: "strict"
		});

		const { password: pass, ...rest } = savedUser._doc;

		res.json({ message: "User Added successfully!", user: rest });
	} catch (err) {
		res.status(400).send("ERROR : " + err.message);
	}
};

// User Signin Controller
export const userSignIn = async (req, res) => {
	try {
		validateSignInData(req)
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return handleAuthError(res, 400, "Invalid credentials");
		}

		// Compare passwords
		const isMatch = user.validatePassword(password);
		if (!isMatch) {
			return handleAuthError(res, 400, "Invalid credentials");
		}

		// Create JWT token
		const token = user.generateJWT();
		// Set cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 7 * 24 * 3600 * 1000,
			sameSite: "strict"
		});

		// Return response without password
		const { password: pass, ...rest } = user._doc;

		res.status(200).json({
			success: true,
			user: rest,
			message: "Login successful"
		});

	} catch (error) {
		console.error("Signin Error:", error);
		res.status(500).json({
			success: false,
			message: "Login failed"
		});
	}
};