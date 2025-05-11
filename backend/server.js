
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
dotenv.config();

const app =express()

//const PORT = process.env.PORT || 5001;
app.get("/", (req, res)=>{
    res.send("server is back here")
})
app.use(express.json());
app.use("/api/products", productRoutes);



app.listen(5001, () => {
	connectDB();
	console.log("Server started at http://localhost:5001");
});

