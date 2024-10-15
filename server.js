const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { TransformData } = require('./src/shared/'); 

const app = express(); 
const PORT = process.env.PORT || 3000; 

app.use(cors()); 
app.use(bodyParser.json());
app.use(Express.static('public'));

app.post('/api/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ answer: "Pregunta no válida." }); 
    }

    try {
        const respuesta = await TransformData([question]);
        res.json({ answer: respuesta[0] })
    } catch (error) {
        console.error(error);
        res.status(500).json({ answer: "Error al procesar la pregunta." }); 
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`); 
});