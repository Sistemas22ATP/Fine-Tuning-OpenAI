const express = require("express");
const apiController = require("../controllers/apiController"); 
const router = express.Router(); 

router
.post("/test", apiController.Test)
.post("/file-service", apiController.TransformData)
.post("/upload-file", apiController.UploadFile)
.get("/list-files", apiController.ListFiles)
.get("/retrieve-files", apiController.RetrieveFile)
.delete("/delete-file", apiController.DeleteFile)
.post("/create-fine-tune", apiController.CreateFineTune)
.post("/preguntas-persona", apiController.preguntasPersona)

router.post('/preguntas-persona', (req, res) => {
    const { preguntas } = req.body;
    if (!preguntas || preguntas.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron preguntas.' });
    }

    const respuesta = { completion: `Respuesta a: ${preguntas}` };
    res.json(respuesta);
});

module.exports = router;