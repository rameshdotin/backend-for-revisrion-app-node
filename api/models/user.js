import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET must be defined in environment variables");
}

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxlength: 30,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
		},
		password: {
			type: String,
			required: true,
			minlength: [6, "Password must be at least 6 characters long."],
		},
		avatar: {
			type: String,
			required: true,
			default: "https://flowbite.com/docs/images/people/profile-picture-4.jpg"
		}
	},
	{ timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// JWT generation method
userSchema.methods.generateJWT = function (Days) {
	return jwt.sign(
		{ id: this._id },
		JWT_SECRET,
		{ expiresIn: Days }
	);
};

// Password validation method
userSchema.methods.validatePassword = async function (inputPassword) {
	return await bcrypt.compare(inputPassword, this.password);
};

export const User = mongoose.model("User", userSchema);