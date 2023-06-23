import jwt from "jsonwebtoken";
import Users from "../models/User.js";

const currentUser = (req, res, next) => {
	try {
		const token = req.cookies.access_token;
		if (!token) {
			throw new Error("You are not authenticated");
		}
		jwt.verify(token, process.env.JWT, async (err, user) => {
			if (err) throw new Error("Invalid token");
			const currentUser = await Users.findById(user.id);
			req.user = currentUser;
			next();
		});
	} catch (error) {
		res.status(401).json({ errorMsg: error.message });
	}
};


export default currentUser