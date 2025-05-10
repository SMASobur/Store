import express from "express"

const app =express()

//const PORT = process.env.PORT || 5001;
app.get("/", (req, res)=>{
    res.send("server is back here")
})

app.listen(5001, () => {
	
	console.log("Server started at http://localhost:5001");
});