import express from "express";
import authRoute from "./routes/Auth.js";
import linkRoute from "./routes/links.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./utils/db.js";

const app = express();

// connect to database
connectDB();

//Middleware
app.use(express.json());
app.use(
	cors({
		origin: "https://siss-client.onrender.com",
		credentials: true,
	})
);
app.use(cookieParser());

const port = process.env.PORT;

app.get("/health", (req, res) => {
	res.json({
		msg: "All Systems are a go",
	});
});

app.use("/auth", authRoute);
app.use("/links", linkRoute);

app.listen(port, () => {
	console.log("Node is working ");
});
