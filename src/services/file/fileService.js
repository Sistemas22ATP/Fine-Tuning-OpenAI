const fs = require("fs");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");

async function TransformData() {
    const pdfBuffer = fs.readFileSync("src/shared/vinil-de-corte-oracal-froested-glass-8810.pdf");
    const pdfData = await pdf(pdfBuffer);
    
    const productInfo = pdfData.text;

    const qaPairs = [];

    const addQuestionAnswer = (question, answer) => {
        qaPairs.push({ question, answer });
    };

    addQuestionAnswer("¿Cuál es el grosor del vinil?", extractValue(productInfo, "Grosor"));
    addQuestionAnswer("¿Qué tipo de adhesivo se utiliza?", extractValue(productInfo, "Tipo de dhesivo"));
    addQuestionAnswer("¿Cuál es la durabilidad del vinil?", extractValue(productInfo, "Durabilidad"));
    addQuestionAnswer("¿Qué acabados están disponibles?", extractValue(productInfo, "Acabado"));
    addQuestionAnswer("¿Cuáles son las medidas disponibles?", extractValue(productInfo, "Medidas"));
    addQuestionAnswer("¿Qué colores están disponibles?", extractValue(productInfo, "Color"));
    addQuestionAnswer("¿Cómo se debe almacenar el vinil?", extractValue(productInfo, "Cómo se debe almacenar"));
    addQuestionAnswer("¿Cuál es la vida en anaquel del vinil?", extractValue(productInfo, "Vida en anaquel"));
    addQuestionAnswer("¿Para qué aplicaciones es adecuado este vinil?", extractValue(productInfo, "Aplicaciones del vinil"));
    addQuestionAnswer("¿Qué precauciones se deben tomar al aplicar el vinil?", extractValue(productInfo, "Precauciones al aplicar"));
    addQuestionAnswer("¿Cuáles son las propiedades de resistencia del vinil?", extractValue(productInfo, "Propiedades de resistencia"));

    for (const item of qaPairs) {
        const object = `{"prompt": "${item.question} ->", "completion": "${item.answer} END"}`;
        fs.appendFileSync("src/shared/data-set.jsonl", object + "\r\n", "utf8");
    }
}

function extractValue(text, keyword) {
    const regex = new RegExp(`${keyword}:?\\s*([^\\n]*)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : "Información no disponible.";
}

async function UploadFile() {
    const openai = new OpenAI({
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
    });

    const fileStream = fs.createReadStream("src/shared/data-set.jsonl");
    const response = await openai.files.create({
        file: fileStream,
        purpose: 'fine-tune', 
    });

    return response; 
}

async function ListFiles(){
    const openai = new OpenAI({
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
    });

    const response = await openai.files.list();
    return response; 
}

async function RetrieveFile(fileId){
    const openai = new OpenAI({
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
    });

    try {
        const response = await openai.files.retrieve(fileId); 
        return response;
    } catch(e) {
        return "fileId not found"; 
    }
}

async function DeleteFile(fileId){
    const openai = new OpenAI({
        apiKey: "sk-RB4yfZYpnaZxx75-_ERoriYYm0BaUQRdndYcYG9N0-T3BlbkFJld_0D-SrMLuifCK_WPRJkSWGEQAONhbCAj_y9c9zYA",
    });

    try {
        const response = await openai.files.delete(fileId); 
        return response;
    } catch(e) {
        return "fileId not found"; 
    }
}

module.exports = {
    TransformData,
    UploadFile,
    ListFiles,
    RetrieveFile,
    DeleteFile
}