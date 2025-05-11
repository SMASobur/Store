
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
dotenv.config();

const app =express()

//const PORT = process.env.PORT || 5001;
app.get("/", (req, res)=>{
    res.send("server is back here")
})
app.use(express.json());
app.post("/api/products", async (req, res) => {
	const product = req.body; // user will send this data

	if (!product.name || !product.price || !product.image) {
		return res.status(400).json({ success: false, message: "Please provide all fields" });
	}

	const newProduct = new Product(product);

	try {
		await newProduct.save();
		res.status(201).json({ success: true, data: newProduct });
	} catch (error) {
		console.error("Error in Create product:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
})



app.listen(5001, () => {
	connectDB();
	console.log("Server started at http://localhost:5001");
});

