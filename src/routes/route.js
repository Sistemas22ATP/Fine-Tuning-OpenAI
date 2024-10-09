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

module.exports = router;