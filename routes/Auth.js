import { Router } from "express";
import Users from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import currentUser from "../middleware/currentUser.js";
const route = Router();

// Create User

route.post("/createUser", async (req, res) => {
	try {
		// Check if username or email is in use
		const checkExists = await Users.findOne({
			$or: [{ email: req.body.email }, { username: req.body.username }],
		});
		// return an error email or username is currently in use
		if (checkExists) {
			throw new Error("Username or Email is already in use");
		}
		// encrypte the users password
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(req.body.password, salt);

		// create new user
		const newUser = await Users.create({
			...req.body,
			password: hash,
		});

		const { password, ...others } = newUser._doc;

		res.status(201).json(others);
	} catch (error) {
		res.status(500).json({ errorMsg: error.message });
	}
});

// Login User
route.post("/signIn", async (req, res) => {
	try {
		// Check for username either email
		const user = await Users.findOne({
			$or: [{ email: req.body.userdetail }, { username: req.body.userdetail }],
		});
		// return an error if credentials are not found
		if (!user) {
			throw new Error("Invalid credentials");
		}

		// If user exists confirm the password
		const isPasswordCorrect = await bcrypt.compare(
			req.body.password,
			user.password
		);

		if (!isPasswordCorrect) {
			throw new Error("Invalid credentials");
		}

		// Create a jwt token
		const token = jwt.sign({ id: user._id }, process.env.JWT);
		const { password, isAdmin, ...others } = user._doc;
		res
			.cookie("access_token", token, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
			})
			.status(201)
			.json(others);
	} catch (error) {
		console.log(error);
		res.status(500).json({ errorMsg: error.message });
	}
});

route.post("/logout", async (req, res) => {
	res
		.clearCookie("access_token", {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		})
		.status(200)
		.json({ msg: "User has been logged out" });
});

export default route;
