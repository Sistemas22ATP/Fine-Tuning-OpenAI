require("dotenv").config();
const apiRoute = require("./routes/route");
const cors = require("cors");
const express = require("express");
const path = require('path'); 
const app = express();
const port = 3000;

app.use("/api", apiRoute);

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.post('/api/preguntas-persona', (req, res) => {
    const { preguntas } = req.body; 
    if (preguntas && preguntas.lenght > 0) {
        res.json ({completion: "Esta es la respuesta a tu pregunta: " + preguntas[0]});
    } else {
        res.status(400).json({error: "No se proporcionó ninuna pregunta."}); 
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});