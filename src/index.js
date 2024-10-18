require("dotenv").config();
const cors = require("cors");
const path = require('path');

const express = require("express");
const apiRoute = require("./routes/route");



const app = express();


app.use(cors());
app.use(express.json());
app.use("/api", apiRoute);

app.use(express.static('/public'));

app.get('/', (req, res) => {
    res.sendFile("./index.html");
}); 

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {console.log("EL PUERTO ES: " + PORT)});