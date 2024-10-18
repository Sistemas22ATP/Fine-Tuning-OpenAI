const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/api/preguntas-persona', (req, res) => {
    const { preguntas } = req.body;
    if (preguntas && preguntas.length > 0) {
        // Here you'd add your logic to process the question and return a response
        res.json({ completion: "Esta es la respuesta a tu pregunta: " + preguntas[0] });
    } else {
        res.status(400).json({ error: 'No se proporcionó ninguna pregunta.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});