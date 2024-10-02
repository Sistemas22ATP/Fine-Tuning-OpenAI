const express = require("express");
const apiRoute = require("./routes/route");

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use("/api", apiRoute);

app.get("/", (req, res)=>{
    res.json({a: "hola"});
})
app.listen(PORT, () => {console.log("EL PUERTO ES: " + PORT)}) 