import { Router } from "express";
import Links from "../models/Link.js";
import currentUser from "../middleware/currentUser.js";
import shortid from "shortid";

const route = Router();

// Create Link

route.post("/createLink", currentUser, async (req, res) => {
	try {
		const shortId = shortid.generate();
		const newSissors = await Links.create({
			...req.body,
			userId: req.user._id,
			shortId,
		});

		res.status(201).json(newSissors);
	} catch (error) {
		res.status(500).json({ errorMsg: error.message });
	}
});

// Create custom Link

route.post("/createLink/custom", currentUser, async (req, res) => {
	const { customID } = req.body;
	try {
		const linkExists = await Links.findOne({ shortId: customID });

		if (linkExists) {
			throw new Error(`${customID} already in use`);
		}

		const newSissors = await Links.create({
			...req.body,
			userId: req.user._id,
			shortId: customID,
		});

		res.status(201).json(newSissors);
	} catch (error) {
		res.status(500).json({ errorMsg: error.message });
	}
});

// Get Links
route.get("/", currentUser, async (req, res) => {
	try {
		const links = await Links.find({ userId: req.user._id }).select({
			desc: 1,
			title: 1,
		});
		res.status(201).json(links);
	} catch (error) {
		res.status(500).json({ errorMsg: error.message });
	}
});

route.get("/detail/:id", currentUser, async (req, res) => {
	try {
		const links = await Links.findOne({ _id: req.params.id });
		res.status(201).json(links);
	} catch (error) {
		res.status(500).json({ errorMsg: error.message });
	}
});

// Edit Link
route.put("/updateLink/:id", currentUser, async (req, res) => {
	try {
		const updatedLink = await Links.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(201).json(updatedLink);
	} catch (error) {
		res.status(500).json({ errorMsg: error.message });
	}
});

// Delete Link
route.delete("/deleteLink/:id", currentUser, async (req, res) => {
	try {
		await Links.findByIdAndDelete(req.params.id);
		res.status(201).json({ msg: "Link deleted" });
	} catch (error) {
		res.status(500).json({ errorMsg: error.message });
	}
});

export default route;
