import jwt from 'jsonwebtoken'
import { User } from '../models/user.js';


export const authenticate = async (req, res, next) => {
	try {
		const { token } = req.cookies;
		if (!token) {
			return res.status(401).send("Please Login!");
		}

		const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

		const { id } = decodedObj;

		const user = await User.findById(id);
		if (!user) {
			throw new Error("User not found");
		}
		const { password: pass, ...rest } = user._doc;
		req.user = rest;
		next();
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
};