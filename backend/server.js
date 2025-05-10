import express from "express"

const app =express()

//const PORT = process.env.PORT || 5001;

app.listen(5001, () => {
	
	console.log("Server started at http://localhost:5001");
});