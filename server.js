const express = require('express');
const bodyParser = require('body-parser');
const { TransformData } = require('./src/shared/backendFunctions'); 

const app = express(); 
const PORT = process.env.PORT || 3000; 

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ answer: "Pregunta no válida." }); 
    }

    try {
        const respuesta = await TransformData([question]); 
    }
})