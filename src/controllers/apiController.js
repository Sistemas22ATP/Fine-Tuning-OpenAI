const fileService = require("../services/file/fileService")
const fineTuneServices = require("../services/file/fineTuneServices")

async function Test (req, res){
    res.send("test ok");
}

async function TransformData (req, res){
    await fileService.TransformData();
    res.send();  
}

//#region File

async function UploadFile (req, res){
    const response = await fileService.UploadFile();
    res.status(200).send(response);
}

async function ListFiles (req, res){
    const response = await fileService.ListFiles();
    res.status(200).send(response);
}

async function RetrieveFile(req, res) {
    var fileId = req.query["fileId"]; 
    const response = await fileService.RetrieveFile(fileId); 

    if (response === "fileId not found") {
        return res.status(404).send(response); 
    }

    return res.status(200).send(response); 
}

async function DeleteFile(req, res) {
    var fileId = req.query["fileId"]; 
    const response = await fileService.DeleteFile(fileId); 

    if (response === "fileId not found") {
        return res.status(404).send(response); 
    }

    return res.status(200).send(response); 
}

//#endregion

//#region Fine-Tune
async function CreateFineTune (req, res){
    var fileId = req.query["fileId"];
    const response = await fineTuneServices.CreateFineTune();
    res.status(200).send(response)
}

//#endregion
module.exports = {
    Test,
    TransformData,
    UploadFile,
    ListFiles,
    RetrieveFile,
    DeleteFile,
    CreateFineTune
}