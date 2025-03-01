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
		validateSignInData(req);
		const { email, password, rememberMe } = req.body;

		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return handleAuthError(res, 400, "Invalid credentials");
		}

		const isMatch = await user.validatePassword(password);
		if (!isMatch) {
			return handleAuthError(res, 400, "Invalid credentials");
		}

		// Set token expiration based on rememberMe
		const expiresIn = rememberMe ? "30d" : "7d";
		const token = user.generateJWT(expiresIn);

		// Set cookie with appropriate maxAge
		const maxAge = rememberMe
			? 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
			: 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: maxAge,
			sameSite: "strict",
		});

		const { password: pass, ...rest } = user._doc;

		res.status(200).json({
			success: true,
			user: rest,
			message: "Login successful",
		});
	} catch (error) {
		console.error("Signin Error:", error);
		res.status(500).json({
			success: false,
			message: "Login failed",
		});
	}
};

// User Signout Controller
export const userSignOut = (req, res) => {
	try {
		// Clear the authentication cookie
		res.clearCookie("token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});

		res.status(200).json({
			success: true,
			message: "Logged out successfully",
		});
	} catch (error) {
		console.error("Signout Error:", error);
		res.status(500).json({
			success: false,
			message: "Failed to sign out",
		});
	}
};